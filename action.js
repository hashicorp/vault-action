// @ts-check

// @ts-ignore
const core = require('@actions/core');
// @ts-ignore
const command = require('@actions/core/lib/command');
const got = require('got');

const AUTH_METHODS = ['approle', 'token'];
const VALID_KV_VERSION = [-1, 1, 2];

async function exportSecrets() {
    const vaultUrl = core.getInput('url', { required: true });
    const vaultNamespace = core.getInput('namespace', { required: false });
    const extraHeaders = parseHeadersInput('extraHeaders', { required: false });

    let enginePath = core.getInput('path', { required: false });
    let kvVersion = core.getInput('kv-version', { required: false });

    const secretsInput = core.getInput('secrets', { required: true });
    const secretRequests = parseSecretsInput(secretsInput);

    const vaultMethod = core.getInput('method', { required: false }) || 'token';
    if (!AUTH_METHODS.includes(vaultMethod)) {
        throw Error(`Sorry, the authentication method ${vaultMethod} is not currently supported.`);
    }

    let vaultToken = null;
    switch (vaultMethod) {
        case 'approle':
            const vaultRoleId = core.getInput('roleId', { required: true });
            const vaultSecretId = core.getInput('secretId', { required: true });
            core.debug('Try to retrieve Vault Token from approle');
            var options = {
                headers: {},
                json: { role_id: vaultRoleId, secret_id: vaultSecretId },
                responseType: 'json'
            };

            if (vaultNamespace != null) {
                options.headers["X-Vault-Namespace"] = vaultNamespace;
            }

            /** @type {any} */
            const result = await got.post(`${vaultUrl}/v1/auth/approle/login`, options);
            if (result && result.body && result.body.auth && result.body.auth.client_token) {
                vaultToken = result.body.auth.client_token;
                core.debug('✔ Vault Token has retrieved from approle');
            } else {
                throw Error(`No token was retrieved with the role_id and secret_id provided.`);
            }
            break;
        default:
            vaultToken = core.getInput('token', { required: true });
            break;
    }

    if (!enginePath) {
        enginePath = 'secret';
    }

    if (!kvVersion) {
        kvVersion = 2;
    }
    kvVersion = +kvVersion;

    if (Number.isNaN(kvVersion) || !VALID_KV_VERSION.includes(kvVersion)) {
        throw Error(`You must provide a valid K/V version (${VALID_KV_VERSION.slice(1).join(', ')}). Input: "${kvVersion}"`);
    }

    const responseCache = new Map();
    for (const secretRequest of secretRequests) {
        const { secretPath, outputVarName, envVarName, secretSelector, isJSONPath } = secretRequest;
        const requestOptions = {
            headers: {
                'X-Vault-Token': vaultToken
            },
        };

        for (const [headerName, headerValue] of extraHeaders) {
            requestOptions.headers[headerName] = headerValue;
        }

        if (vaultNamespace != null) {
            requestOptions.headers["X-Vault-Namespace"] = vaultNamespace;
        }

        let requestPath = `${vaultUrl}/v1`;
        const kvRequest = !secretPath.startsWith('/')
        if (!kvRequest) {
            requestPath += secretPath;
        } else {
           requestPath += (kvVersion === 2)
                    ? `/${enginePath}/data/${secretPath}`
                    : `/${enginePath}/${secretPath}`;
        }

        let body;
        if (responseCache.has(requestPath)) {
            body = responseCache.get(requestPath);
            core.debug('ℹ using cached response');
        } else {
            const result = await got(requestPath, requestOptions);
            body = result.body;
            responseCache.set(requestPath, body);
        }

        let dataDepth = isJSONPath === true ? 0 : kvRequest === false ? 1 : kvVersion;

        const secretData = getResponseData(body, dataDepth);
        const value = selectData(secretData, secretSelector, isJSONPath);
        command.issue('add-mask', value);
        core.exportVariable(envVarName, `${value}`);
        core.setOutput(outputVarName, `${value}`);
        core.debug(`✔ ${secretPath} => outputs.${outputVarName} | env.${envVarName}`);
    }
};

/** @typedef {Object} SecretRequest 
 * @property {string} secretPath
 * @property {string} envVarName
 * @property {string} outputVarName
 * @property {string} secretSelector
 * @property {boolean} isJSONPath
*/

/**
 * Parses a secrets input string into key paths and their resulting environment variable name.
 * @param {string} secretsInput
 */
function parseSecretsInput(secretsInput) {
    const secrets = secretsInput
        .split(';')
        .filter(key => !!key)
        .map(key => key.trim())
        .filter(key => key.length !== 0);

    /** @type {SecretRequest[]} */
    const output = [];
    for (const secret of secrets) {
        let path = secret;
        let outputVarName = null;

        const renameSigilIndex = secret.lastIndexOf('|');
        if (renameSigilIndex > -1) {
            path = secret.substring(0, renameSigilIndex).trim();
            outputVarName = secret.substring(renameSigilIndex + 1).trim();

            if (outputVarName.length < 1) {
                throw Error(`You must provide a value when mapping a secret to a name. Input: "${secret}"`);
            }
        }

        const pathParts = path
            .split(/\s+/)
            .map(part => part.trim())
            .filter(part => part.length !== 0);

        if (pathParts.length !== 2) {
            throw Error(`You must provide a valid path and key. Input: "${secret}"`);
        }

        const [secretPath, secretSelector] = pathParts;

        const isJSONPath = secretSelector.includes('.');

        if (isJSONPath && !outputVarName) {
            throw Error(`You must provide a name for the output key when using json selectors. Input: "${secret}"`);
        }

        let envVarName = outputVarName;
        if (!outputVarName) {
            outputVarName = secretSelector;
            envVarName = normalizeOutputKey(outputVarName);
        }

        output.push({
            secretPath,
            envVarName,
            outputVarName,
            secretSelector,
            isJSONPath
        });
    }
    return output;
}

/**
 * Parses a JSON response and returns the secret data
 * @param {string} responseBody
 * @param {number} dataLevel
 */
function getResponseData(responseBody, dataLevel) {
    let secretData = JSON.parse(responseBody);

    for (let i = 0; i < dataLevel; i++) {
        secretData = secretData['data'];
    }
    return secretData;
}

/**
 * Parses a JSON response and returns the secret data
 * @param {Object} data
 * @param {string} selector
 */
function selectData(data, selector, isJSONPath) {
    if (!isJSONPath) {
        return data[selector];
    }

    // TODO: JSONPath
}

/**
 * Replaces any forward-slash characters to
 * @param {string} dataKey
 */
function normalizeOutputKey(dataKey) {
    return dataKey.replace('/', '__').replace(/[^\w-]/, '').toUpperCase();
}

// @ts-ignore
/**
 * @param {string} input
 */
function parseBoolInput(input) {
    if (input === null || input === undefined || input.trim() === '') {
        return null;
    }
    return Boolean(input);
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
    parseResponse: getResponseData,
    normalizeOutputKey,
    parseHeadersInput
};
