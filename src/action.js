// @ts-check
const core = require('@actions/core');
const command = require('@actions/core/lib/command');
const got = require('got').default;
const jsonata = require('jsonata');
const { auth: { retrieveToken }, secrets: { getSecrets, writeSecrets } } = require('./index');

const AUTH_METHODS = ['approle', 'token', 'github', 'jwt', 'kubernetes', 'ldap', 'userpass'];
const ENCODING_TYPES = ['base64', 'hex', 'utf8'];
const SECRETS_METHOD = { Read: "read", Write: "write" };

async function exportSecrets() {
    const vaultUrl = core.getInput('url', { required: true });
    const vaultNamespace = core.getInput('namespace', { required: false });
    const extraHeaders = parseHeadersInput('extraHeaders', { required: false });
    const exportEnv = core.getInput('exportEnv', { required: false }) != 'false';
    const outputToken = (core.getInput('outputToken', { required: false }) || 'false').toLowerCase() != 'false';
    const exportToken = (core.getInput('exportToken', { required: false }) || 'false').toLowerCase() != 'false';
    const secretsMethod = core.getInput('secretsMethod', { required: false });

    const secretsInput = core.getInput('secrets', { required: false });
    const secretRequests = parseSecretsInput(secretsInput, secretsMethod);

    const secretEncodingType = core.getInput('secretEncodingType', { required: false });

    const vaultMethod = (core.getInput('method', { required: false }) || 'token').toLowerCase();
    const authPayload = core.getInput('authPayload', { required: false });
    if (!AUTH_METHODS.includes(vaultMethod) && !authPayload) {
        throw Error(`Sorry, the provided authentication method ${vaultMethod} is not currently supported and no custom authPayload was provided.`);
    }

    const defaultOptions = {
        prefixUrl: vaultUrl,
        headers: {},
        https: {},
        retry: {
            statusCodes: [
                ...got.defaults.options.retry.statusCodes,
                // Vault returns 412 when the token in use hasn't yet been replicated
                // to the performance replica queried. See issue #332.
                412,
            ]
        }
    }

    const tlsSkipVerify = (core.getInput('tlsSkipVerify', { required: false }) || 'false').toLowerCase() != 'false';
    if (tlsSkipVerify === true) {
        defaultOptions.https.rejectUnauthorized = false;
    }

    const caCertificateRaw = core.getInput('caCertificate', { required: false });
    if (caCertificateRaw != null) {
        defaultOptions.https.certificateAuthority = Buffer.from(caCertificateRaw, 'base64').toString();
    }

    const clientCertificateRaw = core.getInput('clientCertificate', { required: false });
    if (clientCertificateRaw != null) {
	    defaultOptions.https.certificate = Buffer.from(clientCertificateRaw, 'base64').toString();
    }

    const clientKeyRaw = core.getInput('clientKey', { required: false });
    if (clientKeyRaw != null) {
	    defaultOptions.https.key = Buffer.from(clientKeyRaw, 'base64').toString();
    }

    for (const [headerName, headerValue] of extraHeaders) {
        defaultOptions.headers[headerName] = headerValue;
    }

    if (vaultNamespace != null) {
        defaultOptions.headers["X-Vault-Namespace"] = vaultNamespace;
    }

    const vaultToken = await retrieveToken(vaultMethod, got.extend(defaultOptions));
    core.setSecret(vaultToken)
    defaultOptions.headers['X-Vault-Token'] = vaultToken;
    const client = got.extend(defaultOptions);

    if (outputToken === true) {
      core.setOutput('vault_token', `${vaultToken}`);
    }
    if (exportToken === true) {
        core.exportVariable('VAULT_TOKEN', `${vaultToken}`);
    }

    const requests = secretRequests.map(request => {
        const { path, selector } = request;
        return request;
    });

    let results = null;
    switch (secretsMethod) {
        case SECRETS_METHOD.Read:
             results = await getSecrets(requests, client);
            break;
        case SECRETS_METHOD.Write:
             results =  await writeSecrets(requests, client);
            break;
        default:
             results =  await getSecrets(requests, client);
            break;
    }

    for (const result of results) {
        // Output the result

        var value = result.value;
        const request = result.request;
        const cachedResponse = result.cachedResponse;

        if (cachedResponse) {
            core.debug('ℹ using cached response');
        }

        // if a secret is encoded, decode it
        if (ENCODING_TYPES.includes(secretEncodingType)) {
            value = Buffer.from(value, secretEncodingType).toString();
        }

        for (const line of value.replace(/\r/g, '').split('\n')) {
            if (line.length > 0) {
                core.setSecret(line);
            }
        }
        if (exportEnv) {
            core.exportVariable(request.envVarName, `${value}`);
        }
        core.setOutput(request.outputVarName, `${value}`);
        core.debug(`✔ ${request.path} => outputs.${request.outputVarName}${exportEnv ? ` | env.${request.envVarName}` : ''}`);
    }
};

