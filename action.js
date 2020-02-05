const core = require('@actions/core');
const command = require('@actions/core/lib/command');
const got = require('got');

const AUTH_METHODS = ['approle', 'token'];
const VALID_KV_VERSION = [-1, 1, 2];

async function exportSecrets() {
    const vaultUrl = core.getInput('url', { required: true });
    const vaultNamespace = core.getInput('namespace', { required: false });

    let enginePath = core.getInput('path', { required: false });
    let kvVersion = core.getInput('kv-version', { required: false });
    const useKv = core.getInput('useKv', { required: false });

    const secretsInput = core.getInput('secrets', { required: true });
    const secrets = parseSecretsInput(secretsInput);

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
        if (useKv !== false) {
            kvVersion = 2;
        } else {
            kvVersion = -1;
        }
    }
    kvVersion = +kvVersion;

    if (Number.isNaN(kvVersion) || !VALID_KV_VERSION.includes(kvVersion)) {
        throw Error(`You must provide a valid K/V version (${VALID_KV_VERSION.slice(1).join(', ')}). Input: "${kvVersion}"`);
    }

    kvVersion = parseInt(kvVersion);

    const responseCache = new Map();
    for (const secret of secrets) {
        const { secretPath, outputName, secretSelector } = secret;
        const requestOptions = {
            headers: {
                'X-Vault-Token': vaultToken
            },
        };

        if (vaultNamespace != null) {
            requestOptions.headers["X-Vault-Namespace"] = vaultNamespace;
        }

        const requestPath = (kvVersion === 2)
                            ? `${vaultUrl}/v1/${enginePath}/data/${secretPath}`
                            : `${vaultUrl}/v1/${enginePath}/${secretPath}`;
        let result;
        if (responseCache.has(requestPath)) {
            result = responseCache.get(requestPath);
        } else {
            result = await got(requestPath, requestOptions);
        }

        const secretData = getResponseData(result.body, kvVersion);
        const value = selectData(secretData, secretSelector);
        command.issue('add-mask', value);
        core.exportVariable(outputName, `${value}`);
        core.debug(`✔ ${secretPath} => ${outputName}`);
    }
};

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

    /** @type {{ secretPath: string; outputName: string; dataKey: string; }[]} */
    const output = [];
    for (const secret of secrets) {
        let path = secret;
        let outputName = null;

        const renameSigilIndex = secret.lastIndexOf('|');
        if (renameSigilIndex > -1) {
            path = secret.substring(0, renameSigilIndex).trim();
            outputName = secret.substring(renameSigilIndex + 1).trim();

            if (outputName.length < 1) {
                throw Error(`You must provide a value when mapping a secret to a name. Input: "${secret}"`);
            }
        }

        const pathParts = path
            .split(/\s+/)
            .map(part => part.trim())
            .filter(part => part.length !== 0);

        if (pathParts.length !== 2) {
            throw Error(`You must provide a valid path and key. Input: "${secret}"`)
        }

        const [secretPath, secretSelector] = pathParts;

        // If we're not using a mapped name, normalize the key path into a variable name.
        if (!outputName) {
            outputName = normalizeOutputKey(secretSelector);
        }

        output.push({
            secretPath,
            outputName,
            secretSelector
        });
    }
    return output;
}

/**
 * Parses a JSON response and returns the secret data
 * @param {string} responseBody
 * @param {number} kvVersion
 */
function getResponseData(responseBody, kvVersion) {
    const parsedResponse = JSON.parse(responseBody);
    let secretData;

    switch(kvVersion) {
        case 1: {
            secretData = parsedResponse.data;
        } break;

        case 2: {
            const vaultKeyData = parsedResponse.data;
            secretData = vaultKeyData.data;
        } break;

        default: {
            secretData = parsedResponse;
        } break;
    }

    return secretData;
}

/**
 * Parses a JSON response and returns the secret data
 * @param {Object} data
 * @param {string} selector
 */
function selectData(data, selector) {
    if (!selector.startsWith('$')) {
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

module.exports = {
    exportSecrets,
    parseSecretsInput,
    parseResponse: getResponseData,
    normalizeOutputKey
};
