const jsonata = require("jsonata");


/**
 * @typedef {Object} SecretRequest
 * @property {string} path
 * @property {string} selector
 * @property {Map} secretsData
 */

/**
 * @template {SecretRequest} TRequest
 * @typedef {Object} SecretResponse
 * @property {TRequest} request
 * @property {string} value
 * @property {boolean} cachedResponse
 */

 /**
  * @template TRequest
  * @param {Array<TRequest>} secretRequests
  * @param {import('got').Got} client
  * @return {Promise<SecretResponse<TRequest>[]>}
  */
async function getSecrets(secretRequests, client) {
    const responseCache = new Map();
    const results = [];
    for (const secretRequest of secretRequests) {
        let { path, selector } = secretRequest;

        const requestPath = `v1/${path}`;
        let body;
        let cachedResponse = false;
        if (responseCache.has(requestPath)) {
            body = responseCache.get(requestPath);
            cachedResponse = true;
        } else {
            try {
                const result = await client.get(requestPath);
                body = result.body;
                responseCache.set(requestPath, body);
            } catch (error) {
                const {response} = error;
                if (response?.statusCode === 404) {
                    throw Error(`Unable to retrieve result for "${path}" because it was not found: ${response.body.trim()}`)
                }
                throw error
            }
        }
        if (!selector.match(/.*[\.].*/)) {
            selector = '"' + selector + '"'
        }
        selector = "data." + selector
        body = JSON.parse(body)
        if (body.data["data"] != undefined) {
            selector = "data." + selector
        }

        const value = await selectData(body, selector);
        results.push({
            request: secretRequest,
            value,
            cachedResponse
        });
    }
    return results;
}

 /**
  * @template TRequest
  * @param {Array<TRequest>} secretRequests
  * @param {import('got').Got} client
  * @return {Promise<SecretResponse<TRequest>[]>}
  */
 async function writeSecrets(secretRequests, client) {
    const results = [];
    for (const secretRequest of secretRequests) {
        let { path, selector, secretsData } = secretRequest;
        const requestPath = `v1/${path}`;
        let body;
        const jsonata = {};
        for (const [key, value] of secretsData) {
            jsonata[key] = value;
        }

        try {
            const result = await client.post(requestPath,{
                json: {
                    data: jsonata
                }
            });
            body = result.body;
        } catch (error) {
            throw error
        }
        //body = JSON.parse(body); //body.request_id
        results.push({
            request: secretRequest,
            value: 'SUCCESS',
            cachedResponse: false 
        });
    }
    return results;
}

/**
 * Uses a Jsonata selector retrieve a bit of data from the result
 * @param {object} data
 * @param {string} selector
 */
async function selectData(data, selector) {
    const ata = jsonata(selector);
    let result = JSON.stringify(await ata.evaluate(data));

    // Compat for custom engines
    if (!result && ((ata.ast().type === "path" && ata.ast()['steps'].length === 1) || ata.ast().type === "string") && selector !== 'data' && 'data' in data) {
        result = JSON.stringify(await jsonata(`data.${selector}`).evaluate(data));
    } else if (!result) {
        throw Error(`Unable to retrieve result for ${selector}. No match data was found. Double check your Key or Selector.`);
    }

    if (result.startsWith(`"`)) {
        // Support multi-line secrets like JSON strings and ssh keys, see https://github.com/hashicorp/vault-action/pull/173
        // Deserialize the value so that newlines and special characters are
        // not escaped in our return value.
        result = JSON.parse(result);
    } else {
        // Support secrets stored in Vault as pure JSON, see https://github.com/hashicorp/vault-action/issues/194
        // Serialize the value so that any special characters in the data are
        // properly escaped.
        result = JSON.stringify(result);
        // strip the surrounding quotes added by stringify because the data did
        // not have them in the first place
        result = result.substring(1, result.length - 1);
    }
    return result;
}

module.exports = {
    getSecrets,
    writeSecrets,
    selectData
}
