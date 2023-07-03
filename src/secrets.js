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
 * Uses a Jsonata selector retrieve a bit of data from the result
 * @param {object} data 
 * @param {string} selector 
 */
async function selectData(data, selector) {
    const ata = jsonata(selector);
    let d = await ata.evaluate(data);

    // If we have a Javascript Object, then this data was stored in Vault as
    // pure JSON (not a JSON string)
    const storedAsJSONData = isObject(d);

    if (isJSONString(d)) {
        // If we already have a JSON string we will not "stringify" it yet so
        // that we don't end up calling JSON.parse. This would break the
        // secrets that are stored as pure JSON. See: https://github.com/hashicorp/vault-action/issues/194
        result = d;
    } else {
        result = JSON.stringify(d);
    }

    // Compat for custom engines
    if (!result && ((ata.ast().type === "path" && ata.ast()['steps'].length === 1) || ata.ast().type === "string") && selector !== 'data' && 'data' in data) {
        result = JSON.stringify(await jsonata(`data.${selector}`).evaluate(data));
    } else if (!result) {
        throw Error(`Unable to retrieve result for ${selector}. No match data was found. Double check your Key or Selector.`);
    }

    if (result.startsWith(`"`)) {
        // we need to strip the beginning and ending quotes otherwise it will
        // always successfully parse as a JSON string
        result = result.substring(1, result.length - 1);
        if (!isJSONString(result)) {
            // add the quotes back so we can parse it into a Javascript object
            // to allow support for multi-line secrets. See https://github.com/hashicorp/vault-action/issues/160
            result = `"${result}"`
            result = JSON.parse(result);
        }
    } else if (isJSONString(result)) {
        if (storedAsJSONData) {
            // Support secrets stored in Vault as pure JSON.
            // See https://github.com/hashicorp/vault-action/issues/194 and https://github.com/hashicorp/vault-action/pull/173
            result = JSON.stringify(result);
            result = result.substring(1, result.length - 1);
        } else {
            // Support secrets stored in Vault as JSON Strings
            result = JSON.stringify(result);
            result = JSON.parse(result);
        }
    }
    return result;
}

/**
 * isOjbect returns true if target is a Javascript object
 * @param {Type} target
 */
function isObject(target) {
    return typeof target === 'object' && target !== null;
}

/**
 * isJSONString returns true if target parses as a valid JSON string
 * @param {Type} target
 */
function isJSONString(target) {
    if (typeof target !== "string"){
        return false;
    }

    try {
        let o = JSON.parse(target);
    } catch (e) {
        return false;
    }

    return true;
}

module.exports = {
    getSecrets,
    selectData
}
