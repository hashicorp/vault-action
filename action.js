// @ts-check
// @ts-ignore
const core = require('@actions/core');
const got = require('got');
const jq = require('jsonpath');

async function exportSecrets() {
    const vaultUrl = core.getInput('vaultUrl', { required: true });
    const vaultToken = core.getInput('vaultToken', { required: true });

    const keysInput = core.getInput('keys', { required: true });
    const keys = parseKeysInput(keysInput);

    for (const key of keys) {
        const [keyPath, { name, query }] = key;
        const result = await got(`${vaultUrl}/secret/data/${keyPath}`, {
            headers: {
                'Accept': 'application/json',
                'X-Vault-Token': vaultToken
            }
        });

        const parsedResponse = JSON.parse(result.body);
        let value = parsedResponse.data;
        if (query) {
            value = jq.value(value, query);
        }
        core.exportSecret(name, value);
        core.debug(`✔ ${keyPath} => ${name}`);
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

    /** @type {Map<string, { name: string; query: string; }>} */
    const output = new Map();
    for (const keyPair of keyPairs) {
        let path = keyPair;
        let mappedName = null;
        let query = null;

        const renameSigilIndex = keyPair.lastIndexOf('|');
        if (renameSigilIndex > -1) {
            path = keyPair.substring(0, renameSigilIndex).trim();
            mappedName = keyPair.substring(renameSigilIndex + 1).trim();

            if (mappedName.length < 1) {
                throw Error(`You must provide a value when mapping a secret to a name. Input: "${keyPair}"`);
            }
        }

        const pathPair = path;
        const querySigilIndex = pathPair.indexOf('>');
        if (querySigilIndex > -1) {
            path = pathPair.substring(0, querySigilIndex).trim();
            query = pathPair.substring(querySigilIndex + 1).trim();

            try {
                const expression = jq.parse(query);
                if (expression.length === 0) {
                    throw Error(`Invalid query expression provided "${query}" from "${keyPair}".`);
                }
            } catch (_) {
                throw Error(`Invalid query expression provided "${query}" from "${keyPair}".`);
            }
        }

        if (path.length === 0) {
            throw Error(`You must provide a valid path. Input: "${keyPair}"`)
        }

        // If we're not using a mapped name, normalize the key path into a variable name.
        if (!mappedName) {
            mappedName = normalizeKeyName(path);
        }
        
        output.set(path, {
            name: mappedName,
            query
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