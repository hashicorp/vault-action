// @ts-check
// @ts-ignore
const core = require('@actions/core');
const got = require('got');

async function exportSecrets() {
    const vaultUrl = core.getInput('vaultUrl', { required: true });
    const vaultToken = core.getInput('vaultToken', { required: true });

    const keysInput = core.getInput('keys', { required: true });
    const keys = parseKeysInput(keysInput);

    for (const key of keys) {
        const [keyPath, { outputName, dataKey }] = key;
        const result = await got(`${vaultUrl}/v1/secret/data/${keyPath}`, {
            headers: {
                'X-Vault-Token': vaultToken
            }
        });

        const parsedResponse = JSON.parse(result.body);
        const vaultKeyData = parsedResponse.data;
        const versionData = vaultKeyData.data;
        const value = versionData[dataKey];
        core.exportSecret(outputName, value);
        core.debug(`✔ ${keyPath} => ${outputName}`);
    }
};

/**
 * Parses a keys input string into key paths and their resulting environment variable name.
 * @param {string} keys 
 */
function parseKeysInput(keys) {
    const keyPairs = keys
        .split(';')
        .filter(key => !!key)
        .map(key => key.trim())
        .filter(key => key.length !== 0);

    /** @type {Map<string, { outputName: string; dataKey: string; }>} */
    const output = new Map();
    for (const keyPair of keyPairs) {
        let path = keyPair;
        let outputName = null;

        const renameSigilIndex = keyPair.lastIndexOf('|');
        if (renameSigilIndex > -1) {
            path = keyPair.substring(0, renameSigilIndex).trim();
            outputName = keyPair.substring(renameSigilIndex + 1).trim();

            if (outputName.length < 1) {
                throw Error(`You must provide a value when mapping a secret to a name. Input: "${keyPair}"`);
            }
        }

        const pathParts = path
            .split(/\s+/)
            .map(part => part.trim())
            .filter(part => part.length !== 0);

        if (pathParts.length !== 2) {
            throw Error(`You must provide a valid path and key. Input: "${keyPair}"`)
        }

        const [secretPath, dataKey] = pathParts;

        // If we're not using a mapped name, normalize the key path into a variable name.
        if (!outputName) {
            outputName = normalizeKeyName(dataKey);
        }
        
        output.set(secretPath, {
            outputName,
            dataKey
        });
    }
    return output;
}

/**
 * Replaces any forward-slash characters to 
 * @param {string} keyPath
 */
function normalizeKeyName(keyPath) {
    return keyPath.replace('/', '__').replace(/[^\w-]/, '').toUpperCase();
}

module.exports = {
    exportSecrets,
    parseKeysInput,
    normalizeKeyName
};