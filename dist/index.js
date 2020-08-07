module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(130);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 94:
/***/ (function(module, __unusedexports, __webpack_require__) {

// @ts-check
const core = __webpack_require__(968);
const command = __webpack_require__(422);
const got = __webpack_require__(349).default;
const jsonata = __webpack_require__(128);
const { auth: { retrieveToken }, secrets: { getSecrets } } = __webpack_require__(897);

const AUTH_METHODS = ['approle', 'token', 'github'];
const VALID_KV_VERSION = [-1, 1, 2];

async function exportSecrets() {
    const vaultUrl = core.getInput('url', { required: true });
    const vaultNamespace = core.getInput('namespace', { required: false });
    const extraHeaders = parseHeadersInput('extraHeaders', { required: false });
    const exportEnv = core.getInput('exportEnv', { required: false }) != 'false';

    let enginePath = core.getInput('path', { required: false });
    /** @type {number | string} */
    let kvVersion = core.getInput('kv-version', { required: false });

    const secretsInput = core.getInput('secrets', { required: true });
    const secretRequests = parseSecretsInput(secretsInput);

    const vaultMethod = (core.getInput('method', { required: false }) || 'token').toLowerCase();
    const authPayload = core.getInput('authPayload', { required: false });
    if (!AUTH_METHODS.includes(vaultMethod) && !authPayload) {
        throw Error(`Sorry, the provided authentication method ${vaultMethod} is not currently supported and no custom authPayload was provided.`);
    }

    const defaultOptions = {
        prefixUrl: vaultUrl,
        headers: {},
        https: {}
    }

    const tlsSkipVerify = (core.getInput('tlsSkipVerify', { required: false }) || 'false').toLowerCase() != 'false';
    if (tlsSkipVerify === true) {
        defaultOptions.https.rejectUnauthorized = true;
    }

    const caCertificateRaw = core.getInput('caCertificate', { required: false });
    if (caCertificateRaw != null) {
        defaultOptions.https.certificateAuthority = Buffer.from(caCertificateRaw, 'base64').toString();
    }

    const clientCertificateRaw = core.getInput('clientCertificate', { required: false });
    if (clientCertificateRaw != null) {
	    defaultOptions.https.certificate = Buffer.from(clientCertificateRaw, 'base64').toString();
    }

    const clientKeyRaw = core.getInput('clientKey', { required: false });
    if (clientKeyRaw != null) {
	    defaultOptions.https.key = Buffer.from(clientKeyRaw, 'base64').toString();
    }

    for (const [headerName, headerValue] of extraHeaders) {
        defaultOptions.headers[headerName] = headerValue;
    }

    if (vaultNamespace != null) {
        defaultOptions.headers["X-Vault-Namespace"] = vaultNamespace;
    }

    const vaultToken = await retrieveToken(vaultMethod, got.extend(defaultOptions));
    defaultOptions.headers['X-Vault-Token'] = vaultToken;
    const client = got.extend(defaultOptions);

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

    const requests = secretRequests.map(request => {
        const { path, selector } = request;

        if (path.startsWith('/')) {
            return request;
        }
        const kvPath = (kvVersion === 2)
            ? `/${enginePath}/data/${path}`
            : `/${enginePath}/${path}`;
        const kvSelector = (kvVersion === 2)
            ? `data.data.${selector}`
            : `data.${selector}`;
        return { ...request, path: kvPath, selector: kvSelector };
    });

    const results = await getSecrets(requests, client);

    for (const result of results) {
        const { value, request, cachedResponse } = result;
        if (cachedResponse) {
            core.debug('ℹ using cached response');
        }        
        command.issue('add-mask', value);
        if (exportEnv) {
            core.exportVariable(request.envVarName, `${value}`);
        }
        core.setOutput(request.outputVarName, `${value}`);
        core.debug(`✔ ${request.path} => outputs.${request.outputVarName}${exportEnv ? ` | env.${request.envVarName}` : ''}`);
    }
};

/** @typedef {Object} SecretRequest 
 * @property {string} path
 * @property {string} envVarName
 * @property {string} outputVarName
 * @property {string} selector
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
        let pathSpec = secret;
        let outputVarName = null;

        const renameSigilIndex = secret.lastIndexOf('|');
        if (renameSigilIndex > -1) {
            pathSpec = secret.substring(0, renameSigilIndex).trim();
            outputVarName = secret.substring(renameSigilIndex + 1).trim();

            if (outputVarName.length < 1) {
                throw Error(`You must provide a value when mapping a secret to a name. Input: "${secret}"`);
            }
        }

        const pathParts = pathSpec
            .split(/\s+/)
            .map(part => part.trim())
            .filter(part => part.length !== 0);

        if (pathParts.length !== 2) {
            throw Error(`You must provide a valid path and key. Input: "${secret}"`);
        }

        const [path, selector] = pathParts;

        /** @type {any} */
        const selectorAst = jsonata(selector).ast();

        if ((selectorAst.type !== "path" || selectorAst.steps[0].stages) && !outputVarName) {
            throw Error(`You must provide a name for the output key when using json selectors. Input: "${secret}"`);
        }

        let envVarName = outputVarName;
        if (!outputVarName) {
            outputVarName = normalizeOutputKey(selector);
            envVarName = normalizeOutputKey(selector, true);
        }

        output.push({
            path,
            envVarName,
            outputVarName,
            selector
        });
    }
    return output;
}

