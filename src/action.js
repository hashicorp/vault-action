// @ts-check
const core = require('@actions/core');
const command = require('@actions/core/lib/command');
const got = require('got').default;
const jsonata = require('jsonata');
const { normalizeOutputKey } = require('./utils');
const { WILDCARD } = require('./constants');

const { auth: { retrieveToken }, secrets: { getSecrets } } = require('./index');

const VAULT_TOKEN_STATE = "VAULT_TOKEN";
const AUTH_METHODS = ['approle', 'token', 'github', 'jwt', 'kubernetes', 'ldap', 'userpass'];
const ENCODING_TYPES = ['base64', 'hex', 'utf8'];


function getDefaultOptions() {
    const vaultUrl = core.getInput('url', { required: true });

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

    const extraHeaders = parseHeadersInput('extraHeaders', { required: false });
    const vaultNamespace = core.getInput('namespace', { required: false });
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

    return defaultOptions
}

async function exportSecrets() {
    const exportEnv = core.getInput('exportEnv', { required: false }) != 'false';
    const revokeToken = core.getInput("revokeToken", { required: false }) !== 'false'
    const outputToken = (core.getInput('outputToken', { required: false }) || 'false').toLowerCase() != 'false';
    const exportToken = (core.getInput('exportToken', { required: false }) || 'false').toLowerCase() != 'false';

    const secretsInput = core.getInput('secrets', { required: false });
    const secretRequests = parseSecretsInput(secretsInput);

    const secretEncodingType = core.getInput('secretEncodingType', { required: false });

    const vaultMethod = (core.getInput('method', { required: false }) || 'token').toLowerCase();
    const authPayload = core.getInput('authPayload', { required: false });
    if (!AUTH_METHODS.includes(vaultMethod) && !authPayload) {
        throw Error(`Sorry, the provided authentication method ${vaultMethod} is not currently supported and no custom authPayload was provided.`);
    }

    const defaultOptions = getDefaultOptions();
    const vaultToken = await retrieveToken(vaultMethod, got.extend(defaultOptions));
    core.setSecret(vaultToken)
    if (revokeToken) {
        core.saveState(VAULT_TOKEN_STATE, vaultToken)
    }
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

    const results = await getSecrets(requests, client);


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
*/

/**
 * Parses a secrets input string into key paths and their resulting environment variable name.
 * @param {string} secretsInput
 */
function parseSecretsInput(secretsInput) {
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

        if (pathParts.length !== 2) {
            throw Error(`You must provide a valid path and key. Input: "${secret}"`);
        }

        const [path, selectorQuoted] = pathParts;

        /** @type {any} */
        const selectorAst = jsonata(selectorQuoted).ast();
        const selector = selectorQuoted.replace(new RegExp('"', 'g'), '');

        if (selector !== WILDCARD && (selectorAst.type !== "path" || selectorAst.steps[0].stages) && selectorAst.type !== "string" && !outputVarName) {
            throw Error(`You must provide a name for the output key when using json selectors. Input: "${secret}"`);
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
            selector
        });
    }
    return output;
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

async function revokeToken() {
    const token = core.getState(VAULT_TOKEN_STATE)
    if (!token || token === "") {
        core.debug(`provided token in state (${VAULT_TOKEN_STATE}) is empty. skipping...`)
        return
    }
    core.setSecret(token)

    const defaultOptions = getDefaultOptions();
    defaultOptions.headers['X-Vault-Token'] = token;
    const client = got.extend(defaultOptions);
    try {
        await revokeClientToken(client)
    } catch (err) {
        throw err
    }
}

/**
  * @param {import('got').Got} client
  */
async function revokeClientToken(client) {
    const path = "v1/auth/token/revoke-self"
    /** @type {'json'} */
    const responseType = 'json';
    var options = {
        responseType,
    };

    core.debug(`Revoking Vault Token from ${path} endpoint`);

    let response;
    try {
        response = await client.post(path, options);
    } catch (err) {
        if (err instanceof got.HTTPError) {
            throw Error(`failed to revoke vault token. code: ${err.code}, message: ${err.message}, vaultResponse: ${JSON.stringify(err.response.body)}`)
        } else {
            throw err
        }
    }
    core.debug('✔ Vault Token successfully revoked');
}

module.exports = {
    exportSecrets,
    parseSecretsInput,
    parseHeadersInput,
    getDefaultOptions,
    revokeToken,
    VAULT_TOKEN_STATE
};

