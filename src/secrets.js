const jsonata = require("jsonata");
const { WILDCARD, WILDCARD_UPPERCASE} = require("./constants");
const { normalizeOutputKey } = require("./utils");
const core = require('@actions/core');

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
async function getSecrets(secretRequests, client, ignoreNotFound) {
    const responseCache = new Map();
    let results = [];
    let upperCaseEnv = false;

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
                    notFoundMsg = `Unable to retrieve result for "${path}" because it was not found: ${response.body.trim()}`;
                    const ignoreNotFound = (core.getInput('ignoreNotFound', { required: false }) || 'false').toLowerCase() != 'false';
                    if (ignoreNotFound) {
                        core.error(`✘ ${notFoundMsg}`);
                        continue;
                    } else {
                        throw Error(notFoundMsg)
                    }
                }
                throw error
            }
        }

        body = JSON.parse(body);

        if (selector === WILDCARD || selector === WILDCARD_UPPERCASE) {
            upperCaseEnv = selector === WILDCARD_UPPERCASE;
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
                } else {
                    newRequest.outputVarName = secretRequest.outputVarName+key;
                    newRequest.envVarName = secretRequest.envVarName+key;
                }

                newRequest.outputVarName = normalizeOutputKey(newRequest.outputVarName);
                newRequest.envVarName = normalizeOutputKey(newRequest.envVarName, upperCaseEnv);

                // JSONata field references containing reserved tokens should
                // be enclosed in backticks
                // https://docs.jsonata.org/simple#examples
                if (key.includes(".")) {
                    const backtick = '`';
                    key = backtick.concat(key, backtick);
                }
                selector = key;

                results = await selectAndAppendResults(
                  selector,
                  body,
                  cachedResponse,
                  newRequest,
                  results
                );
            }
        }
        else {
          results = await selectAndAppendResults(
            selector,
            body,
            cachedResponse,
            secretRequest,
            results
          );
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

/**
 * Uses selectData with the selector to get the value and then appends it to the
 * results. Returns a new array with all of the results.
 * @param {string} selector
 * @param {object} body
 * @param {object} cachedResponse
 * @param {TRequest} secretRequest
 * @param {SecretResponse<TRequest>[]} results
 * @return {Promise<SecretResponse<TRequest>[]>}
 */
const selectAndAppendResults = async (
  selector,
  body,
  cachedResponse,
  secretRequest,
  results
) => {
  if (!selector.match(/.*[\.].*/)) {
    selector = '"' + selector + '"';
  }
  selector = "data." + selector;

  if (body.data["data"] != undefined) {
    selector = "data." + selector;
  }

  const value = await selectData(body, selector);
  return [
    ...results,
    {
      request: secretRequest,
      value,
      cachedResponse,
    },
  ];
};

module.exports = {
    getSecrets,
    selectData
}
