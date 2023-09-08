const jsonata = require("jsonata");
const { wildcard } = require('./action');
const { normalizeOutputKey } = require('./utils');
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
                if (response.statusCode === 404) {
                    throw Error(`Unable to retrieve result for "${path}" because it was not found: ${response.body.trim()}`)
                }
                throw error
            }
        }

        if (selector === wildcard) {                     
            body = JSON.parse(body);
            let keys = body.data;
            if (body.data["data"] != undefined) {
                keys = keys.data;
            }

            for (let key in keys) {
                let newRequest = Object.assign({},secretRequest);
                newRequest.selector = key;                  
                if (secretRequest.selector === secretRequest.outputVarName) {
                    newRequest.outputVarName = key;
                    newRequest.envVarName = key;        		
                }
                else {
                    newRequest.outputVarName = secretRequest.outputVarName+key;
                    newRequest.envVarName = secretRequest.envVarName+key;        		
                }
                newRequest.outputVarName = normalizeOutputKey(newRequest.outputVarName);
                newRequest.envVarName = normalizeOutputKey(newRequest.envVarName,true);   

                selector = key;

                //This code (with exception of parsing body again and using newRequest instead of secretRequest) should match the else code for a single key
                if (!selector.match(/.*[\.].*/)) {
                    selector = '"' + selector + '"'
                }
                selector = "data." + selector

                if (body.data["data"] != undefined) {
                    selector = "data." + selector
                }
                const value = await selectData(body, selector);
                results.push({
                    request: newRequest,
                    value,
                    cachedResponse
                });

            }

        }
        else {
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
        result = JSON.parse(result);
    }
    return result;
}

module.exports = {
    getSecrets,
    selectData
}