/**
 * Replaces any dot chars to __ and removes non-ascii charts
 * @param {string} dataKey
 * @param {boolean=} isEnvVar
 */
function normalizeOutputKey(dataKey, isEnvVar = false) {
    let outputKey = dataKey
        .replace('.', '__').replace(/[^\p{L}\p{N}_-]/gu, '');
    if (isEnvVar) {
        outputKey = outputKey.toUpperCase();
    }
    return outputKey;
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
    normalizeOutputKey,
    parseHeadersInput
};


/***/ }),

/***/ 128:
/***/ (function(module) {

module.exports = eval("require")("jsonata");


/***/ }),

/***/ 130:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const core = __webpack_require__(968);
const { exportSecrets } = __webpack_require__(94);

(async () => {
    try {
        await core.group('Get Vault Secrets', exportSecrets);
    } catch (error) {
        core.setFailed(error.message);
    }
})();


/***/ }),

/***/ 238:
/***/ (function(module, __unusedexports, __webpack_require__) {

// @ts-check
const core = __webpack_require__(968);

/***
 * Authenticate with Vault and retrieve a Vault token that can be used for requests.
 * @param {string} method
 * @param {import('got').Got} client
 */
async function retrieveToken(method, client) {
    switch (method) {
        case 'approle': {
            const vaultRoleId = core.getInput('roleId', { required: true });
            const vaultSecretId = core.getInput('secretId', { required: true });
            return await getClientToken(client, method, { role_id: vaultRoleId, secret_id: vaultSecretId });
        }
        case 'github': {
            const githubToken = core.getInput('githubToken', { required: true });
            return await getClientToken(client, method, { token: githubToken });
        }
        default: {
            if (!method || method === 'token') {
                return core.getInput('token', { required: true });
            } else {
                /** @type {string} */
                const payload = core.getInput('authPayload', { required: true });
                if (!payload) {
                    throw Error('When using a custom authentication method, you must provide the payload');
                }
                return await getClientToken(client, method, JSON.parse(payload.trim()));
            }
        }
    }
}

/***
 * Call the appropriate login endpoint and parse out the token in the response.
 * @param {import('got').Got} client
 * @param {string} method
 * @param {any} payload
 */
async function getClientToken(client, method, payload) {
    /** @type {'json'} */
    const responseType = 'json';
    var options = {
        json: payload,
        responseType,
    };

    core.debug(`Retrieving Vault Token from v1/auth/${method}/login endpoint`);

    /** @type {import('got').Response<VaultLoginResponse>} */
    const response = await client.post(`v1/auth/${method}/login`, options);
    if (response && response.body && response.body.auth && response.body.auth.client_token) {
        core.debug('✔ Vault Token successfully retrieved');

        core.startGroup('Token Info');
        core.debug(`Operating under policies: ${JSON.stringify(response.body.auth.policies)}`);
        core.debug(`Token Metadata: ${JSON.stringify(response.body.auth.metadata)}`);
        core.endGroup();

        return response.body.auth.client_token;
    } else {
        throw Error(`Unable to retrieve token from ${method}'s login endpoint.`);
    }
}

/***
 * @typedef {Object} VaultLoginResponse
 * @property {{
 *  client_token: string;
 *  accessor: string;
 *  policies: string[];
 *  metadata: unknown;
 *  lease_duration: number;
 *  renewable: boolean;
 * }} auth
 */

module.exports = {
    retrieveToken,
};


/***/ }),

/***/ 349:
/***/ (function(module) {

module.exports = eval("require")("got");


/***/ }),

/***/ 422:
/***/ (function(module) {

module.exports = eval("require")("@actions/core/lib/command");


/***/ }),

/***/ 520:
/***/ (function(module, __unusedexports, __webpack_require__) {

const jsonata = __webpack_require__(128);


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
    const ata = jsonata(selector);
    let result = JSON.stringify(ata.evaluate(data));
    // Compat for custom engines
    if (!result && ata.ast().type === "path" && ata.ast()['steps'].length === 1 && selector !== 'data' && 'data' in data) {
        result = JSON.stringify(jsonata(`data.${selector}`).evaluate(data));
    } else if (!result) {
        throw Error(`Unable to retrieve result for ${selector}. No match data was found. Double check your Key or Selector.`);
    }

    if (result.startsWith(`"`)) {
        result = result.substring(1, result.length - 1);
    }
    return result;
}

module.exports = {
    getSecrets,
    selectData
}

/***/ }),

/***/ 897:
/***/ (function(module, __unusedexports, __webpack_require__) {

const auth = __webpack_require__(238);
const secrets = __webpack_require__(520);

module.exports = {
    auth,
    secrets
};

/***/ }),

/***/ 968:
/***/ (function(module) {

module.exports = eval("require")("@actions/core");


/***/ })

/******/ });