/** @typedef {Object} SecretRequest
 * @property {string} path
 * @property {string} envVarName
 * @property {string} outputVarName
 * @property {string} selector
 * @property {string} secretsMethod
 * @property {Map} secretsData
*/

/**
 * Parses a secrets input string into key paths and their resulting environment variable name.
 * @param {string} secretsInput
 * @param {string} secretsMethod
 */
function parseSecretsInput(secretsInput, secretsMethod) {
    if (!secretsInput) {
      return []
    }

    const secrets = secretsInput
        .split(';')
        .filter(key => !!key)
        .map(key => key.trim())
        .filter(key => key.length !== 0);

    /** @type {SecretRequest[]} */
    const output = [];
    for (const secret of secrets) {
        let pathSpec = secret;
        let outputVarName = null;

        const renameSigilIndex = secret.lastIndexOf('|');
        if (renameSigilIndex > -1) {
            pathSpec = secret.substring(0, renameSigilIndex).trim();
            outputVarName = secret.substring(renameSigilIndex + 1).trim();

            if (outputVarName.length < 1) {
                throw Error(`You must provide a value when mapping a secret to a name. Input: "${secret}"`);
            }
        }

        const pathParts = pathSpec
            .split(/\s+/)
            .map(part => part.trim())
            .filter(part => part.length !== 0);

        let path = null;
        let selector = '';
        let secretsData = new Map();
        if(secretsMethod === SECRETS_METHOD.Write) {
            if (pathParts.length < 2) {
                throw Error(`You must provide a valid path and key. Input: "${secret}"`);
            }
            let writeSelectorParts = null;
            let finalSelector = [];
            for (let index = 0; index < pathParts.length; index++) {
                const element = pathParts[index];
                if(index == 0) {
                    path = element;
                    continue;
                }
                //if a secret is for write, it should be saperated by "="
                writeSelectorParts = element
                    .split("=")
                    .map(part => part.trim())
                    .filter(part => part.length !== 0);
                
                const [writeSelectorKey, writeSelectorValue] = writeSelectorParts;

                /** @type {any} */
                const selectorAst = jsonata(writeSelectorKey).ast();
                const writeSelector = writeSelectorKey.replace(new RegExp('"', 'g'), '');

                if ((selectorAst.type !== "path" || selectorAst.steps[0].stages) && selectorAst.type !== "string" && !outputVarName) {
                    throw Error(`Write Secret: You must provide a name for the output key when using json selectors. Input: "${secret}"`);
                }

                if(writeSelector !=='\\') {
                    finalSelector.push(writeSelector);
                    secretsData.set(writeSelector, writeSelectorValue);
                }
            }
            selector = finalSelector.join('__');
        } else {
            if (pathParts.length !== 2) {
                throw Error(`You must provide a valid path and key. Input: "${secret}"`);
            }

            path = pathParts[0];
            const selectorQuoted = pathParts[1];

            /** @type {any} */
            const selectorAst =  jsonata(selectorQuoted).ast();
            selector = selectorQuoted.replace(new RegExp('"', 'g'), '');

            if ((selectorAst.type !== "path" || selectorAst.steps[0].stages) && selectorAst.type !== "string" && !outputVarName) {
                throw Error(`Read Secret: You must provide a name for the output key when using json selectors. Input: "${secret}"`);
            }
        }

        let envVarName = outputVarName;
        if (!outputVarName) {
            outputVarName = normalizeOutputKey(selector);
            envVarName = normalizeOutputKey(selector, true);
        }

        output.push({
            path,
            envVarName,
            outputVarName,
            selector,
            secretsMethod,
            secretsData
        });
    }
    return output;
}

/**
 * Replaces any dot chars to __ and removes non-ascii charts
 * @param {string} dataKey
 * @param {boolean=} isEnvVar
 */
function normalizeOutputKey(dataKey, isEnvVar = false) {
    let outputKey = dataKey
        .replace('.', '__').replace(new RegExp('-', 'g'), '').replace(/[^\p{L}\p{N}_-]/gu, '');
    if (isEnvVar) {
        outputKey = outputKey.toUpperCase();
    }
    return outputKey;
}

/**
 * @param {string} inputKey
 * @param {any} inputOptions
 */
function parseHeadersInput(inputKey, inputOptions) {
    /** @type {string}*/
    const rawHeadersString = core.getInput(inputKey, inputOptions) || '';
    const headerStrings = rawHeadersString
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '');
    return headerStrings
        .reduce((map, line) => {
            const seperator = line.indexOf(':');
            const key = line.substring(0, seperator).trim().toLowerCase();
            const value = line.substring(seperator + 1).trim();
            if (map.has(key)) {
                map.set(key, [map.get(key), value].join(', '));
            } else {
                map.set(key, value);
            }
            return map;
        }, new Map());
}

module.exports = {
    exportSecrets,
    parseSecretsInput,
    normalizeOutputKey,
    parseHeadersInput
};
