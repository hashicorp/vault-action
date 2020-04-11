const jsonata = require("jsonata");


/**
 * @typedef {Object} SecretRequest
 * @property {string} path
 * @property {string} selector
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
        const { path, selector } = secretRequest;

        const requestPath = `v1${path}`;
        let body;
        let cachedResponse = false;
        if (responseCache.has(requestPath)) {
            body = responseCache.get(requestPath);
            cachedResponse = true;
        } else {
            const result = await client.get(requestPath);
            body = result.body;
            responseCache.set(requestPath, body);
        }

        const value = selectData(JSON.parse(body), selector);
        results.push({
            request: secretRequest,
            value,
            cachedResponse
        });
    }
    return results;
}

/**
 * Uses a Jsonata selector retrieve a bit of data from the result
 * @param {object} data 
 * @param {string} selector 
 */
function selectData(data, selector) {
    let result = JSON.stringify(jsonata(selector).evaluate(data));
    if (result.startsWith(`"`)) {
        result = result.substring(1, result.length - 1);
    }
    return result;
}

module.exports = {
    getSecrets,
    selectData
}