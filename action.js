const core = require('@actions/core');
const command = require('@actions/core/lib/command');
const got = require('got');

async function exportSecrets() {
    const _methods = ['approle', 'token'];

    const vaultUrl = core.getInput('url', { required: true });
    const vaultRoleId = core.getInput('roleId', { required: false });
    const vaultSecretId = core.getInput('secretId', { required: false });
    const vaultNamespace = core.getInput('namespace', { required: false });

    let vaultMethod = core.getInput('method', { required: false });
    let vaultToken = core.getInput('token', { required: false });

    const secretsInput = core.getInput('secrets', { required: true });
    const secrets = parseSecretsInput(secretsInput);

    if (!vaultMethod) {
        vaultMethod = 'token';
    }

    if (!_methods.includes(vaultMethod)) {
        throw Error(`Sorry, the authentication method ${vaultMethod} is not currently supported.`);
    }

    switch (vaultMethod) {
        case 'approle':
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
            if (!vaultToken) {
                throw Error(`No token was provided. You must provided a valid vault token if using token authentication.`);
            }
            break;
    }

    for (const secret of secrets) {
        const { secretPath, outputName, secretKey } = secret;
        const requestOptions = {
            headers: {
                'X-Vault-Token': vaultToken
            },
        };

        if (vaultNamespace != null) {
            requestOptions.headers["X-Vault-Namespace"] = vaultNamespace;
        }

        const result = await got(`${vaultUrl}/v1/secret/data/${secretPath}`, requestOptions);

        const parsedResponse = JSON.parse(result.body);
        const vaultKeyData = parsedResponse.data;
        const versionData = vaultKeyData.data;
        const value = versionData[secretKey];
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

        const [secretPath, secretKey] = pathParts;

        // If we're not using a mapped name, normalize the key path into a variable name.
        if (!outputName) {
            outputName = normalizeOutputKey(secretKey);
        }

        output.push({
            secretPath,
            outputName,
            secretKey
        });
    }
    return output;
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
    normalizeOutputKey
};
