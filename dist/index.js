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
/******/ 		return __webpack_require__(492);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 9:
/***/ (function(module, __unusedexports, __webpack_require__) {

var once = __webpack_require__(49);

var noop = function() {};

var isRequest = function(stream) {
	return stream.setHeader && typeof stream.abort === 'function';
};

var isChildProcess = function(stream) {
	return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
};

var eos = function(stream, opts, callback) {
	if (typeof opts === 'function') return eos(stream, null, opts);
	if (!opts) opts = {};

	callback = once(callback || noop);

	var ws = stream._writableState;
	var rs = stream._readableState;
	var readable = opts.readable || (opts.readable !== false && stream.readable);
	var writable = opts.writable || (opts.writable !== false && stream.writable);

	var onlegacyfinish = function() {
		if (!stream.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback.call(stream);
	};

	var onend = function() {
		readable = false;
		if (!writable) callback.call(stream);
	};

	var onexit = function(exitCode) {
		callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
	};

	var onerror = function(err) {
		callback.call(stream, err);
	};

	var onclose = function() {
		if (readable && !(rs && rs.ended)) return callback.call(stream, new Error('premature close'));
		if (writable && !(ws && ws.ended)) return callback.call(stream, new Error('premature close'));
	};

	var onrequest = function() {
		stream.req.on('finish', onfinish);
	};

	if (isRequest(stream)) {
		stream.on('complete', onfinish);
		stream.on('abort', onclose);
		if (stream.req) onrequest();
		else stream.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream.on('end', onlegacyfinish);
		stream.on('close', onlegacyfinish);
	}

	if (isChildProcess(stream)) stream.on('exit', onexit);

	stream.on('end', onend);
	stream.on('finish', onfinish);
	if (opts.error !== false) stream.on('error', onerror);
	stream.on('close', onclose);

	return function() {
		stream.removeListener('complete', onfinish);
		stream.removeListener('abort', onclose);
		stream.removeListener('request', onrequest);
		if (stream.req) stream.req.removeListener('finish', onfinish);
		stream.removeListener('end', onlegacyfinish);
		stream.removeListener('close', onlegacyfinish);
		stream.removeListener('finish', onfinish);
		stream.removeListener('exit', onexit);
		stream.removeListener('end', onend);
		stream.removeListener('error', onerror);
		stream.removeListener('close', onclose);
	};
};

module.exports = eos;


/***/ }),

/***/ 10:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = __webpack_require__(534);
exports.default = (url) => {
    // Cast to URL
    url = url;
    const options = {
        protocol: url.protocol,
        hostname: is_1.default.string(url.hostname) && url.hostname.startsWith('[') ? url.hostname.slice(1, -1) : url.hostname,
        host: url.host,
        hash: url.hash,
        search: url.search,
        pathname: url.pathname,
        href: url.href,
        path: `${url.pathname || ''}${url.search || ''}`
    };
    if (is_1.default.string(url.port) && url.port.length > 0) {
        options.port = Number(url.port);
    }
    if (url.username || url.password) {
        options.auth = `${url.username || ''}:${url.password || ''}`;
    }
    return options;
};


/***/ }),

/***/ 11:
/***/ (function(module) {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 16:
/***/ (function(module) {

module.exports = require("tls");

/***/ }),

/***/ 36:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelError = exports.ParseError = void 0;
const core_1 = __webpack_require__(946);
/**
An error to be thrown when server response code is 2xx, and parsing body fails.
Includes a `response` property.
*/
class ParseError extends core_1.RequestError {
    constructor(error, response) {
        const { options } = response.request;
        super(`${error.message} in "${options.url.toString()}"`, error, response.request);
        this.name = 'ParseError';
    }
}
exports.ParseError = ParseError;
/**
An error to be thrown when the request is aborted with `.cancel()`.
*/
class CancelError extends core_1.RequestError {
    constructor(request) {
        super('Promise was canceled', {}, request);
        this.name = 'CancelError';
    }
    get isCanceled() {
        return true;
    }
}
exports.CancelError = CancelError;
__exportStar(__webpack_require__(946), exports);


/***/ }),

/***/ 48:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class WeakableMap {
    constructor() {
        this.weakMap = new WeakMap();
        this.map = new Map();
    }
    set(key, value) {
        if (typeof key === 'object') {
            this.weakMap.set(key, value);
        }
        else {
            this.map.set(key, value);
        }
    }
    get(key) {
        if (typeof key === 'object') {
            return this.weakMap.get(key);
        }
        return this.map.get(key);
    }
    has(key) {
        if (typeof key === 'object') {
            return this.weakMap.has(key);
        }
        return this.map.has(key);
    }
}
exports.default = WeakableMap;


/***/ }),

/***/ 49:
/***/ (function(module, __unusedexports, __webpack_require__) {

var wrappy = __webpack_require__(11)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 53:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

// TODO: Use the `URL` global when targeting Node.js 10
const URLParser = typeof URL === 'undefined' ? __webpack_require__(835).URL : URL;

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
const DATA_URL_DEFAULT_MIME_TYPE = 'text/plain';
const DATA_URL_DEFAULT_CHARSET = 'us-ascii';

const testParameter = (name, filters) => {
	return filters.some(filter => filter instanceof RegExp ? filter.test(name) : filter === name);
};

const normalizeDataURL = (urlString, {stripHash}) => {
	const parts = urlString.match(/^data:(.*?),(.*?)(?:#(.*))?$/);

	if (!parts) {
		throw new Error(`Invalid URL: ${urlString}`);
	}

	const mediaType = parts[1].split(';');
	const body = parts[2];
	const hash = stripHash ? '' : parts[3];

	let base64 = false;

	if (mediaType[mediaType.length - 1] === 'base64') {
		mediaType.pop();
		base64 = true;
	}

	// Lowercase MIME type
	const mimeType = (mediaType.shift() || '').toLowerCase();
	const attributes = mediaType
		.map(attribute => {
			let [key, value = ''] = attribute.split('=').map(string => string.trim());

			// Lowercase `charset`
			if (key === 'charset') {
				value = value.toLowerCase();

				if (value === DATA_URL_DEFAULT_CHARSET) {
					return '';
				}
			}

			return `${key}${value ? `=${value}` : ''}`;
		})
		.filter(Boolean);

	const normalizedMediaType = [
		...attributes
	];

	if (base64) {
		normalizedMediaType.push('base64');
	}

	if (normalizedMediaType.length !== 0 || (mimeType && mimeType !== DATA_URL_DEFAULT_MIME_TYPE)) {
		normalizedMediaType.unshift(mimeType);
	}

	return `data:${normalizedMediaType.join(';')},${base64 ? body.trim() : body}${hash ? `#${hash}` : ''}`;
};

const normalizeUrl = (urlString, options) => {
	options = {
		defaultProtocol: 'http:',
		normalizeProtocol: true,
		forceHttp: false,
		forceHttps: false,
		stripAuthentication: true,
		stripHash: false,
		stripWWW: true,
		removeQueryParameters: [/^utm_\w+/i],
		removeTrailingSlash: true,
		removeDirectoryIndex: false,
		sortQueryParameters: true,
		...options
	};

	// TODO: Remove this at some point in the future
	if (Reflect.has(options, 'normalizeHttps')) {
		throw new Error('options.normalizeHttps is renamed to options.forceHttp');
	}

	if (Reflect.has(options, 'normalizeHttp')) {
		throw new Error('options.normalizeHttp is renamed to options.forceHttps');
	}

	if (Reflect.has(options, 'stripFragment')) {
		throw new Error('options.stripFragment is renamed to options.stripHash');
	}

	urlString = urlString.trim();

	// Data URL
	if (/^data:/i.test(urlString)) {
		return normalizeDataURL(urlString, options);
	}

	const hasRelativeProtocol = urlString.startsWith('//');
	const isRelativeUrl = !hasRelativeProtocol && /^\.*\//.test(urlString);

	// Prepend protocol
	if (!isRelativeUrl) {
		urlString = urlString.replace(/^(?!(?:\w+:)?\/\/)|^\/\//, options.defaultProtocol);
	}

	const urlObj = new URLParser(urlString);

	if (options.forceHttp && options.forceHttps) {
		throw new Error('The `forceHttp` and `forceHttps` options cannot be used together');
	}

	if (options.forceHttp && urlObj.protocol === 'https:') {
		urlObj.protocol = 'http:';
	}

	if (options.forceHttps && urlObj.protocol === 'http:') {
		urlObj.protocol = 'https:';
	}

	// Remove auth
	if (options.stripAuthentication) {
		urlObj.username = '';
		urlObj.password = '';
	}

	// Remove hash
	if (options.stripHash) {
		urlObj.hash = '';
	}

	// Remove duplicate slashes if not preceded by a protocol
	if (urlObj.pathname) {
		// TODO: Use the following instead when targeting Node.js 10
		// `urlObj.pathname = urlObj.pathname.replace(/(?<!https?:)\/{2,}/g, '/');`
		urlObj.pathname = urlObj.pathname.replace(/((?!:).|^)\/{2,}/g, (_, p1) => {
			if (/^(?!\/)/g.test(p1)) {
				return `${p1}/`;
			}

			return '/';
		});
	}

	// Decode URI octets
	if (urlObj.pathname) {
		urlObj.pathname = decodeURI(urlObj.pathname);
	}

	// Remove directory index
	if (options.removeDirectoryIndex === true) {
		options.removeDirectoryIndex = [/^index\.[a-z]+$/];
	}

	if (Array.isArray(options.removeDirectoryIndex) && options.removeDirectoryIndex.length > 0) {
		let pathComponents = urlObj.pathname.split('/');
		const lastComponent = pathComponents[pathComponents.length - 1];

		if (testParameter(lastComponent, options.removeDirectoryIndex)) {
			pathComponents = pathComponents.slice(0, pathComponents.length - 1);
			urlObj.pathname = pathComponents.slice(1).join('/') + '/';
		}
	}

	if (urlObj.hostname) {
		// Remove trailing dot
		urlObj.hostname = urlObj.hostname.replace(/\.$/, '');

		// Remove `www.`
		if (options.stripWWW && /^www\.([a-z\-\d]{2,63})\.([a-z.]{2,5})$/.test(urlObj.hostname)) {
			// Each label should be max 63 at length (min: 2).
			// The extension should be max 5 at length (min: 2).
			// Source: https://en.wikipedia.org/wiki/Hostname#Restrictions_on_valid_host_names
			urlObj.hostname = urlObj.hostname.replace(/^www\./, '');
		}
	}

	// Remove query unwanted parameters
	if (Array.isArray(options.removeQueryParameters)) {
		for (const key of [...urlObj.searchParams.keys()]) {
			if (testParameter(key, options.removeQueryParameters)) {
				urlObj.searchParams.delete(key);
			}
		}
	}

	// Sort query parameters
	if (options.sortQueryParameters) {
		urlObj.searchParams.sort();
	}

	if (options.removeTrailingSlash) {
		urlObj.pathname = urlObj.pathname.replace(/\/$/, '');
	}

	// Take advantage of many of the Node `url` normalizations
	urlString = urlObj.toString();

	// Remove ending `/`
	if ((options.removeTrailingSlash || urlObj.pathname === '/') && urlObj.hash === '') {
		urlString = urlString.replace(/\/$/, '');
	}

	// Restore relative protocol, if applicable
	if (hasRelativeProtocol && !options.normalizeProtocol) {
		urlString = urlString.replace(/^http:\/\//, '//');
	}

	// Remove http/https
	if (options.stripProtocol) {
		urlString = urlString.replace(/^(?:https?:)?\/\//, '');
	}

	return urlString;
};

module.exports = normalizeUrl;
// TODO: Remove this for the next major release
module.exports.default = normalizeUrl;


/***/ }),

/***/ 77:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = __webpack_require__(835);
const create_1 = __webpack_require__(323);
const defaults = {
    options: {
        method: 'GET',
        retry: {
            limit: 2,
            methods: [
                'GET',
                'PUT',
                'HEAD',
                'DELETE',
                'OPTIONS',
                'TRACE'
            ],
            statusCodes: [
                408,
                413,
                429,
                500,
                502,
                503,
                504,
                521,
                522,
                524
            ],
            errorCodes: [
                'ETIMEDOUT',
                'ECONNRESET',
                'EADDRINUSE',
                'ECONNREFUSED',
                'EPIPE',
                'ENOTFOUND',
                'ENETUNREACH',
                'EAI_AGAIN'
            ],
            maxRetryAfter: undefined,
            calculateDelay: ({ computedValue }) => computedValue
        },
        timeout: {},
        headers: {
            'user-agent': 'got (https://github.com/sindresorhus/got)'
        },
        hooks: {
            init: [],
            beforeRequest: [],
            beforeRedirect: [],
            beforeRetry: [],
            beforeError: [],
            afterResponse: []
        },
        cache: undefined,
        dnsCache: undefined,
        decompress: true,
        throwHttpErrors: true,
        followRedirect: true,
        isStream: false,
        responseType: 'text',
        resolveBodyOnly: false,
        maxRedirects: 10,
        prefixUrl: '',
        methodRewriting: true,
        ignoreInvalidCookies: false,
        context: {},
        // TODO: Set this to `true` when Got 12 gets released
        http2: false,
        allowGetBody: false,
        https: undefined,
        pagination: {
            transform: (response) => {
                if (response.request.options.responseType === 'json') {
                    return response.body;
                }
                return JSON.parse(response.body);
            },
            paginate: response => {
                if (!Reflect.has(response.headers, 'link')) {
                    return false;
                }
                const items = response.headers.link.split(',');
                let next;
                for (const item of items) {
                    const parsed = item.split(';');
                    if (parsed[1].includes('next')) {
                        next = parsed[0].trimStart().trim();
                        next = next.slice(1, -1);
                        break;
                    }
                }
                if (next) {
                    const options = {
                        url: new url_1.URL(next)
                    };
                    return options;
                }
                return false;
            },
            filter: () => true,
            shouldContinue: () => true,
            countLimit: Infinity,
            backoff: 0,
            requestLimit: 10000,
            stackAllItems: true
        },
        parseJson: (text) => JSON.parse(text),
        stringifyJson: (object) => JSON.stringify(object),
        cacheOptions: {}
    },
    handlers: [create_1.defaultHandler],
    mutableDefaults: false
};
const got = create_1.default(defaults);
exports.default = got;
// For CommonJS default export support
module.exports = got;
module.exports.default = got;
module.exports.__esModule = true; // Workaround for TS issue: https://github.com/sindresorhus/got/pull/1267
__exportStar(__webpack_require__(323), exports);
__exportStar(__webpack_require__(577), exports);


/***/ }),

/***/ 82:
/***/ (function(__unusedmodule, exports) {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 87:
/***/ (function(module) {

module.exports = require("os");

/***/ }),

/***/ 89:
/***/ (function(module) {

"use strict";


// We define these manually to ensure they're always copied
// even if they would move up the prototype chain
// https://nodejs.org/api/http.html#http_class_http_incomingmessage
const knownProps = [
	'destroy',
	'setTimeout',
	'socket',
	'headers',
	'trailers',
	'rawHeaders',
	'statusCode',
	'httpVersion',
	'httpVersionMinor',
	'httpVersionMajor',
	'rawTrailers',
	'statusMessage'
];

module.exports = (fromStream, toStream) => {
	const fromProps = new Set(Object.keys(fromStream).concat(knownProps));

	for (const prop of fromProps) {
		// Don't overwrite existing properties
		if (prop in toStream) {
			continue;
		}

		toStream[prop] = typeof fromStream[prop] === 'function' ? fromStream[prop].bind(fromStream) : fromStream[prop];
	}
};


/***/ }),

/***/ 93:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const Readable = __webpack_require__(413).Readable;
const lowercaseKeys = __webpack_require__(474);

class Response extends Readable {
	constructor(statusCode, headers, body, url) {
		if (typeof statusCode !== 'number') {
			throw new TypeError('Argument `statusCode` should be a number');
		}
		if (typeof headers !== 'object') {
			throw new TypeError('Argument `headers` should be an object');
		}
		if (!(body instanceof Buffer)) {
			throw new TypeError('Argument `body` should be a buffer');
		}
		if (typeof url !== 'string') {
			throw new TypeError('Argument `url` should be a string');
		}

		super();
		this.statusCode = statusCode;
		this.headers = lowercaseKeys(headers);
		this.body = body;
		this.url = url;
	}

	_read() {
		this.push(this.body);
		this.push(null);
	}
}

module.exports = Response;


/***/ }),

/***/ 102:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__webpack_require__(747));
const os = __importStar(__webpack_require__(87));
const utils_1 = __webpack_require__(82);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 121:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = __webpack_require__(36);
const parseBody = (response, responseType, parseJson, encoding) => {
    const { rawBody } = response;
    try {
        if (responseType === 'text') {
            return rawBody.toString(encoding);
        }
        if (responseType === 'json') {
            return rawBody.length === 0 ? '' : parseJson(rawBody.toString());
        }
        if (responseType === 'buffer') {
            return rawBody;
        }
        throw new types_1.ParseError({
            message: `Unknown body type '${responseType}'`,
            name: 'Error'
        }, response);
    }
    catch (error) {
        throw new types_1.ParseError(error, response);
    }
};
exports.default = parseBody;


/***/ }),

/***/ 151:
/***/ (function(module, __unusedexports, __webpack_require__) {

// @ts-check
const core = __webpack_require__(470);

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

/***/ 154:
/***/ (function(module) {

"use strict";

// rfc7231 6.1
const statusCodeCacheableByDefault = new Set([
    200,
    203,
    204,
    206,
    300,
    301,
    404,
    405,
    410,
    414,
    501,
]);

// This implementation does not understand partial responses (206)
const understoodStatuses = new Set([
    200,
    203,
    204,
    300,
    301,
    302,
    303,
    307,
    308,
    404,
    405,
    410,
    414,
    501,
]);

const errorStatusCodes = new Set([
    500,
    502,
    503, 
    504,
]);

const hopByHopHeaders = {
    date: true, // included, because we add Age update Date
    connection: true,
    'keep-alive': true,
    'proxy-authenticate': true,
    'proxy-authorization': true,
    te: true,
    trailer: true,
    'transfer-encoding': true,
    upgrade: true,
};

const excludedFromRevalidationUpdate = {
    // Since the old body is reused, it doesn't make sense to change properties of the body
    'content-length': true,
    'content-encoding': true,
    'transfer-encoding': true,
    'content-range': true,
};

function toNumberOrZero(s) {
    const n = parseInt(s, 10);
    return isFinite(n) ? n : 0;
}

// RFC 5861
function isErrorResponse(response) {
    // consider undefined response as faulty
    if(!response) {
        return true
    }
    return errorStatusCodes.has(response.status);
}

function parseCacheControl(header) {
    const cc = {};
    if (!header) return cc;

    // TODO: When there is more than one value present for a given directive (e.g., two Expires header fields, multiple Cache-Control: max-age directives),
    // the directive's value is considered invalid. Caches are encouraged to consider responses that have invalid freshness information to be stale
    const parts = header.trim().split(/\s*,\s*/); // TODO: lame parsing
    for (const part of parts) {
        const [k, v] = part.split(/\s*=\s*/, 2);
        cc[k] = v === undefined ? true : v.replace(/^"|"$/g, ''); // TODO: lame unquoting
    }

    return cc;
}

function formatCacheControl(cc) {
    let parts = [];
    for (const k in cc) {
        const v = cc[k];
        parts.push(v === true ? k : k + '=' + v);
    }
    if (!parts.length) {
        return undefined;
    }
    return parts.join(', ');
}

module.exports = class CachePolicy {
    constructor(
        req,
        res,
        {
            shared,
            cacheHeuristic,
            immutableMinTimeToLive,
            ignoreCargoCult,
            _fromObject,
        } = {}
    ) {
        if (_fromObject) {
            this._fromObject(_fromObject);
            return;
        }

        if (!res || !res.headers) {
            throw Error('Response headers missing');
        }
        this._assertRequestHasHeaders(req);

        this._responseTime = this.now();
        this._isShared = shared !== false;
        this._cacheHeuristic =
            undefined !== cacheHeuristic ? cacheHeuristic : 0.1; // 10% matches IE
        this._immutableMinTtl =
            undefined !== immutableMinTimeToLive
                ? immutableMinTimeToLive
                : 24 * 3600 * 1000;

        this._status = 'status' in res ? res.status : 200;
        this._resHeaders = res.headers;
        this._rescc = parseCacheControl(res.headers['cache-control']);
        this._method = 'method' in req ? req.method : 'GET';
        this._url = req.url;
        this._host = req.headers.host;
        this._noAuthorization = !req.headers.authorization;
        this._reqHeaders = res.headers.vary ? req.headers : null; // Don't keep all request headers if they won't be used
        this._reqcc = parseCacheControl(req.headers['cache-control']);

        // Assume that if someone uses legacy, non-standard uncecessary options they don't understand caching,
        // so there's no point stricly adhering to the blindly copy&pasted directives.
        if (
            ignoreCargoCult &&
            'pre-check' in this._rescc &&
            'post-check' in this._rescc
        ) {
            delete this._rescc['pre-check'];
            delete this._rescc['post-check'];
            delete this._rescc['no-cache'];
            delete this._rescc['no-store'];
            delete this._rescc['must-revalidate'];
            this._resHeaders = Object.assign({}, this._resHeaders, {
                'cache-control': formatCacheControl(this._rescc),
            });
            delete this._resHeaders.expires;
            delete this._resHeaders.pragma;
        }

        // When the Cache-Control header field is not present in a request, caches MUST consider the no-cache request pragma-directive
        // as having the same effect as if "Cache-Control: no-cache" were present (see Section 5.2.1).
        if (
            res.headers['cache-control'] == null &&
            /no-cache/.test(res.headers.pragma)
        ) {
            this._rescc['no-cache'] = true;
        }
    }

    now() {
        return Date.now();
    }

    storable() {
        // The "no-store" request directive indicates that a cache MUST NOT store any part of either this request or any response to it.
        return !!(
            !this._reqcc['no-store'] &&
            // A cache MUST NOT store a response to any request, unless:
            // The request method is understood by the cache and defined as being cacheable, and
            ('GET' === this._method ||
                'HEAD' === this._method ||
                ('POST' === this._method && this._hasExplicitExpiration())) &&
            // the response status code is understood by the cache, and
            understoodStatuses.has(this._status) &&
            // the "no-store" cache directive does not appear in request or response header fields, and
            !this._rescc['no-store'] &&
            // the "private" response directive does not appear in the response, if the cache is shared, and
            (!this._isShared || !this._rescc.private) &&
            // the Authorization header field does not appear in the request, if the cache is shared,
            (!this._isShared ||
                this._noAuthorization ||
                this._allowsStoringAuthenticated()) &&
            // the response either:
            // contains an Expires header field, or
            (this._resHeaders.expires ||
                // contains a max-age response directive, or
                // contains a s-maxage response directive and the cache is shared, or
                // contains a public response directive.
                this._rescc['max-age'] ||
                (this._isShared && this._rescc['s-maxage']) ||
                this._rescc.public ||
                // has a status code that is defined as cacheable by default
                statusCodeCacheableByDefault.has(this._status))
        );
    }

    _hasExplicitExpiration() {
        // 4.2.1 Calculating Freshness Lifetime
        return (
            (this._isShared && this._rescc['s-maxage']) ||
            this._rescc['max-age'] ||
            this._resHeaders.expires
        );
    }

    _assertRequestHasHeaders(req) {
        if (!req || !req.headers) {
            throw Error('Request headers missing');
        }
    }

    satisfiesWithoutRevalidation(req) {
        this._assertRequestHasHeaders(req);

        // When presented with a request, a cache MUST NOT reuse a stored response, unless:
        // the presented request does not contain the no-cache pragma (Section 5.4), nor the no-cache cache directive,
        // unless the stored response is successfully validated (Section 4.3), and
        const requestCC = parseCacheControl(req.headers['cache-control']);
        if (requestCC['no-cache'] || /no-cache/.test(req.headers.pragma)) {
            return false;
        }

        if (requestCC['max-age'] && this.age() > requestCC['max-age']) {
            return false;
        }

        if (
            requestCC['min-fresh'] &&
            this.timeToLive() < 1000 * requestCC['min-fresh']
        ) {
            return false;
        }

        // the stored response is either:
        // fresh, or allowed to be served stale
        if (this.stale()) {
            const allowsStale =
                requestCC['max-stale'] &&
                !this._rescc['must-revalidate'] &&
                (true === requestCC['max-stale'] ||
                    requestCC['max-stale'] > this.age() - this.maxAge());
            if (!allowsStale) {
                return false;
            }
        }

        return this._requestMatches(req, false);
    }

    _requestMatches(req, allowHeadMethod) {
        // The presented effective request URI and that of the stored response match, and
        return (
            (!this._url || this._url === req.url) &&
            this._host === req.headers.host &&
            // the request method associated with the stored response allows it to be used for the presented request, and
            (!req.method ||
                this._method === req.method ||
                (allowHeadMethod && 'HEAD' === req.method)) &&
            // selecting header fields nominated by the stored response (if any) match those presented, and
            this._varyMatches(req)
        );
    }

    _allowsStoringAuthenticated() {
        //  following Cache-Control response directives (Section 5.2.2) have such an effect: must-revalidate, public, and s-maxage.
        return (
            this._rescc['must-revalidate'] ||
            this._rescc.public ||
            this._rescc['s-maxage']
        );
    }

    _varyMatches(req) {
        if (!this._resHeaders.vary) {
            return true;
        }

        // A Vary header field-value of "*" always fails to match
        if (this._resHeaders.vary === '*') {
            return false;
        }

        const fields = this._resHeaders.vary
            .trim()
            .toLowerCase()
            .split(/\s*,\s*/);
        for (const name of fields) {
            if (req.headers[name] !== this._reqHeaders[name]) return false;
        }
        return true;
    }

    _copyWithoutHopByHopHeaders(inHeaders) {
        const headers = {};
        for (const name in inHeaders) {
            if (hopByHopHeaders[name]) continue;
            headers[name] = inHeaders[name];
        }
        // 9.1.  Connection
        if (inHeaders.connection) {
            const tokens = inHeaders.connection.trim().split(/\s*,\s*/);
            for (const name of tokens) {
                delete headers[name];
            }
        }
        if (headers.warning) {
            const warnings = headers.warning.split(/,/).filter(warning => {
                return !/^\s*1[0-9][0-9]/.test(warning);
            });
            if (!warnings.length) {
                delete headers.warning;
            } else {
                headers.warning = warnings.join(',').trim();
            }
        }
        return headers;
    }

    responseHeaders() {
        const headers = this._copyWithoutHopByHopHeaders(this._resHeaders);
        const age = this.age();

        // A cache SHOULD generate 113 warning if it heuristically chose a freshness
        // lifetime greater than 24 hours and the response's age is greater than 24 hours.
        if (
            age > 3600 * 24 &&
            !this._hasExplicitExpiration() &&
            this.maxAge() > 3600 * 24
        ) {
            headers.warning =
                (headers.warning ? `${headers.warning}, ` : '') +
                '113 - "rfc7234 5.5.4"';
        }
        headers.age = `${Math.round(age)}`;
        headers.date = new Date(this.now()).toUTCString();
        return headers;
    }

    /**
     * Value of the Date response header or current time if Date was invalid
     * @return timestamp
     */
    date() {
        const serverDate = Date.parse(this._resHeaders.date);
        if (isFinite(serverDate)) {
            return serverDate;
        }
        return this._responseTime;
    }

    /**
     * Value of the Age header, in seconds, updated for the current time.
     * May be fractional.
     *
     * @return Number
     */
    age() {
        let age = this._ageValue();

        const residentTime = (this.now() - this._responseTime) / 1000;
        return age + residentTime;
    }

    _ageValue() {
        return toNumberOrZero(this._resHeaders.age);
    }

    /**
     * Value of applicable max-age (or heuristic equivalent) in seconds. This counts since response's `Date`.
     *
     * For an up-to-date value, see `timeToLive()`.
     *
     * @return Number
     */
    maxAge() {
        if (!this.storable() || this._rescc['no-cache']) {
            return 0;
        }

        // Shared responses with cookies are cacheable according to the RFC, but IMHO it'd be unwise to do so by default
        // so this implementation requires explicit opt-in via public header
        if (
            this._isShared &&
            (this._resHeaders['set-cookie'] &&
                !this._rescc.public &&
                !this._rescc.immutable)
        ) {
            return 0;
        }

        if (this._resHeaders.vary === '*') {
            return 0;
        }

        if (this._isShared) {
            if (this._rescc['proxy-revalidate']) {
                return 0;
            }
            // if a response includes the s-maxage directive, a shared cache recipient MUST ignore the Expires field.
            if (this._rescc['s-maxage']) {
                return toNumberOrZero(this._rescc['s-maxage']);
            }
        }

        // If a response includes a Cache-Control field with the max-age directive, a recipient MUST ignore the Expires field.
        if (this._rescc['max-age']) {
            return toNumberOrZero(this._rescc['max-age']);
        }

        const defaultMinTtl = this._rescc.immutable ? this._immutableMinTtl : 0;

        const serverDate = this.date();
        if (this._resHeaders.expires) {
            const expires = Date.parse(this._resHeaders.expires);
            // A cache recipient MUST interpret invalid date formats, especially the value "0", as representing a time in the past (i.e., "already expired").
            if (Number.isNaN(expires) || expires < serverDate) {
                return 0;
            }
            return Math.max(defaultMinTtl, (expires - serverDate) / 1000);
        }

        if (this._resHeaders['last-modified']) {
            const lastModified = Date.parse(this._resHeaders['last-modified']);
            if (isFinite(lastModified) && serverDate > lastModified) {
                return Math.max(
                    defaultMinTtl,
                    ((serverDate - lastModified) / 1000) * this._cacheHeuristic
                );
            }
        }

        return defaultMinTtl;
    }

    timeToLive() {
        const age = this.maxAge() - this.age();
        const staleIfErrorAge = age + toNumberOrZero(this._rescc['stale-if-error']);
        const staleWhileRevalidateAge = age + toNumberOrZero(this._rescc['stale-while-revalidate']);
        return Math.max(0, age, staleIfErrorAge, staleWhileRevalidateAge) * 1000;
    }

    stale() {
        return this.maxAge() <= this.age();
    }

    _useStaleIfError() {
        return this.maxAge() + toNumberOrZero(this._rescc['stale-if-error']) > this.age();
    }

    useStaleWhileRevalidate() {
        return this.maxAge() + toNumberOrZero(this._rescc['stale-while-revalidate']) > this.age();
    }

    static fromObject(obj) {
        return new this(undefined, undefined, { _fromObject: obj });
    }

    _fromObject(obj) {
        if (this._responseTime) throw Error('Reinitialized');
        if (!obj || obj.v !== 1) throw Error('Invalid serialization');

        this._responseTime = obj.t;
        this._isShared = obj.sh;
        this._cacheHeuristic = obj.ch;
        this._immutableMinTtl =
            obj.imm !== undefined ? obj.imm : 24 * 3600 * 1000;
        this._status = obj.st;
        this._resHeaders = obj.resh;
        this._rescc = obj.rescc;
        this._method = obj.m;
        this._url = obj.u;
        this._host = obj.h;
        this._noAuthorization = obj.a;
        this._reqHeaders = obj.reqh;
        this._reqcc = obj.reqcc;
    }

    toObject() {
        return {
            v: 1,
            t: this._responseTime,
            sh: this._isShared,
            ch: this._cacheHeuristic,
            imm: this._immutableMinTtl,
            st: this._status,
            resh: this._resHeaders,
            rescc: this._rescc,
            m: this._method,
            u: this._url,
            h: this._host,
            a: this._noAuthorization,
            reqh: this._reqHeaders,
            reqcc: this._reqcc,
        };
    }

    /**
     * Headers for sending to the origin server to revalidate stale response.
     * Allows server to return 304 to allow reuse of the previous response.
     *
     * Hop by hop headers are always stripped.
     * Revalidation headers may be added or removed, depending on request.
     */
    revalidationHeaders(incomingReq) {
        this._assertRequestHasHeaders(incomingReq);
        const headers = this._copyWithoutHopByHopHeaders(incomingReq.headers);

        // This implementation does not understand range requests
        delete headers['if-range'];

        if (!this._requestMatches(incomingReq, true) || !this.storable()) {
            // revalidation allowed via HEAD
            // not for the same resource, or wasn't allowed to be cached anyway
            delete headers['if-none-match'];
            delete headers['if-modified-since'];
            return headers;
        }

        /* MUST send that entity-tag in any cache validation request (using If-Match or If-None-Match) if an entity-tag has been provided by the origin server. */
        if (this._resHeaders.etag) {
            headers['if-none-match'] = headers['if-none-match']
                ? `${headers['if-none-match']}, ${this._resHeaders.etag}`
                : this._resHeaders.etag;
        }

        // Clients MAY issue simple (non-subrange) GET requests with either weak validators or strong validators. Clients MUST NOT use weak validators in other forms of request.
        const forbidsWeakValidators =
            headers['accept-ranges'] ||
            headers['if-match'] ||
            headers['if-unmodified-since'] ||
            (this._method && this._method != 'GET');

        /* SHOULD send the Last-Modified value in non-subrange cache validation requests (using If-Modified-Since) if only a Last-Modified value has been provided by the origin server.
        Note: This implementation does not understand partial responses (206) */
        if (forbidsWeakValidators) {
            delete headers['if-modified-since'];

            if (headers['if-none-match']) {
                const etags = headers['if-none-match']
                    .split(/,/)
                    .filter(etag => {
                        return !/^\s*W\//.test(etag);
                    });
                if (!etags.length) {
                    delete headers['if-none-match'];
                } else {
                    headers['if-none-match'] = etags.join(',').trim();
                }
            }
        } else if (
            this._resHeaders['last-modified'] &&
            !headers['if-modified-since']
        ) {
            headers['if-modified-since'] = this._resHeaders['last-modified'];
        }

        return headers;
    }

    /**
     * Creates new CachePolicy with information combined from the previews response,
     * and the new revalidation response.
     *
     * Returns {policy, modified} where modified is a boolean indicating
     * whether the response body has been modified, and old cached body can't be used.
     *
     * @return {Object} {policy: CachePolicy, modified: Boolean}
     */
    revalidatedPolicy(request, response) {
        this._assertRequestHasHeaders(request);
        if(this._useStaleIfError() && isErrorResponse(response)) {  // I consider the revalidation request unsuccessful
          return {
            modified: false,
            matches: false,
            policy: this,
          };
        }
        if (!response || !response.headers) {
            throw Error('Response headers missing');
        }

        // These aren't going to be supported exactly, since one CachePolicy object
        // doesn't know about all the other cached objects.
        let matches = false;
        if (response.status !== undefined && response.status != 304) {
            matches = false;
        } else if (
            response.headers.etag &&
            !/^\s*W\//.test(response.headers.etag)
        ) {
            // "All of the stored responses with the same strong validator are selected.
            // If none of the stored responses contain the same strong validator,
            // then the cache MUST NOT use the new response to update any stored responses."
            matches =
                this._resHeaders.etag &&
                this._resHeaders.etag.replace(/^\s*W\//, '') ===
                    response.headers.etag;
        } else if (this._resHeaders.etag && response.headers.etag) {
            // "If the new response contains a weak validator and that validator corresponds
            // to one of the cache's stored responses,
            // then the most recent of those matching stored responses is selected for update."
            matches =
                this._resHeaders.etag.replace(/^\s*W\//, '') ===
                response.headers.etag.replace(/^\s*W\//, '');
        } else if (this._resHeaders['last-modified']) {
            matches =
                this._resHeaders['last-modified'] ===
                response.headers['last-modified'];
        } else {
            // If the new response does not include any form of validator (such as in the case where
            // a client generates an If-Modified-Since request from a source other than the Last-Modified
            // response header field), and there is only one stored response, and that stored response also
            // lacks a validator, then that stored response is selected for update.
            if (
                !this._resHeaders.etag &&
                !this._resHeaders['last-modified'] &&
                !response.headers.etag &&
                !response.headers['last-modified']
            ) {
                matches = true;
            }
        }

        if (!matches) {
            return {
                policy: new this.constructor(request, response),
                // Client receiving 304 without body, even if it's invalid/mismatched has no option
                // but to reuse a cached body. We don't have a good way to tell clients to do
                // error recovery in such case.
                modified: response.status != 304,
                matches: false,
            };
        }

        // use other header fields provided in the 304 (Not Modified) response to replace all instances
        // of the corresponding header fields in the stored response.
        const headers = {};
        for (const k in this._resHeaders) {
            headers[k] =
                k in response.headers && !excludedFromRevalidationUpdate[k]
                    ? response.headers[k]
                    : this._resHeaders[k];
        }

        const newResponse = Object.assign({}, response, {
            status: this._status,
            method: this._method,
            headers,
        });
        return {
            policy: new this.constructor(request, newResponse, {
                shared: this._isShared,
                cacheHeuristic: this._cacheHeuristic,
                immutableMinTimeToLive: this._immutableMinTtl,
            }),
            modified: false,
            matches: true,
        };
    }
};


/***/ }),

/***/ 157:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const http2 = __webpack_require__(565);
const agent = __webpack_require__(899);
const ClientRequest = __webpack_require__(181);
const IncomingMessage = __webpack_require__(750);
const auto = __webpack_require__(988);

const request = (url, options, callback) => {
	return new ClientRequest(url, options, callback);
};

const get = (url, options, callback) => {
	// eslint-disable-next-line unicorn/prevent-abbreviations
	const req = new ClientRequest(url, options, callback);
	req.end();

	return req;
};

module.exports = {
	...http2,
	ClientRequest,
	IncomingMessage,
	...agent,
	request,
	get,
	auto
};


/***/ }),

/***/ 181:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const http2 = __webpack_require__(565);
const {Writable} = __webpack_require__(413);
const {Agent, globalAgent} = __webpack_require__(899);
const IncomingMessage = __webpack_require__(750);
const urlToOptions = __webpack_require__(507);
const proxyEvents = __webpack_require__(231);
const isRequestPseudoHeader = __webpack_require__(723);
const {
	ERR_INVALID_ARG_TYPE,
	ERR_INVALID_PROTOCOL,
	ERR_HTTP_HEADERS_SENT,
	ERR_INVALID_HTTP_TOKEN,
	ERR_HTTP_INVALID_HEADER_VALUE,
	ERR_INVALID_CHAR
} = __webpack_require__(699);

const {
	HTTP2_HEADER_STATUS,
	HTTP2_HEADER_METHOD,
	HTTP2_HEADER_PATH,
	HTTP2_METHOD_CONNECT
} = http2.constants;

const kHeaders = Symbol('headers');
const kOrigin = Symbol('origin');
const kSession = Symbol('session');
const kOptions = Symbol('options');
const kFlushedHeaders = Symbol('flushedHeaders');
const kJobs = Symbol('jobs');

const isValidHttpToken = /^[\^`\-\w!#$%&*+.|~]+$/;
const isInvalidHeaderValue = /[^\t\u0020-\u007E\u0080-\u00FF]/;

class ClientRequest extends Writable {
	constructor(input, options, callback) {
		super({
			autoDestroy: false
		});

		const hasInput = typeof input === 'string' || input instanceof URL;
		if (hasInput) {
			input = urlToOptions(input instanceof URL ? input : new URL(input));
		}

		if (typeof options === 'function' || options === undefined) {
			// (options, callback)
			callback = options;
			options = hasInput ? input : {...input};
		} else {
			// (input, options, callback)
			options = {...input, ...options};
		}

		if (options.h2session) {
			this[kSession] = options.h2session;
		} else if (options.agent === false) {
			this.agent = new Agent({maxFreeSessions: 0});
		} else if (typeof options.agent === 'undefined' || options.agent === null) {
			if (typeof options.createConnection === 'function') {
				// This is a workaround - we don't have to create the session on our own.
				this.agent = new Agent({maxFreeSessions: 0});
				this.agent.createConnection = options.createConnection;
			} else {
				this.agent = globalAgent;
			}
		} else if (typeof options.agent.request === 'function') {
			this.agent = options.agent;
		} else {
			throw new ERR_INVALID_ARG_TYPE('options.agent', ['Agent-like Object', 'undefined', 'false'], options.agent);
		}

		if (options.protocol && options.protocol !== 'https:') {
			throw new ERR_INVALID_PROTOCOL(options.protocol, 'https:');
		}

		const port = options.port || options.defaultPort || (this.agent && this.agent.defaultPort) || 443;
		const host = options.hostname || options.host || 'localhost';

		// Don't enforce the origin via options. It may be changed in an Agent.
		delete options.hostname;
		delete options.host;
		delete options.port;

		const {timeout} = options;
		options.timeout = undefined;

		this[kHeaders] = Object.create(null);
		this[kJobs] = [];

		this.socket = null;
		this.connection = null;

		this.method = options.method || 'GET';
		this.path = options.path;

		this.res = null;
		this.aborted = false;
		this.reusedSocket = false;

		if (options.headers) {
			for (const [header, value] of Object.entries(options.headers)) {
				this.setHeader(header, value);
			}
		}

		if (options.auth && !('authorization' in this[kHeaders])) {
			this[kHeaders].authorization = 'Basic ' + Buffer.from(options.auth).toString('base64');
		}

		options.session = options.tlsSession;
		options.path = options.socketPath;

		this[kOptions] = options;

		// Clients that generate HTTP/2 requests directly SHOULD use the :authority pseudo-header field instead of the Host header field.
		if (port === 443) {
			this[kOrigin] = `https://${host}`;

			if (!(':authority' in this[kHeaders])) {
				this[kHeaders][':authority'] = host;
			}
		} else {
			this[kOrigin] = `https://${host}:${port}`;

			if (!(':authority' in this[kHeaders])) {
				this[kHeaders][':authority'] = `${host}:${port}`;
			}
		}

		if (timeout) {
			this.setTimeout(timeout);
		}

		if (callback) {
			this.once('response', callback);
		}

		this[kFlushedHeaders] = false;
	}

	get method() {
		return this[kHeaders][HTTP2_HEADER_METHOD];
	}

	set method(value) {
		if (value) {
			this[kHeaders][HTTP2_HEADER_METHOD] = value.toUpperCase();
		}
	}

	get path() {
		return this[kHeaders][HTTP2_HEADER_PATH];
	}

	set path(value) {
		if (value) {
			this[kHeaders][HTTP2_HEADER_PATH] = value;
		}
	}

	get _mustNotHaveABody() {
		return this.method === 'GET' || this.method === 'HEAD' || this.method === 'DELETE';
	}

	_write(chunk, encoding, callback) {
		// https://github.com/nodejs/node/blob/654df09ae0c5e17d1b52a900a545f0664d8c7627/lib/internal/http2/util.js#L148-L156
		if (this._mustNotHaveABody) {
			callback(new Error('The GET, HEAD and DELETE methods must NOT have a body'));
			/* istanbul ignore next: Node.js 12 throws directly */
			return;
		}

		this.flushHeaders();

		const callWrite = () => this._request.write(chunk, encoding, callback);
		if (this._request) {
			callWrite();
		} else {
			this[kJobs].push(callWrite);
		}
	}

	_final(callback) {
		if (this.destroyed) {
			return;
		}

		this.flushHeaders();

		const callEnd = () => {
			// For GET, HEAD and DELETE
			if (this._mustNotHaveABody) {
				callback();
				return;
			}

			this._request.end(callback);
		};

		if (this._request) {
			callEnd();
		} else {
			this[kJobs].push(callEnd);
		}
	}

	abort() {
		if (this.res && this.res.complete) {
			return;
		}

		if (!this.aborted) {
			process.nextTick(() => this.emit('abort'));
		}

		this.aborted = true;

		this.destroy();
	}

	_destroy(error, callback) {
		if (this.res) {
			this.res._dump();
		}

		if (this._request) {
			this._request.destroy();
		}

		callback(error);
	}

	async flushHeaders() {
		if (this[kFlushedHeaders] || this.destroyed) {
			return;
		}

		this[kFlushedHeaders] = true;

		const isConnectMethod = this.method === HTTP2_METHOD_CONNECT;

		// The real magic is here
		const onStream = stream => {
			this._request = stream;

			if (this.destroyed) {
				stream.destroy();
				return;
			}

			// Forwards `timeout`, `continue`, `close` and `error` events to this instance.
			if (!isConnectMethod) {
				proxyEvents(stream, this, ['timeout', 'continue', 'close', 'error']);
			}

			// Wait for the `finish` event. We don't want to emit the `response` event
			// before `request.end()` is called.
			const waitForEnd = fn => {
				return (...args) => {
					if (!this.writable && !this.destroyed) {
						fn(...args);
					} else {
						this.once('finish', () => {
							fn(...args);
						});
					}
				};
			};

			// This event tells we are ready to listen for the data.
			stream.once('response', waitForEnd((headers, flags, rawHeaders) => {
				// If we were to emit raw request stream, it would be as fast as the native approach.
				// Note that wrapping the raw stream in a Proxy instance won't improve the performance (already tested it).
				const response = new IncomingMessage(this.socket, stream.readableHighWaterMark);
				this.res = response;

				response.req = this;
				response.statusCode = headers[HTTP2_HEADER_STATUS];
				response.headers = headers;
				response.rawHeaders = rawHeaders;

				response.once('end', () => {
					if (this.aborted) {
						response.aborted = true;
						response.emit('aborted');
					} else {
						response.complete = true;

						// Has no effect, just be consistent with the Node.js behavior
						response.socket = null;
						response.connection = null;
					}
				});

				if (isConnectMethod) {
					response.upgrade = true;

					// The HTTP1 API says the socket is detached here,
					// but we can't do that so we pass the original HTTP2 request.
					if (this.emit('connect', response, stream, Buffer.alloc(0))) {
						this.emit('close');
					} else {
						// No listeners attached, destroy the original request.
						stream.destroy();
					}
				} else {
					// Forwards data
					stream.on('data', chunk => {
						if (!response._dumped && !response.push(chunk)) {
							stream.pause();
						}
					});

					stream.once('end', () => {
						response.push(null);
					});

					if (!this.emit('response', response)) {
						// No listeners attached, dump the response.
						response._dump();
					}
				}
			}));

			// Emits `information` event
			stream.once('headers', waitForEnd(
				headers => this.emit('information', {statusCode: headers[HTTP2_HEADER_STATUS]})
			));

			stream.once('trailers', waitForEnd((trailers, flags, rawTrailers) => {
				const {res} = this;

				// Assigns trailers to the response object.
				res.trailers = trailers;
				res.rawTrailers = rawTrailers;
			}));

			const {socket} = stream.session;
			this.socket = socket;
			this.connection = socket;

			for (const job of this[kJobs]) {
				job();
			}

			this.emit('socket', this.socket);
		};

		// Makes a HTTP2 request
		if (this[kSession]) {
			try {
				onStream(this[kSession].request(this[kHeaders]));
			} catch (error) {
				this.emit('error', error);
			}
		} else {
			this.reusedSocket = true;

			try {
				onStream(await this.agent.request(this[kOrigin], this[kOptions], this[kHeaders]));
			} catch (error) {
				this.emit('error', error);
			}
		}
	}

	getHeader(name) {
		if (typeof name !== 'string') {
			throw new ERR_INVALID_ARG_TYPE('name', 'string', name);
		}

		return this[kHeaders][name.toLowerCase()];
	}

	get headersSent() {
		return this[kFlushedHeaders];
	}

	removeHeader(name) {
		if (typeof name !== 'string') {
			throw new ERR_INVALID_ARG_TYPE('name', 'string', name);
		}

		if (this.headersSent) {
			throw new ERR_HTTP_HEADERS_SENT('remove');
		}

		delete this[kHeaders][name.toLowerCase()];
	}

	setHeader(name, value) {
		if (this.headersSent) {
			throw new ERR_HTTP_HEADERS_SENT('set');
		}

		if (typeof name !== 'string' || (!isValidHttpToken.test(name) && !isRequestPseudoHeader(name))) {
			throw new ERR_INVALID_HTTP_TOKEN('Header name', name);
		}

		if (typeof value === 'undefined') {
			throw new ERR_HTTP_INVALID_HEADER_VALUE(value, name);
		}

		if (isInvalidHeaderValue.test(value)) {
			throw new ERR_INVALID_CHAR('header content', name);
		}

		this[kHeaders][name.toLowerCase()] = value;
	}

	setNoDelay() {
		// HTTP2 sockets cannot be malformed, do nothing.
	}

	setSocketKeepAlive() {
		// HTTP2 sockets cannot be malformed, do nothing.
	}

	setTimeout(ms, callback) {
		const applyTimeout = () => this._request.setTimeout(ms, callback);

		if (this._request) {
			applyTimeout();
		} else {
			this[kJobs].push(applyTimeout);
		}

		return this;
	}

	get maxHeadersCount() {
		if (!this.destroyed && this._request) {
			return this._request.session.localSettings.maxHeaderListSize;
		}

		return undefined;
	}

	set maxHeadersCount(_value) {
		// Updating HTTP2 settings would affect all requests, do nothing.
	}
}

module.exports = ClientRequest;


/***/ }),

/***/ 189:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const alreadyWarned = new Set();
exports.default = (message) => {
    if (alreadyWarned.has(message)) {
        return;
    }
    alreadyWarned.add(message);
    // @ts-expect-error Missing types.
    process.emitWarning(`Got: ${message}`, {
        type: 'DeprecationWarning'
    });
};


/***/ }),

/***/ 205:
/***/ (function(__unusedmodule, exports) {

//TODO: handle reviver/dehydrate function like normal
//and handle indentation, like normal.
//if anyone needs this... please send pull request.

exports.stringify = function stringify (o) {
  if('undefined' == typeof o) return o

  if(o && Buffer.isBuffer(o))
    return JSON.stringify(':base64:' + o.toString('base64'))

  if(o && o.toJSON)
    o =  o.toJSON()

  if(o && 'object' === typeof o) {
    var s = ''
    var array = Array.isArray(o)
    s = array ? '[' : '{'
    var first = true

    for(var k in o) {
      var ignore = 'function' == typeof o[k] || (!array && 'undefined' === typeof o[k])
      if(Object.hasOwnProperty.call(o, k) && !ignore) {
        if(!first)
          s += ','
        first = false
        if (array) {
          if(o[k] == undefined)
            s += 'null'
          else
            s += stringify(o[k])
        } else if (o[k] !== void(0)) {
          s += stringify(k) + ':' + stringify(o[k])
        }
      }
    }

    s += array ? ']' : '}'

    return s
  } else if ('string' === typeof o) {
    return JSON.stringify(/^:/.test(o) ? ':' + o : o)
  } else if ('undefined' === typeof o) {
    return 'null';
  } else
    return JSON.stringify(o)
}

exports.parse = function (s) {
  return JSON.parse(s, function (key, value) {
    if('string' === typeof value) {
      if(/^:base64:/.test(value))
        return Buffer.from(value.substring(8), 'base64')
      else
        return /^:/.test(value) ? value.substring(1) : value 
    }
    return value
  })
}


/***/ }),

/***/ 211:
/***/ (function(module) {

module.exports = require("https");

/***/ }),

/***/ 231:
/***/ (function(module) {

"use strict";


module.exports = (from, to, events) => {
	for (const event of events) {
		from.on(event, (...args) => to.emit(event, ...args));
	}
};


/***/ }),

/***/ 291:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = __webpack_require__(534);
function deepFreeze(object) {
    for (const value of Object.values(object)) {
        if (is_1.default.plainObject(value) || is_1.default.array(value)) {
            deepFreeze(value);
        }
    }
    return Object.freeze(object);
}
exports.default = deepFreeze;


/***/ }),

/***/ 293:
/***/ (function(module) {

module.exports = require("buffer");

/***/ }),

/***/ 303:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const EventEmitter = __webpack_require__(614);
const JSONB = __webpack_require__(205);

const loadStore = opts => {
	const adapters = {
		redis: '@keyv/redis',
		mongodb: '@keyv/mongo',
		mongo: '@keyv/mongo',
		sqlite: '@keyv/sqlite',
		postgresql: '@keyv/postgres',
		postgres: '@keyv/postgres',
		mysql: '@keyv/mysql'
	};
	if (opts.adapter || opts.uri) {
		const adapter = opts.adapter || /^[^:]*/.exec(opts.uri)[0];
		return new (require(adapters[adapter]))(opts);
	}

	return new Map();
};

class Keyv extends EventEmitter {
	constructor(uri, opts) {
		super();
		this.opts = Object.assign(
			{
				namespace: 'keyv',
				serialize: JSONB.stringify,
				deserialize: JSONB.parse
			},
			(typeof uri === 'string') ? { uri } : uri,
			opts
		);

		if (!this.opts.store) {
			const adapterOpts = Object.assign({}, this.opts);
			this.opts.store = loadStore(adapterOpts);
		}

		if (typeof this.opts.store.on === 'function') {
			this.opts.store.on('error', err => this.emit('error', err));
		}

		this.opts.store.namespace = this.opts.namespace;
	}

	_getKeyPrefix(key) {
		return `${this.opts.namespace}:${key}`;
	}

	get(key, opts) {
		const keyPrefixed = this._getKeyPrefix(key);
		const { store } = this.opts;
		return Promise.resolve()
			.then(() => store.get(keyPrefixed))
			.then(data => {
				return (typeof data === 'string') ? this.opts.deserialize(data) : data;
			})
			.then(data => {
				if (data === undefined) {
					return undefined;
				}

				if (typeof data.expires === 'number' && Date.now() > data.expires) {
					this.delete(key);
					return undefined;
				}

				return (opts && opts.raw) ? data : data.value;
			});
	}

	set(key, value, ttl) {
		const keyPrefixed = this._getKeyPrefix(key);
		if (typeof ttl === 'undefined') {
			ttl = this.opts.ttl;
		}

		if (ttl === 0) {
			ttl = undefined;
		}

		const { store } = this.opts;

		return Promise.resolve()
			.then(() => {
				const expires = (typeof ttl === 'number') ? (Date.now() + ttl) : null;
				value = { value, expires };
				return this.opts.serialize(value);
			})
			.then(value => store.set(keyPrefixed, value, ttl))
			.then(() => true);
	}

	delete(key) {
		const keyPrefixed = this._getKeyPrefix(key);
		const { store } = this.opts;
		return Promise.resolve()
			.then(() => store.delete(keyPrefixed));
	}

	clear() {
		const { store } = this.opts;
		return Promise.resolve()
			.then(() => store.clear());
	}
}

module.exports = Keyv;


/***/ }),

/***/ 323:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultHandler = void 0;
const is_1 = __webpack_require__(534);
const as_promise_1 = __webpack_require__(577);
const create_rejection_1 = __webpack_require__(910);
const core_1 = __webpack_require__(946);
const deep_freeze_1 = __webpack_require__(291);
const errors = {
    RequestError: as_promise_1.RequestError,
    CacheError: as_promise_1.CacheError,
    ReadError: as_promise_1.ReadError,
    HTTPError: as_promise_1.HTTPError,
    MaxRedirectsError: as_promise_1.MaxRedirectsError,
    TimeoutError: as_promise_1.TimeoutError,
    ParseError: as_promise_1.ParseError,
    CancelError: as_promise_1.CancelError,
    UnsupportedProtocolError: as_promise_1.UnsupportedProtocolError,
    UploadError: as_promise_1.UploadError
};
// The `delay` package weighs 10KB (!)
const delay = async (ms) => new Promise(resolve => {
    setTimeout(resolve, ms);
});
const { normalizeArguments } = core_1.default;
const mergeOptions = (...sources) => {
    let mergedOptions;
    for (const source of sources) {
        mergedOptions = normalizeArguments(undefined, source, mergedOptions);
    }
    return mergedOptions;
};
const getPromiseOrStream = (options) => options.isStream ? new core_1.default(undefined, options) : as_promise_1.default(options);
const isGotInstance = (value) => ('defaults' in value && 'options' in value.defaults);
const aliases = [
    'get',
    'post',
    'put',
    'patch',
    'head',
    'delete'
];
exports.defaultHandler = (options, next) => next(options);
const callInitHooks = (hooks, options) => {
    if (hooks) {
        for (const hook of hooks) {
            hook(options);
        }
    }
};
const create = (defaults) => {
    // Proxy properties from next handlers
    defaults._rawHandlers = defaults.handlers;
    defaults.handlers = defaults.handlers.map(fn => ((options, next) => {
        // This will be assigned by assigning result
        let root;
        const result = fn(options, newOptions => {
            root = next(newOptions);
            return root;
        });
        if (result !== root && !options.isStream && root) {
            const typedResult = result;
            const { then: promiseThen, catch: promiseCatch, finally: promiseFianlly } = typedResult;
            Object.setPrototypeOf(typedResult, Object.getPrototypeOf(root));
            Object.defineProperties(typedResult, Object.getOwnPropertyDescriptors(root));
            // These should point to the new promise
            // eslint-disable-next-line promise/prefer-await-to-then
            typedResult.then = promiseThen;
            typedResult.catch = promiseCatch;
            typedResult.finally = promiseFianlly;
        }
        return result;
    }));
    // Got interface
    const got = ((url, options = {}, _defaults) => {
        var _a, _b;
        let iteration = 0;
        const iterateHandlers = (newOptions) => {
            return defaults.handlers[iteration++](newOptions, iteration === defaults.handlers.length ? getPromiseOrStream : iterateHandlers);
        };
        // TODO: Remove this in Got 12.
        if (is_1.default.plainObject(url)) {
            const mergedOptions = {
                ...url,
                ...options
            };
            core_1.setNonEnumerableProperties([url, options], mergedOptions);
            options = mergedOptions;
            url = undefined;
        }
        try {
            // Call `init` hooks
            let initHookError;
            try {
                callInitHooks(defaults.options.hooks.init, options);
                callInitHooks((_a = options.hooks) === null || _a === void 0 ? void 0 : _a.init, options);
            }
            catch (error) {
                initHookError = error;
            }
            // Normalize options & call handlers
            const normalizedOptions = normalizeArguments(url, options, _defaults !== null && _defaults !== void 0 ? _defaults : defaults.options);
            normalizedOptions[core_1.kIsNormalizedAlready] = true;
            if (initHookError) {
                throw new as_promise_1.RequestError(initHookError.message, initHookError, normalizedOptions);
            }
            return iterateHandlers(normalizedOptions);
        }
        catch (error) {
            if (options.isStream) {
                throw error;
            }
            else {
                return create_rejection_1.default(error, defaults.options.hooks.beforeError, (_b = options.hooks) === null || _b === void 0 ? void 0 : _b.beforeError);
            }
        }
    });
    got.extend = (...instancesOrOptions) => {
        const optionsArray = [defaults.options];
        let handlers = [...defaults._rawHandlers];
        let isMutableDefaults;
        for (const value of instancesOrOptions) {
            if (isGotInstance(value)) {
                optionsArray.push(value.defaults.options);
                handlers.push(...value.defaults._rawHandlers);
                isMutableDefaults = value.defaults.mutableDefaults;
            }
            else {
                optionsArray.push(value);
                if ('handlers' in value) {
                    handlers.push(...value.handlers);
                }
                isMutableDefaults = value.mutableDefaults;
            }
        }
        handlers = handlers.filter(handler => handler !== exports.defaultHandler);
        if (handlers.length === 0) {
            handlers.push(exports.defaultHandler);
        }
        return create({
            options: mergeOptions(...optionsArray),
            handlers,
            mutableDefaults: Boolean(isMutableDefaults)
        });
    };
    // Pagination
    const paginateEach = (async function* (url, options) {
        // TODO: Remove this `@ts-expect-error` when upgrading to TypeScript 4.
        // Error: Argument of type 'Merge<Options, PaginationOptions<T, R>> | undefined' is not assignable to parameter of type 'Options | undefined'.
        // @ts-expect-error
        let normalizedOptions = normalizeArguments(url, options, defaults.options);
        normalizedOptions.resolveBodyOnly = false;
        const pagination = normalizedOptions.pagination;
        if (!is_1.default.object(pagination)) {
            throw new TypeError('`options.pagination` must be implemented');
        }
        const all = [];
        let { countLimit } = pagination;
        let numberOfRequests = 0;
        while (numberOfRequests < pagination.requestLimit) {
            if (numberOfRequests !== 0) {
                // eslint-disable-next-line no-await-in-loop
                await delay(pagination.backoff);
            }
            // @ts-expect-error FIXME!
            // TODO: Throw when result is not an instance of Response
            // eslint-disable-next-line no-await-in-loop
            const result = (await got(undefined, undefined, normalizedOptions));
            // eslint-disable-next-line no-await-in-loop
            const parsed = await pagination.transform(result);
            const current = [];
            for (const item of parsed) {
                if (pagination.filter(item, all, current)) {
                    if (!pagination.shouldContinue(item, all, current)) {
                        return;
                    }
                    yield item;
                    if (pagination.stackAllItems) {
                        all.push(item);
                    }
                    current.push(item);
                    if (--countLimit <= 0) {
                        return;
                    }
                }
            }
            const optionsToMerge = pagination.paginate(result, all, current);
            if (optionsToMerge === false) {
                return;
            }
            if (optionsToMerge === result.request.options) {
                normalizedOptions = result.request.options;
            }
            else if (optionsToMerge !== undefined) {
                normalizedOptions = normalizeArguments(undefined, optionsToMerge, normalizedOptions);
            }
            numberOfRequests++;
        }
    });
    got.paginate = paginateEach;
    got.paginate.all = (async (url, options) => {
        const results = [];
        for await (const item of paginateEach(url, options)) {
            results.push(item);
        }
        return results;
    });
    // For those who like very descriptive names
    got.paginate.each = paginateEach;
    // Stream API
    got.stream = ((url, options) => got(url, { ...options, isStream: true }));
    // Shortcuts
    for (const method of aliases) {
        got[method] = ((url, options) => got(url, { ...options, method }));
        got.stream[method] = ((url, options) => {
            return got(url, { ...options, method, isStream: true });
        });
    }
    Object.assign(got, errors);
    Object.defineProperty(got, 'defaults', {
        value: defaults.mutableDefaults ? defaults : deep_freeze_1.default(defaults),
        writable: defaults.mutableDefaults,
        configurable: defaults.mutableDefaults,
        enumerable: true
    });
    got.mergeOptions = mergeOptions;
    return got;
};
exports.default = create;
__exportStar(__webpack_require__(839), exports);


/***/ }),

/***/ 325:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const PassThrough = __webpack_require__(413).PassThrough;
const mimicResponse = __webpack_require__(89);

const cloneResponse = response => {
	if (!(response && response.pipe)) {
		throw new TypeError('Parameter `response` must be a response stream.');
	}

	const clone = new PassThrough();
	mimicResponse(response, clone);

	return response.pipe(clone);
};

module.exports = cloneResponse;


/***/ }),

/***/ 350:
/***/ (function(module) {

(function(f){if(true){module.exports=f()}else { var g; }})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c=require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u=require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * © Copyright IBM Corp. 2018 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

const utils = require('./utils');

/**
 * DateTime formatting and parsing functions
 * Implements the xpath-functions format-date-time specification
 * @type {{formatInteger, formatDateTime, parseInteger, parseDateTime}}
 */
const dateTime = (function () {
    'use strict';

    const stringToArray = utils.stringToArray;

    const few = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const ordinals = ['Zeroth', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth',
        'Eleventh', 'Twelfth', 'Thirteenth', 'Fourteenth', 'Fifteenth', 'Sixteenth', 'Seventeenth', 'Eighteenth', 'Nineteenth'];
    const decades = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety', 'Hundred'];
    const magnitudes = ['Thousand', 'Million', 'Billion', 'Trillion'];

    /**
     * converts a number into english words
     * @param {string} value - the value to format
     * @param {boolean} ordinal - ordinal or cardinal form
     * @returns {string} - representation in words
     */
    function numberToWords(value, ordinal) {
        var lookup = function (num, prev, ord) {
            var words = '';
            if (num <= 19) {
                words = (prev ? ' and ' : '') + (ord ? ordinals[num] : few[num]);
            } else if (num < 100) {
                const tens = Math.floor(num / 10);
                const remainder = num % 10;
                words = (prev ? ' and ' : '') + decades[tens - 2];
                if (remainder > 0) {
                    words += '-' + lookup(remainder, false, ord);
                } else if (ord) {
                    words = words.substring(0, words.length - 1) + 'ieth';
                }
            } else if (num < 1000) {
                const hundreds = Math.floor(num / 100);
                const remainder = num % 100;
                words = (prev ? ', ' : '') + few[hundreds] + ' Hundred';
                if (remainder > 0) {
                    words += lookup(remainder, true, ord);
                } else if (ord) {
                    words += 'th';
                }
            } else {
                var mag = Math.floor(Math.log10(num) / 3);
                if (mag > magnitudes.length) {
                    mag = magnitudes.length; // the largest word
                }
                const factor = Math.pow(10, mag * 3);
                const mant = Math.floor(num / factor);
                const remainder = num - mant * factor;
                words = (prev ? ', ' : '') + lookup(mant, false, false) + ' ' + magnitudes[mag - 1];
                if (remainder > 0) {
                    words += lookup(remainder, true, ord);
                } else if (ord) {
                    words += 'th';
                }
            }
            return words;
        };

        var words = lookup(value, false, ordinal);
        return words;
    }

    const wordValues = {};
    few.forEach(function (word, index) {
        wordValues[word.toLowerCase()] = index;
    });
    ordinals.forEach(function (word, index) {
        wordValues[word.toLowerCase()] = index;
    });
    decades.forEach(function (word, index) {
        const lword = word.toLowerCase();
        wordValues[lword] = (index + 2) * 10;
        wordValues[lword.substring(0, word.length - 1) + 'ieth'] = wordValues[lword];
    });
    wordValues.hundredth = 100;
    magnitudes.forEach(function (word, index) {
        const lword = word.toLowerCase();
        const val = Math.pow(10, (index + 1) * 3);
        wordValues[lword] = val;
        wordValues[lword + 'th'] = val;
    });

    /**
     * Converts a number in english words to numeric value
     * @param {string} text - the number in words
     * @returns {number} - the numeric value
     */
    function wordsToNumber(text) {
        const parts = text.split(/,\s|\sand\s|[\s\\-]/);
        const values = parts.map(part => wordValues[part]);
        let segs = [0];
        values.forEach(value => {
            if (value < 100) {
                let top = segs.pop();
                if (top >= 1000) {
                    segs.push(top);
                    top = 0;
                }
                segs.push(top + value);
            } else {
                segs.push(segs.pop() * value);
            }
        });
        const result = segs.reduce((a, b) => a + b, 0);
        return result;
    }

    const romanNumerals = [
        [1000, 'm'],
        [900, 'cm'],
        [500, 'd'],
        [400, 'cd'],
        [100, 'c'],
        [90, 'xc'],
        [50, 'l'],
        [40, 'xl'],
        [10, 'x'],
        [9, 'ix'],
        [5, 'v'],
        [4, 'iv'],
        [1, 'i']
    ];

    const romanValues = {'M': 1000, 'D': 500, 'C': 100, 'L': 50, 'X': 10, 'V': 5, 'I': 1};

    /**
     * converts a number to roman numerals
     * @param {number} value - the number
     * @returns {string} - the number in roman numerals
     */
    function decimalToRoman(value) {
        for (var index = 0; index < romanNumerals.length; index++) {
            const numeral = romanNumerals[index];
            if (value >= numeral[0]) {
                return numeral[1] + decimalToRoman(value - numeral[0]);
            }
        }
        return '';
    }

    /**
     * converts roman numerals to a number
     * @param {string} roman - roman number
     * @returns {number} - the numeric value
     */
    function romanToDecimal(roman) {
        var decimal = 0;
        var max = 1;
        for (var i = roman.length - 1; i >= 0; i--) {
            const digit = roman[i];
            const value = romanValues[digit];
            if (value < max) {
                decimal -= value;
            } else {
                max = value;
                decimal += value;
            }
        }
        return decimal;
    }

    /**
     * converts a number to spreadsheet style letters
     * @param {number} value - the number
     * @param {string} aChar - the character representing the start of the sequence, e.g. 'A'
     * @returns {string} - the letters
     */
    function decimalToLetters(value, aChar) {
        var letters = [];
        var aCode = aChar.charCodeAt(0);
        while (value > 0) {
            letters.unshift(String.fromCharCode((value - 1) % 26 + aCode));
            value = Math.floor((value - 1) / 26);
        }
        return letters.join('');
    }

    /**
     * converts spreadsheet style letters to a number
     * @param {string} letters - the letters
     * @param {string} aChar - the character representing the start of the sequence, e.g. 'A'
     * @returns {number} - the numeric value
     */
    function lettersToDecimal(letters, aChar) {
        var aCode = aChar.charCodeAt(0);
        var decimal = 0;
        for (var i = 0; i < letters.length; i++) {
            decimal += (letters.charCodeAt(letters.length - i - 1) - aCode + 1) * Math.pow(26, i);
        }
        return decimal;
    }

    /**
     * Formats an integer as specified by the XPath fn:format-integer function
     * See https://www.w3.org/TR/xpath-functions-31/#func-format-integer
     * @param {number} value - the number to be formatted
     * @param {string} picture - the picture string that specifies the format
     * @returns {string} - the formatted number
     */
    function formatInteger(value, picture) {
        if (typeof value === 'undefined') {
            return undefined;
        }

        value = Math.floor(value);

        const format = analyseIntegerPicture(picture);
        return _formatInteger(value, format);
    }

    const formats = {
        DECIMAL: 'decimal',
        LETTERS: 'letters',
        ROMAN: 'roman',
        WORDS: 'words',
        SEQUENCE: 'sequence'
    };

    const tcase = {
        UPPER: 'upper',
        LOWER: 'lower',
        TITLE: 'title'
    };

    /**
     * formats an integer using a preprocessed representation of the picture string
     * @param {number} value - the number to be formatted
     * @param {object} format - the preprocessed representation of the pucture string
     * @returns {string} - the formatted number
     * @private
     */
    function _formatInteger(value, format) {
        let formattedInteger;
        const negative = value < 0;
        value = Math.abs(value);
        switch (format.primary) {
            case formats.LETTERS:
                formattedInteger = decimalToLetters(value, format.case === tcase.UPPER ? 'A' : 'a');
                break;
            case formats.ROMAN:
                formattedInteger = decimalToRoman(value);
                if (format.case === tcase.UPPER) {
                    formattedInteger = formattedInteger.toUpperCase();
                }
                break;
            case formats.WORDS:
                formattedInteger = numberToWords(value, format.ordinal);
                if (format.case === tcase.UPPER) {
                    formattedInteger = formattedInteger.toUpperCase();
                } else if (format.case === tcase.LOWER) {
                    formattedInteger = formattedInteger.toLowerCase();
                }
                break;
            case formats.DECIMAL:
                formattedInteger = '' + value;
                // TODO use functionPad
                var padLength = format.mandatoryDigits - formattedInteger.length;
                if (padLength > 0) {
                    var padding = (new Array(padLength + 1)).join('0');
                    formattedInteger = padding + formattedInteger;
                }
                if (format.zeroCode !== 0x30) {
                    formattedInteger = stringToArray(formattedInteger).map(code => {
                        return String.fromCodePoint(code.codePointAt(0) + format.zeroCode - 0x30);
                    }).join('');
                }
                // insert the grouping-separator-signs, if any
                if (format.regular) {
                    const n = Math.floor((formattedInteger.length - 1) / format.groupingSeparators.position);
                    for (let ii = n; ii > 0; ii--) {
                        const pos = formattedInteger.length - ii * format.groupingSeparators.position;
                        formattedInteger = formattedInteger.substr(0, pos) + format.groupingSeparators.character + formattedInteger.substr(pos);
                    }
                } else {
                    format.groupingSeparators.reverse().forEach(separator => {
                        const pos = formattedInteger.length - separator.position;
                        formattedInteger = formattedInteger.substr(0, pos) + separator.character + formattedInteger.substr(pos);
                    });
                }

                if (format.ordinal) {
                    var suffix123 = {'1': 'st', '2': 'nd', '3': 'rd'};
                    var lastDigit = formattedInteger[formattedInteger.length - 1];
                    var suffix = suffix123[lastDigit];
                    if (!suffix || (formattedInteger.length > 1 && formattedInteger[formattedInteger.length - 2] === '1')) {
                        suffix = 'th';
                    }
                    formattedInteger = formattedInteger + suffix;
                }
                break;
            case formats.SEQUENCE:
                throw {
                    code: 'D3130',
                    value: format.token
                };
        }
        if (negative) {
            formattedInteger = '-' + formattedInteger;
        }

        return formattedInteger;
    }

    //TODO what about decimal groups in the unicode supplementary planes (surrogate pairs) ???
    const decimalGroups = [0x30, 0x0660, 0x06F0, 0x07C0, 0x0966, 0x09E6, 0x0A66, 0x0AE6, 0x0B66, 0x0BE6, 0x0C66, 0x0CE6, 0x0D66, 0x0DE6, 0x0E50, 0x0ED0, 0x0F20, 0x1040, 0x1090, 0x17E0, 0x1810, 0x1946, 0x19D0, 0x1A80, 0x1A90, 0x1B50, 0x1BB0, 0x1C40, 0x1C50, 0xA620, 0xA8D0, 0xA900, 0xA9D0, 0xA9F0, 0xAA50, 0xABF0, 0xFF10];

    /**
     * preprocesses the picture string
     * @param {string} picture - picture string
     * @returns {{type: string, primary: string, case: string, ordinal: boolean}} - analysed picture
     */
    function analyseIntegerPicture(picture) {
        const format = {
            type: 'integer',
            primary: formats.DECIMAL,
            case: tcase.LOWER,
            ordinal: false
        };

        let primaryFormat, formatModifier;
        const semicolon = picture.lastIndexOf(';');
        if (semicolon === -1) {
            primaryFormat = picture;
        } else {
            primaryFormat = picture.substring(0, semicolon);
            formatModifier = picture.substring(semicolon + 1);
            if (formatModifier[0] === 'o') {
                format.ordinal = true;
            }
        }

        /* eslnt-disable-next no-fallthrough */
        switch (primaryFormat) {
            case 'A':
                format.case = tcase.UPPER;
            /* eslnt-disable-next-line no-fallthrough */
            case 'a':
                format.primary = formats.LETTERS;
                break;
            case 'I':
                format.case = tcase.UPPER;
            /* eslnt-disable-next-line no-fallthrough */
            case 'i':
                format.primary = formats.ROMAN;
                break;
            case 'W':
                format.case = tcase.UPPER;
                format.primary = formats.WORDS;
                break;
            case 'Ww':
                format.case = tcase.TITLE;
                format.primary = formats.WORDS;
                break;
            case 'w':
                format.primary = formats.WORDS;
                break;
            default: {
                // this is a decimal-digit-pattern if it contains a decimal digit (from any unicode decimal digit group)
                let zeroCode = null;
                let mandatoryDigits = 0;
                let optionalDigits = 0;
                let groupingSeparators = [];
                let separatorPosition = 0;
                const formatCodepoints = stringToArray(primaryFormat).map(c => c.codePointAt(0)).reverse(); // reverse the array to determine positions of grouping-separator-signs
                formatCodepoints.forEach((codePoint) => {
                    // step though each char in the picture to determine the digit group
                    let digit = false;
                    for (let ii = 0; ii < decimalGroups.length; ii++) {
                        const group = decimalGroups[ii];
                        if (codePoint >= group && codePoint <= group + 9) {
                            // codepoint is part of this decimal group
                            digit = true;
                            mandatoryDigits++;
                            separatorPosition++;
                            if (zeroCode === null) {
                                zeroCode = group;
                            } else if (group !== zeroCode) {
                                // error! different decimal groups in the same pattern
                                throw {
                                    code: 'D3131'
                                };
                            }
                            break;
                        }
                    }
                    if (!digit) {
                        if (codePoint === 0x23) { // # - optional-digit-sign
                            separatorPosition++;
                            optionalDigits++;
                        } else {
                            // neither a decimal-digit-sign ot optional-digit-sign, assume it is a grouping-separator-sign
                            groupingSeparators.push({
                                position: separatorPosition,
                                character: String.fromCodePoint(codePoint)
                            });
                        }
                    }
                });
                if (mandatoryDigits > 0) {
                    format.primary = formats.DECIMAL;
                    // TODO validate decimal-digit-pattern

                    // the decimal digit family (codepoint offset)
                    format.zeroCode = zeroCode;
                    // the number of mandatory digits
                    format.mandatoryDigits = mandatoryDigits;
                    // the number of optional digits
                    format.optionalDigits = optionalDigits;
                    // grouping separator template
                    // are the grouping-separator-signs 'regular'?
                    const regularRepeat = function (separators) {
                        // are the grouping positions regular? i.e. same interval between each of them
                        // is there at least one separator?
                        if (separators.length === 0) {
                            return 0;
                        }
                        // are all the characters the same?
                        const sepChar = separators[0].character;
                        for (let ii = 1; ii < separators.length; ii++) {
                            if (separators[ii].character !== sepChar) {
                                return 0;
                            }
                        }
                        // are they equally spaced?
                        const indexes = separators.map(separator => separator.position);
                        const gcd = function (a, b) {
                            return b === 0 ? a : gcd(b, a % b);
                        };
                        // find the greatest common divisor of all the positions
                        const factor = indexes.reduce(gcd);
                        // is every position separated by this divisor? If so, it's regular
                        for (let index = 1; index <= indexes.length; index++) {
                            if (indexes.indexOf(index * factor) === -1) {
                                return 0;
                            }
                        }
                        return factor;
                    };

                    const regular = regularRepeat(groupingSeparators);
                    if (regular > 0) {
                        format.regular = true;
                        format.groupingSeparators = {
                            position: regular,
                            character: groupingSeparators[0].character
                        };
                    } else {
                        format.regular = false;
                        format.groupingSeparators = groupingSeparators;
                    }

                } else {
                    // this is a 'numbering sequence' which the spec says is implementation-defined
                    // this implementation doesn't support any numbering sequences at the moment.
                    format.primary = formats.SEQUENCE;
                    format.token = primaryFormat;
                }
            }
        }

        return format;
    }

    const defaultPresentationModifiers = {
        Y: '1', M: '1', D: '1', d: '1', F: 'n', W: '1', w: '1', X: '1', x: '1', H: '1', h: '1',
        P: 'n', m: '01', s: '01', f: '1', Z: '01:01', z: '01:01', C: 'n', E: 'n'
    };

    // §9.8.4.1 the format specifier is an array of string literals and variable markers
    /**
     * analyse the date-time picture string
     * @param {string} picture - picture string
     * @returns {{type: string, parts: Array}} - the analysed string
     */
    function analyseDateTimePicture(picture) {
        var spec = [];
        const format = {
            type: 'datetime',
            parts: spec
        };
        const addLiteral = function (start, end) {
            if (end > start) {
                let literal = picture.substring(start, end);
                // replace any doubled ]] with single ]
                // what if there are instances of single ']' ? - the spec doesn't say
                literal = literal.split(']]').join(']');
                spec.push({type: 'literal', value: literal});
            }
        };

        var start = 0, pos = 0;
        while (pos < picture.length) {
            if (picture.charAt(pos) === '[') {
                // check it's not a doubled [[
                if (picture.charAt(pos + 1) === '[') {
                    // literal [
                    addLiteral(start, pos);
                    spec.push({type: 'literal', value: '['});
                    pos += 2;
                    start = pos;
                    continue;
                }
                // start of variable marker
                // push the string literal (if there is one) onto the array
                addLiteral(start, pos);
                start = pos;
                // search forward to closing ]
                pos = picture.indexOf(']', start);
                // TODO handle error case if pos === -1
                if(pos === -1) {
                    // error - no closing bracket
                    throw {
                        code: 'D3135'
                    };
                }
                let marker = picture.substring(start + 1, pos);
                // whitespace within a variable marker is ignored (i.e. remove it)
                marker = marker.split(/\s+/).join('');
                var def = {
                    type: 'marker',
                    component: marker.charAt(0)  // 1. The component specifier is always present and is always a single letter.
                };
                var comma = marker.lastIndexOf(','); // 2. The width modifier may be recognized by the presence of a comma
                var presMod; // the presentation modifiers
                if (comma !== -1) {
                    // §9.8.4.2 The Width Modifier
                    const widthMod = marker.substring(comma + 1);
                    const dash = widthMod.indexOf('-');
                    let min, max;
                    const parseWidth = function (wm) {
                        if (typeof wm === 'undefined' || wm === '*') {
                            return undefined;
                        } else {
                            // TODO validate wm is an unsigned int
                            return parseInt(wm);
                        }
                    };
                    if (dash === -1) {
                        min = widthMod;
                    } else {
                        min = widthMod.substring(0, dash);
                        max = widthMod.substring(dash + 1);
                    }
                    const widthDef = {
                        min: parseWidth(min),
                        max: parseWidth(max)
                    };
                    def.width = widthDef;
                    presMod = marker.substring(1, comma);
                } else {
                    presMod = marker.substring(1);
                }
                if (presMod.length === 1) {
                    def.presentation1 = presMod; // first presentation modifier
                    //TODO validate the first presentation modifier - it's either N, n, Nn or it passes analyseIntegerPicture
                } else if (presMod.length > 1) {
                    var lastChar = presMod.charAt(presMod.length - 1);
                    if ('atco'.indexOf(lastChar) !== -1) {
                        def.presentation2 = lastChar;
                        if (lastChar === 'o') {
                            def.ordinal = true;
                        }
                        // 'c' means 'cardinal' and is the default (i.e. not 'ordinal')
                        // 'a' & 't' are ignored (not sure of their relevance to English numbering)
                        def.presentation1 = presMod.substring(0, presMod.length - 1);
                    } else {
                        def.presentation1 = presMod;
                        //TODO validate the first presentation modifier - it's either N, n, Nn or it passes analyseIntegerPicture,
                        // doesn't use ] as grouping separator, and if grouping separator is , then must have width modifier
                    }
                } else {
                    // no presentation modifier specified - apply the default;
                    def.presentation1 = defaultPresentationModifiers[def.component];
                }
                if (typeof def.presentation1 === 'undefined') {
                    // unknown component specifier
                    throw {
                        code: 'D3132',
                        value: def.component
                    };
                }
                if (def.presentation1[0] === 'n') {
                    def.names = tcase.LOWER;
                } else if (def.presentation1[0] === 'N') {
                    if (def.presentation1[1] === 'n') {
                        def.names = tcase.TITLE;
                    } else {
                        def.names = tcase.UPPER;
                    }
                } else if ('YMDdFWwXxHhmsf'.indexOf(def.component) !== -1) {
                    var integerPattern = def.presentation1;
                    if (def.presentation2) {
                        integerPattern += ';' + def.presentation2;
                    }
                    def.integerFormat = analyseIntegerPicture(integerPattern);
                    if (def.width && def.width.min !== undefined) {
                        if (def.integerFormat.mandatoryDigits < def.width.min) {
                            def.integerFormat.mandatoryDigits = def.width.min;
                        }
                    }
                    if (def.component === 'Y') {
                        // §9.8.4.4
                        def.n = -1;
                        if (def.width && def.width.max !== undefined) {
                            def.n = def.width.max;
                            def.integerFormat.mandatoryDigits = def.n;
                        } else {
                            var w = def.integerFormat.mandatoryDigits + def.integerFormat.optionalDigits;
                            if (w >= 2) {
                                def.n = w;
                            }
                        }
                    }
                }
                if (def.component === 'Z' || def.component === 'z') {
                    def.integerFormat = analyseIntegerPicture(def.presentation1);
                }
                spec.push(def);
                start = pos + 1;
            }
            pos++;
        }
        addLiteral(start, pos);
        return format;
    }

    const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const millisInADay = 1000 * 60 * 60 * 24;

    const startOfFirstWeek = function (ym) {
        // ISO 8601 defines the first week of the year to be the week that contains the first Thursday
        // XPath F&O extends this same definition for the first week of a month
        // the week starts on a Monday - calculate the millis for the start of the first week
        // millis for given 1st Jan of that year (at 00:00 UTC)
        const jan1 = Date.UTC(ym.year, ym.month);
        var dayOfJan1 = (new Date(jan1)).getUTCDay();
        if (dayOfJan1 === 0) {
            dayOfJan1 = 7;
        }
        // if Jan 1 is Fri, Sat or Sun, then add the number of days (in millis) to jan1 to get the start of week 1
        return dayOfJan1 > 4 ? jan1 + (8 - dayOfJan1) * millisInADay : jan1 - (dayOfJan1 - 1) * millisInADay;
    };

    const yearMonth = function (year, month) {
        return {
            year: year,
            month: month,
            nextMonth: function () {
                return (month === 11) ? yearMonth(year + 1, 0) : yearMonth(year, month + 1);
            },
            previousMonth: function () {
                return (month === 0) ? yearMonth(year - 1, 11) : yearMonth(year, month - 1);
            },
            nextYear: function () {
                return yearMonth(year + 1, month);
            },
            previousYear: function () {
                return yearMonth(year - 1, month);
            }
        };
    };

    const deltaWeeks = function (start, end) {
        return (end - start) / (millisInADay * 7) + 1;
    };

    const getDateTimeFragment = (date, component) => {
        let componentValue;
        switch (component) {
            case 'Y': // year
                componentValue = date.getUTCFullYear();
                break;
            case 'M': // month in year
                componentValue = date.getUTCMonth() + 1;
                break;
            case 'D': // day in month
                componentValue = date.getUTCDate();
                break;
            case 'd': { // day in year
                // millis for given date (at 00:00 UTC)
                const today = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
                // millis for given 1st Jan of that year (at 00:00 UTC)
                const firstJan = Date.UTC(date.getUTCFullYear(), 0);
                componentValue = (today - firstJan) / millisInADay + 1;
                break;
            }
            case 'F': // day of week
                componentValue = date.getUTCDay();
                if (componentValue === 0) {
                    // ISO 8601 defines days 1-7: Mon-Sun
                    componentValue = 7;
                }
                break;
            case 'W': { // week in year
                const thisYear = yearMonth(date.getUTCFullYear(), 0);
                const startOfWeek1 = startOfFirstWeek(thisYear);
                const today = Date.UTC(thisYear.year, date.getUTCMonth(), date.getUTCDate());
                let week = deltaWeeks(startOfWeek1, today);
                if (week > 52) {
                    // might be first week of the following year
                    const startOfFollowingYear = startOfFirstWeek(thisYear.nextYear());
                    if (today >= startOfFollowingYear) {
                        week = 1;
                    }
                } else if (week < 1) {
                    // must be end of the previous year
                    const startOfPreviousYear = startOfFirstWeek(thisYear.previousYear());
                    week = deltaWeeks(startOfPreviousYear, today);
                }
                componentValue = Math.floor(week);
                break;
            }
            case 'w': { // week in month
                const thisMonth = yearMonth(date.getUTCFullYear(), date.getUTCMonth());
                const startOfWeek1 = startOfFirstWeek(thisMonth);
                const today = Date.UTC(thisMonth.year, thisMonth.month, date.getUTCDate());
                let week = deltaWeeks(startOfWeek1, today);
                if (week > 4) {
                    // might be first week of the following month
                    const startOfFollowingMonth = startOfFirstWeek(thisMonth.nextMonth());
                    if (today >= startOfFollowingMonth) {
                        week = 1;
                    }
                } else if (week < 1) {
                    // must be end of the previous month
                    const startOfPreviousMonth = startOfFirstWeek(thisMonth.previousMonth());
                    week = deltaWeeks(startOfPreviousMonth, today);
                }
                componentValue = Math.floor(week);
                break;
            }
            case 'X': { // ISO week-numbering year
                // Extension: The F&O spec says nothing about how to access the year associated with the week-of-the-year
                // e.g. Sat 1 Jan 2005 is in the 53rd week of 2004.
                // The 'W' component specifier gives 53, but 'Y' will give 2005.
                // I propose to add 'X' as the component specifier to give the ISO week-numbering year (2004 in this example)
                const thisYear = yearMonth(date.getUTCFullYear(), 0);
                const startOfISOYear = startOfFirstWeek(thisYear);
                const endOfISOYear = startOfFirstWeek(thisYear.nextYear());
                const now = date.getTime();
                if (now < startOfISOYear) {
                    componentValue = thisYear.year - 1;
                } else if (now >= endOfISOYear) {
                    componentValue = thisYear.year + 1;
                } else {
                    componentValue = thisYear.year;
                }
                break;
            }
            case 'x': { // ISO week-numbering month
                // Extension: The F&O spec says nothing about how to access the month associated with the week-of-the-month
                // e.g. Sat 1 Jan 2005 is in the 5th week of December 2004.
                // The 'w' component specifier gives 5, but 'W' will give January and 'Y' will give 2005.
                // I propose to add 'x' as the component specifier to give the 'week-numbering' month (December in this example)
                const thisMonth = yearMonth(date.getUTCFullYear(), date.getUTCMonth());
                const startOfISOMonth = startOfFirstWeek(thisMonth);
                const nextMonth = thisMonth.nextMonth();
                const endOfISOMonth = startOfFirstWeek(nextMonth);
                const now = date.getTime();
                if (now < startOfISOMonth) {
                    componentValue = thisMonth.previousMonth().month + 1;
                } else if (now >= endOfISOMonth) {
                    componentValue = nextMonth.month + 1;
                } else {
                    componentValue = thisMonth.month + 1;
                }
                break;
            }
            case 'H': // hour in day (24 hours)
                componentValue = date.getUTCHours();
                break;
            case 'h': // hour in half-day (12 hours)
                componentValue = date.getUTCHours();
                componentValue = componentValue % 12;
                if (componentValue === 0) {
                    componentValue = 12;
                }
                break;
            case 'P': // am/pm marker
                componentValue = date.getUTCHours() >= 12 ? 'pm' : 'am';
                break;
            case 'm': // minute in hour
                componentValue = date.getUTCMinutes();
                break;
            case 's': // second in minute
                componentValue = date.getUTCSeconds();
                break;
            case 'f': // fractional seconds
                componentValue = date.getUTCMilliseconds();
                break;
            case 'Z': // timezone
            case 'z':
                // since the date object is constructed from epoch millis, the TZ component is always be UTC.
                break;
            case 'C': // calendar name
                componentValue = 'ISO';
                break;
            case 'E': // era
                componentValue = 'ISO';
                break;
        }
        return componentValue;
    };

    let iso8601Spec = null;

    /**
     * formats the date/time as specified by the XPath fn:format-dateTime function
     * @param {number} millis - the timestamp to be formatted, in millis since the epoch
     * @param {string} picture - the picture string that specifies the format
     * @param {string} timezone - the timezone to use
     * @returns {string} - the formatted timestamp
     */
    function formatDateTime(millis, picture, timezone) {
        var offsetHours = 0;
        var offsetMinutes = 0;

        if (typeof timezone !== 'undefined') {
            // parse the hour and minute offsets
            // assume for now the format supplied is +hhmm
            const offset = parseInt(timezone);
            offsetHours = Math.floor(offset / 100);
            offsetMinutes = offset % 100;
        }

        var formatComponent = function (date, markerSpec) {
            var componentValue = getDateTimeFragment(date, markerSpec.component);

            // §9.8.4.3 Formatting Integer-Valued Date/Time Components
            if ('YMDdFWwXxHhms'.indexOf(markerSpec.component) !== -1) {
                if (markerSpec.component === 'Y') {
                    // §9.8.4.4 Formatting the Year Component
                    if (markerSpec.n !== -1) {
                        componentValue = componentValue % Math.pow(10, markerSpec.n);
                    }
                }
                if (markerSpec.names) {
                    if (markerSpec.component === 'M' || markerSpec.component === 'x') {
                        componentValue = months[componentValue - 1];
                    } else if (markerSpec.component === 'F') {
                        componentValue = days[componentValue];
                    } else {
                        throw {
                            code: 'D3133',
                            value: markerSpec.component
                        };
                    }
                    if (markerSpec.names === tcase.UPPER) {
                        componentValue = componentValue.toUpperCase();
                    } else if (markerSpec.names === tcase.LOWER) {
                        componentValue = componentValue.toLowerCase();
                    }
                    if (markerSpec.width && componentValue.length > markerSpec.width.max) {
                        componentValue = componentValue.substring(0, markerSpec.width.max);
                    }
                } else {
                    componentValue = _formatInteger(componentValue, markerSpec.integerFormat);
                }
            } else if (markerSpec.component === 'f') {
                // TODO §9.8.4.5 Formatting Fractional Seconds
                componentValue = _formatInteger(componentValue, markerSpec.integerFormat);
            } else if (markerSpec.component === 'Z' || markerSpec.component === 'z') {
                // §9.8.4.6 Formatting timezones
                const offset = offsetHours * 100 + offsetMinutes;
                if (markerSpec.integerFormat.regular) {
                    componentValue = _formatInteger(offset, markerSpec.integerFormat);
                } else {
                    const numDigits = markerSpec.integerFormat.mandatoryDigits;
                    if (numDigits === 1 || numDigits === 2) {
                        componentValue = _formatInteger(offsetHours, markerSpec.integerFormat);
                        if (offsetMinutes !== 0) {
                            componentValue += ':' + formatInteger(offsetMinutes, '00');
                        }
                    } else if (numDigits === 3 || numDigits === 4) {
                        componentValue = _formatInteger(offset, markerSpec.integerFormat);
                    } else {
                        throw {
                            code: 'D3134',
                            value: numDigits
                        };
                    }
                }
                if (offset >= 0) {
                    componentValue = '+' + componentValue;
                }
                if (markerSpec.component === 'z') {
                    componentValue = 'GMT' + componentValue;
                }
                if (offset === 0 && markerSpec.presentation2 === 't') {
                    componentValue = 'Z';
                }
            }
            return componentValue;
        };

        let formatSpec;
        if(typeof picture === 'undefined') {
            // default to ISO 8601 format
            if (iso8601Spec === null) {
                iso8601Spec = analyseDateTimePicture('[Y0001]-[M01]-[D01]T[H01]:[m01]:[s01].[f001][Z01:01t]');
            }
            formatSpec = iso8601Spec;
        } else {
            formatSpec = analyseDateTimePicture(picture);
        }

        const offsetMillis = (60 * offsetHours + offsetMinutes) * 60 * 1000;
        const dateTime = new Date(millis + offsetMillis);

        let result = '';
        formatSpec.parts.forEach(function (part) {
            if (part.type === 'literal') {
                result += part.value;
            } else {
                result += formatComponent(dateTime, part);
            }
        });

        return result;
    }

    /**
     * Generate a regex to parse integers or timestamps
     * @param {object} formatSpec - object representing the format
     * @returns {object} - regex
     */
    function generateRegex(formatSpec) {
        var matcher = {};
        if (formatSpec.type === 'datetime') {
            matcher.type = 'datetime';
            matcher.parts = formatSpec.parts.map(function (part) {
                var res = {};
                if (part.type === 'literal') {
                    res.regex = part.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                } else if (part.integerFormat) {
                    res = generateRegex(part.integerFormat);
                } else {
                    // must be a month or day name
                    res.regex = '[a-zA-Z]+';
                    var lookup = {};
                    if (part.component === 'M' || part.component === 'x') {
                        // months
                        months.forEach(function (name, index) {
                            if (part.width && part.width.max) {
                                lookup[name.substring(0, part.width.max)] = index + 1;
                            } else {
                                lookup[name] = index + 1;
                            }
                        });
                    } else if (part.component === 'F') {
                        // days
                        days.forEach(function (name, index) {
                            if (index > 0) {
                                if (part.width && part.width.max) {
                                    lookup[name.substring(0, part.width.max)] = index;
                                } else {
                                    lookup[name] = index;
                                }
                            }
                        });
                    } else if (part.component === 'P') {
                        lookup = {'am': 0, 'AM': 0, 'pm': 1, 'PM': 1};
                    } else {
                        // unsupported 'name' option for this component
                        throw {
                            code: 'D3133',
                            value: part.component
                        };
                    }
                    res.parse = function (value) {
                        return lookup[value];
                    };
                }
                res.component = part.component;
                return res;
            });
        } else { // type === 'integer'
            matcher.type = 'integer';
            const isUpper = formatSpec.case === tcase.UPPER;
            switch (formatSpec.primary) {
                case formats.LETTERS:
                    matcher.regex = isUpper ? '[A-Z]+' : '[a-z]+';
                    matcher.parse = function (value) {
                        return lettersToDecimal(value, isUpper ? 'A' : 'a');
                    };
                    break;
                case formats.ROMAN:
                    matcher.regex = isUpper ? '[MDCLXVI]+' : '[mdclxvi]+';
                    matcher.parse = function (value) {
                        return romanToDecimal(isUpper ? value : value.toUpperCase());
                    };
                    break;
                case formats.WORDS:
                    matcher.regex = '(?:' + Object.keys(wordValues).concat('and', '[\\-, ]').join('|') + ')+';
                    matcher.parse = function (value) {
                        return wordsToNumber(value.toLowerCase());
                    };
                    break;
                case formats.DECIMAL:
                    matcher.regex = '[0-9]+';
                    if (formatSpec.ordinal) {
                        // ordinals
                        matcher.regex += '(?:th|st|nd|rd)';
                    }
                    matcher.parse = function (value) {
                        let digits = value;
                        if (formatSpec.ordinal) {
                            // strip off the suffix
                            digits = value.substring(0, value.length - 2);
                        }
                        // strip out the separators
                        if (formatSpec.regular) {
                            digits = digits.split(',').join('');
                        } else {
                            formatSpec.groupingSeparators.forEach(sep => {
                                digits = digits.split(sep.character).join('');
                            });
                        }
                        if (formatSpec.zeroCode !== 0x30) {
                            // apply offset
                            digits = digits.split('').map(char => String.fromCodePoint(char.codePointAt(0) - formatSpec.zeroCode + 0x30)).join('');
                        }
                        return parseInt(digits);
                    };
                    break;
                case formats.SEQUENCE:
                    throw {
                        code: 'D3130',
                        value: formatSpec.token
                    };
            }

        }
        return matcher;
    }

    /**
     * parse a string containing an integer as specified by the picture string
     * @param {string} value - the string to parse
     * @param {string} picture - the picture string
     * @returns {number} - the parsed number
     */
    function parseInteger(value, picture) {
        if (typeof value === 'undefined') {
            return undefined;
        }

        const formatSpec = analyseIntegerPicture(picture);
        const matchSpec = generateRegex(formatSpec);
        //const fullRegex = '^' + matchSpec.regex + '$';
        //const matcher = new RegExp(fullRegex);
        // TODO validate input based on the matcher regex
        const result = matchSpec.parse(value);
        return result;
    }

    /**
     * parse a string containing a timestamp as specified by the picture string
     * @param {string} timestamp - the string to parse
     * @param {string} picture - the picture string
     * @returns {number} - the parsed timestamp in millis since the epoch
     */
    function parseDateTime(timestamp, picture) {
        const formatSpec = analyseDateTimePicture(picture);
        const matchSpec = generateRegex(formatSpec);
        const fullRegex = '^' + matchSpec.parts.map(part => '(' + part.regex + ')').join('') + '$';

        const matcher = new RegExp(fullRegex, 'i'); // TODO can cache this against the picture
        var info = matcher.exec(timestamp);
        if (info !== null) {
            // validate what we've just parsed - do we have enough information to create a timestamp?
            // rules:
            // The date is specified by one of:
            //    {Y, M, D}    (dateA)
            // or {Y, d}       (dateB)
            // or {Y, x, w, F} (dateC)
            // or {X, W, F}    (dateD)
            // The time is specified by one of:
            //    {H, m, s, f}    (timeA)
            // or {P, h, m, s, f} (timeB)
            // All sets can have an optional Z
            // To create a timestamp (epoch millis) we need both date and time, but we can default missing
            // information according to the following rules:
            // - line up one combination of the above from date, and one from time, most significant value (MSV) to least significant (LSV
            // - for the values that have been captured, if there are any gaps between MSV and LSV, then throw an error
            //     (e.g.) if hour and seconds, but not minutes is given - throw
            //     (e.g.) if month, hour and minutes, but not day-of-month is given - throw
            // - anything right of the LSV should be defaulted to zero
            //     (e.g.) if hour and minutes given, default seconds and fractional seconds to zero
            //     (e.g.) if date only given, default the time to 0:00:00.000 (midnight)
            // - anything left of the MSV should be defaulted to the value of that component returned by $now()
            //     (e.g.) if time only given, default the date to today
            //     (e.g.) if month and date given, default to this year (and midnight, by previous rule)
            //   -- default values for X, x, W, w, F will be derived from the values returned by $now()

            // implement the above rules
            // determine which of the above date/time combinations we have by using bit masks

            //        Y X M x W w d D F P H h m s f Z
            // dateA  1 0 1 0 0 0 0 1 ?                     0 - must not appear
            // dateB  1 0 0 0 0 0 1 0 ?                     1 - can appear - relevant
            // dateC  0 1 0 1 0 1 0 0 1                     ? - can appear - ignored
            // dateD  0 1 0 0 1 0 0 0 1
            // timeA                    0 1 0 1 1 1
            // timeB                    1 0 1 1 1 1

            // create bitmasks based on the above
            //    date mask             YXMxWwdD
            const dmA = 161;  // binary 10100001
            const dmB = 130;  // binary 10000010
            const dmC = 84;   // binary 01010100
            const dmD = 72;   // binary 01001000
            //    time mask             PHhmsf
            const tmA = 23;   // binary 010111
            const tmB = 47;   // binary 101111

            const components = {};
            for (let i = 1; i < info.length; i++) {
                const mpart = matchSpec.parts[i - 1];
                if (mpart.parse) {
                    components[mpart.component] = mpart.parse(info[i]);
                }
            }

            if(Object.getOwnPropertyNames(components).length === 0) {
                // nothing specified
                return undefined;
            }

            let mask = 0;

            const shift = bit => {
                mask <<= 1;
                mask += bit ? 1 : 0;
            };

            const isType = type => {
                // shouldn't match any 0's, must match at least one 1
                return !(~type & mask) && !!(type & mask);
            };

            'YXMxWwdD'.split('').forEach(part => shift(components[part]));

            const dateA = isType(dmA);
            const dateB = !dateA && isType(dmB);
            const dateC = isType(dmC);
            const dateD = !dateC && isType(dmD);

            mask = 0;
            'PHhmsf'.split('').forEach(part => shift(components[part]));

            const timeA = isType(tmA);
            const timeB = !timeA && isType(tmB);

            // should only be zero or one date type and zero or one time type

            const dateComps = dateB ? 'YD' : dateC ? 'XxwF' : dateD? 'XWF' : 'YMD';
            const timeComps = timeB ? 'Phmsf' : 'Hmsf';

            const comps = dateComps + timeComps;

            // step through the candidate parts from most significant to least significant
            // default the most significant unspecified parts to current timestamp component
            // default the least significant unspecified parts to zero
            // if any gaps in between the specified parts, throw an error

            const now = this.environment.timestamp; // must get the fixed timestamp from jsonata

            let startSpecified = false;
            let endSpecified = false;
            comps.split('').forEach(part => {
                if(typeof components[part] === 'undefined') {
                    if(startSpecified) {
                        // past the specified block - default to zero
                        components[part] = ('MDd'.indexOf(part) !== -1) ? 1 : 0;
                        endSpecified = true;
                    } else {
                        // haven't hit the specified block yet, default to current timestamp
                        components[part] = getDateTimeFragment(now, part);
                    }
                } else {
                    startSpecified = true;
                    if(endSpecified) {
                        throw {
                            code: 'D3136'
                        };
                    }
                }
            });

            // validate and fill in components
            if (components.M > 0) {
                components.M -= 1;  // Date.UTC requires a zero-indexed month
            } else {
                components.M = 0; // default to January
            }
            if (dateB) {
                // millis for given 1st Jan of that year (at 00:00 UTC)
                const firstJan = Date.UTC(components.Y, 0);
                const offsetMillis = (components.d - 1) * 1000 * 60 * 60 * 24;
                const derivedDate = new Date(firstJan + offsetMillis);
                components.M = derivedDate.getUTCMonth();
                components.D = derivedDate.getUTCDate();
            }
            if (dateC) {
                // TODO implement this
                // parsing this format not currently supported
                throw {
                    code: 'D3136'
                };
            }
            if (dateD) {
                // TODO implement this
                // parsing this format (ISO week date) not currently supported
                throw {
                    code: 'D3136'
                };
            }
            if (timeB) {
                // 12hr to 24hr
                components.H = components.h === 12 ? 0 : components.h;
                if (components.P === 1) {
                    components.H += 12;
                }
            }

            var millis = Date.UTC(components.Y, components.M, components.D, components.H, components.m, components.s, components.f);
            return millis;
        }
    }

    // Regular expression to match an ISO 8601 formatted timestamp
    var iso8601regex = new RegExp('^\\d{4}(-[01]\\d)*(-[0-3]\\d)*(T[0-2]\\d:[0-5]\\d:[0-5]\\d)*(\\.\\d+)?([+-][0-2]\\d:?[0-5]\\d|Z)?$');

    /**
     * Converts an ISO 8601 timestamp to milliseconds since the epoch
     *
     * @param {string} timestamp - the timestamp to be converted
     * @param {string} [picture] - the picture string defining the format of the timestamp (defaults to ISO 8601)
     * @returns {Number} - milliseconds since the epoch
     */
    function toMillis(timestamp, picture) {
        // undefined inputs always return undefined
        if(typeof timestamp === 'undefined') {
            return undefined;
        }

        if(typeof picture === 'undefined') {
            if (!iso8601regex.test(timestamp)) {
                throw {
                    stack: (new Error()).stack,
                    code: "D3110",
                    value: timestamp
                };
            }

            return Date.parse(timestamp);
        } else {
            return parseDateTime.call(this, timestamp, picture);
        }
    }

    /**
     * Converts milliseconds since the epoch to an ISO 8601 timestamp
     * @param {Number} millis - milliseconds since the epoch to be converted
     * @param {string} [picture] - the picture string defining the format of the timestamp (defaults to ISO 8601)
     * @param {string} [timezone] - the timezone to format the timestamp in (defaults to UTC)
     * @returns {String} - the formatted timestamp
     */
    function fromMillis(millis, picture, timezone) {
        // undefined inputs always return undefined
        if(typeof millis === 'undefined') {
            return undefined;
        }

        return formatDateTime.call(this, millis, picture, timezone);
    }

    return {
        formatInteger, parseInteger, fromMillis, toMillis
    };
})();

module.exports = dateTime;

},{"./utils":6}],2:[function(require,module,exports){
(function (global){
/**
 * © Copyright IBM Corp. 2016, 2018 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

var utils = require('./utils');

const functions = (() => {
    'use strict';

    var isNumeric = utils.isNumeric;
    var isArrayOfStrings = utils.isArrayOfStrings;
    var isArrayOfNumbers = utils.isArrayOfNumbers;
    var createSequence = utils.createSequence;
    var isSequence = utils.isSequence;
    var isFunction = utils.isFunction;
    var isLambda = utils.isLambda;
    var isIterable = utils.isIterable;
    var getFunctionArity = utils.getFunctionArity;
    var deepEquals = utils.isDeepEqual;
    var stringToArray = utils.stringToArray;

    /**
     * Sum function
     * @param {Object} args - Arguments
     * @returns {number} Total value of arguments
     */
    function sum(args) {
        // undefined inputs always return undefined
        if (typeof args === 'undefined') {
            return undefined;
        }

        var total = 0;
        args.forEach(function (num) {
            total += num;
        });
        return total;
    }

    /**
     * Count function
     * @param {Object} args - Arguments
     * @returns {number} Number of elements in the array
     */
    function count(args) {
        // undefined inputs always return undefined
        if (typeof args === 'undefined') {
            return 0;
        }

        return args.length;
    }

    /**
     * Max function
     * @param {Object} args - Arguments
     * @returns {number} Max element in the array
     */
    function max(args) {
        // undefined inputs always return undefined
        if (typeof args === 'undefined' || args.length === 0) {
            return undefined;
        }

        return Math.max.apply(Math, args);
    }

    /**
     * Min function
     * @param {Object} args - Arguments
     * @returns {number} Min element in the array
     */
    function min(args) {
        // undefined inputs always return undefined
        if (typeof args === 'undefined' || args.length === 0) {
            return undefined;
        }

        return Math.min.apply(Math, args);
    }

    /**
     * Average function
     * @param {Object} args - Arguments
     * @returns {number} Average element in the array
     */
    function average(args) {
        // undefined inputs always return undefined
        if (typeof args === 'undefined' || args.length === 0) {
            return undefined;
        }

        var total = 0;
        args.forEach(function (num) {
            total += num;
        });
        return total / args.length;
    }

    /**
     * Stringify arguments
     * @param {Object} arg - Arguments
     * @param {boolean} [prettify] - Pretty print the result
     * @returns {String} String from arguments
     */
    function string(arg, prettify = false) {
        // undefined inputs always return undefined
        if (typeof arg === 'undefined') {
            return undefined;
        }

        var str;

        if (typeof arg === 'string') {
            // already a string
            str = arg;
        } else if (isFunction(arg)) {
            // functions (built-in and lambda convert to empty string
            str = '';
        } else if (typeof arg === 'number' && !isFinite(arg)) {
            throw {
                code: "D3001",
                value: arg,
                stack: (new Error()).stack
            };
        } else {
            var space = prettify ? 2 : 0;
            if(Array.isArray(arg) && arg.outerWrapper) {
                arg = arg[0];
            }
            str = JSON.stringify(arg, function (key, val) {
                return (typeof val !== 'undefined' && val !== null && val.toPrecision && isNumeric(val)) ? Number(val.toPrecision(15)) :
                    (val && isFunction(val)) ? '' : val;
            }, space);
        }
        return str;
    }

    /**
     * Create substring based on character number and length
     * @param {String} str - String to evaluate
     * @param {Integer} start - Character number to start substring
     * @param {Integer} [length] - Number of characters in substring
     * @returns {string|*} Substring
     */
    function substring(str, start, length) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }

        var strArray = stringToArray(str);
        var strLength = strArray.length;

        if (strLength + start < 0) {
            start = 0;
        }

        if (typeof length !== 'undefined') {
            if (length <= 0) {
                return '';
            }
            var end = start >= 0 ? start + length : strLength + start + length;
            return strArray.slice(start, end).join('');
        }

        return strArray.slice(start).join('');
    }

    /**
     * Create substring up until a character
     * @param {String} str - String to evaluate
     * @param {String} chars - Character to define substring boundary
     * @returns {*} Substring
     */
    function substringBefore(str, chars) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }

        var pos = str.indexOf(chars);
        if (pos > -1) {
            return str.substr(0, pos);
        } else {
            return str;
        }
    }

    /**
     * Create substring after a character
     * @param {String} str - String to evaluate
     * @param {String} chars - Character to define substring boundary
     * @returns {*} Substring
     */
    function substringAfter(str, chars) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }

        var pos = str.indexOf(chars);
        if (pos > -1) {
            return str.substr(pos + chars.length);
        } else {
            return str;
        }
    }

    /**
     * Lowercase a string
     * @param {String} str - String to evaluate
     * @returns {string} Lowercase string
     */
    function lowercase(str) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }

        return str.toLowerCase();
    }

    /**
     * Uppercase a string
     * @param {String} str - String to evaluate
     * @returns {string} Uppercase string
     */
    function uppercase(str) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }

        return str.toUpperCase();
    }

    /**
     * length of a string
     * @param {String} str - string
     * @returns {Number} The number of characters in the string
     */
    function length(str) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }

        return stringToArray(str).length;
    }

    /**
     * Normalize and trim whitespace within a string
     * @param {string} str - string to be trimmed
     * @returns {string} - trimmed string
     */
    function trim(str) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }

        // normalize whitespace
        var result = str.replace(/[ \t\n\r]+/gm, ' ');
        if (result.charAt(0) === ' ') {
            // strip leading space
            result = result.substring(1);
        }
        if (result.charAt(result.length - 1) === ' ') {
            // strip trailing space
            result = result.substring(0, result.length - 1);
        }
        return result;
    }

    /**
     * Pad a string to a minimum width by adding characters to the start or end
     * @param {string} str - string to be padded
     * @param {number} width - the minimum width; +ve pads to the right, -ve pads to the left
     * @param {string} [char] - the pad character(s); defaults to ' '
     * @returns {string} - padded string
     */
    function pad(str, width, char) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }

        if (typeof char === 'undefined' || char.length === 0) {
            char = ' ';
        }

        var result;
        var padLength = Math.abs(width) - length(str);
        if (padLength > 0) {
            var padding = (new Array(padLength + 1)).join(char);
            if (char.length > 1) {
                padding = substring(padding, 0, padLength);
            }
            if (width > 0) {
                result = str + padding;
            } else {
                result = padding + str;
            }
        } else {
            result = str;
        }
        return result;
    }

    /**
     * Evaluate the matcher function against the str arg
     *
     * @param {*} matcher - matching function (native or lambda)
     * @param {string} str - the string to match against
     * @returns {object} - structure that represents the match(es)
     */
    function* evaluateMatcher(matcher, str) {
        var result = matcher.apply(this, [str]); // eslint-disable-line no-useless-call
        if(isIterable(result)) {
            result = yield * result;
        }
        if(result && !(typeof result.start === 'number' || result.end === 'number' || Array.isArray(result.groups) || isFunction(result.next))) {
            // the matcher function didn't return the correct structure
            throw {
                code: "T1010",
                stack: (new Error()).stack,
            };
        }
        return result;
    }

    /**
     * Tests if the str contains the token
     * @param {String} str - string to test
     * @param {String} token - substring or regex to find
     * @returns {Boolean} - true if str contains token
     */
    function* contains(str, token) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }

        var result;

        if (typeof token === 'string') {
            result = (str.indexOf(token) !== -1);
        } else {
            var matches = yield* evaluateMatcher(token, str);
            result = (typeof matches !== 'undefined');
        }

        return result;
    }

    /**
     * Match a string with a regex returning an array of object containing details of each match
     * @param {String} str - string
     * @param {String} regex - the regex applied to the string
     * @param {Integer} [limit] - max number of matches to return
     * @returns {Array} The array of match objects
     */
    function* match(str, regex, limit) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }

        // limit, if specified, must be a non-negative number
        if (limit < 0) {
            throw {
                stack: (new Error()).stack,
                value: limit,
                code: 'D3040',
                index: 3
            };
        }

        var result = createSequence();

        if (typeof limit === 'undefined' || limit > 0) {
            var count = 0;
            var matches = yield* evaluateMatcher(regex, str);
            if (typeof matches !== 'undefined') {
                while (typeof matches !== 'undefined' && (typeof limit === 'undefined' || count < limit)) {
                    result.push({
                        match: matches.match,
                        index: matches.start,
                        groups: matches.groups
                    });
                    matches = yield* evaluateMatcher(matches.next);
                    count++;
                }
            }
        }

        return result;
    }

    /**
     * Match a string with a regex returning an array of object containing details of each match
     * @param {String} str - string
     * @param {String} pattern - the substring/regex applied to the string
     * @param {String} replacement - text to replace the matched substrings
     * @param {Integer} [limit] - max number of matches to return
     * @returns {Array} The array of match objects
     */
    function* replace(str, pattern, replacement, limit) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }

        var self = this;

        // pattern cannot be an empty string
        if (pattern === '') {
            throw {
                code: "D3010",
                stack: (new Error()).stack,
                value: pattern,
                index: 2
            };
        }

        // limit, if specified, must be a non-negative number
        if (limit < 0) {
            throw {
                code: "D3011",
                stack: (new Error()).stack,
                value: limit,
                index: 4
            };
        }

        var replacer;
        if (typeof replacement === 'string') {
            replacer = function (regexMatch) {
                var substitute = '';
                // scan forward, copying the replacement text into the substitute string
                // and replace any occurrence of $n with the values matched by the regex
                var position = 0;
                var index = replacement.indexOf('$', position);
                while (index !== -1 && position < replacement.length) {
                    substitute += replacement.substring(position, index);
                    position = index + 1;
                    var dollarVal = replacement.charAt(position);
                    if (dollarVal === '$') {
                        // literal $
                        substitute += '$';
                        position++;
                    } else if (dollarVal === '0') {
                        substitute += regexMatch.match;
                        position++;
                    } else {
                        var maxDigits;
                        if (regexMatch.groups.length === 0) {
                            // no sub-matches; any $ followed by a digit will be replaced by an empty string
                            maxDigits = 1;
                        } else {
                            // max number of digits to parse following the $
                            maxDigits = Math.floor(Math.log(regexMatch.groups.length) * Math.LOG10E) + 1;
                        }
                        index = parseInt(replacement.substring(position, position + maxDigits), 10);
                        if (maxDigits > 1 && index > regexMatch.groups.length) {
                            index = parseInt(replacement.substring(position, position + maxDigits - 1), 10);
                        }
                        if (!isNaN(index)) {
                            if (regexMatch.groups.length > 0) {
                                var submatch = regexMatch.groups[index - 1];
                                if (typeof submatch !== 'undefined') {
                                    substitute += submatch;
                                }
                            }
                            position += index.toString().length;
                        } else {
                            // not a capture group, treat the $ as literal
                            substitute += '$';
                        }
                    }
                    index = replacement.indexOf('$', position);
                }
                substitute += replacement.substring(position);
                return substitute;
            };
        } else {
            replacer = replacement;
        }

        var result = '';
        var position = 0;

        if (typeof limit === 'undefined' || limit > 0) {
            var count = 0;
            if (typeof pattern === 'string') {
                var index = str.indexOf(pattern, position);
                while (index !== -1 && (typeof limit === 'undefined' || count < limit)) {
                    result += str.substring(position, index);
                    result += replacement;
                    position = index + pattern.length;
                    count++;
                    index = str.indexOf(pattern, position);
                }
                result += str.substring(position);
            } else {
                var matches = yield* evaluateMatcher(pattern, str);
                if (typeof matches !== 'undefined') {
                    while (typeof matches !== 'undefined' && (typeof limit === 'undefined' || count < limit)) {
                        result += str.substring(position, matches.start);
                        var replacedWith = replacer.apply(self, [matches]);
                        if (isIterable(replacedWith)) {
                            replacedWith = yield* replacedWith;
                        }
                        // check replacedWith is a string
                        if (typeof replacedWith === 'string') {
                            result += replacedWith;
                        } else {
                            // not a string - throw error
                            throw {
                                code: "D3012",
                                stack: (new Error()).stack,
                                value: replacedWith
                            };
                        }
                        position = matches.start + matches.match.length;
                        count++;
                        matches = yield* evaluateMatcher(matches.next);
                    }
                    result += str.substring(position);
                } else {
                    result = str;
                }
            }
        } else {
            result = str;
        }

        return result;
    }

    /**
     * Base64 encode a string
     * @param {String} str - string
     * @returns {String} Base 64 encoding of the binary data
     */
    function base64encode(str) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }
        // Use btoa in a browser, or Buffer in Node.js

        var btoa = typeof window !== 'undefined' ?
            /* istanbul ignore next */ window.btoa :
            function (str) {
                // Simply doing `new Buffer` at this point causes Browserify to pull
                // in the entire Buffer browser library, which is large and unnecessary.
                // Using `global.Buffer` defeats this.
                return new global.Buffer.from(str, 'binary').toString('base64'); // eslint-disable-line new-cap
            };
        return btoa(str);
    }

    /**
     * Base64 decode a string
     * @param {String} str - string
     * @returns {String} Base 64 encoding of the binary data
     */
    function base64decode(str) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }
        // Use btoa in a browser, or Buffer in Node.js
        var atob = typeof window !== 'undefined' ?
            /* istanbul ignore next */ window.atob :
            function (str) {
                // Simply doing `new Buffer` at this point causes Browserify to pull
                // in the entire Buffer browser library, which is large and unnecessary.
                // Using `global.Buffer` defeats this.
                return new global.Buffer(str, 'base64').toString('binary');
            };
        return atob(str);
    }

    /**
     * Encode a string into a component for a url
     * @param {String} str - String to encode
     * @returns {string} Encoded string
     */
    function encodeUrlComponent(str) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }

        // Catch URIErrors when URI sequence is malformed
        var returnVal;
        try {
            returnVal = encodeURIComponent(str);
        } catch (e) {
            throw {
                code: "D3140",
                stack: (new Error()).stack,
                value: str,
                functionName: "encodeUrlComponent"
            };
        }
        return returnVal;
    }

    /**
     * Encode a string into a url
     * @param {String} str - String to encode
     * @returns {string} Encoded string
     */
    function encodeUrl(str) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }

        // Catch URIErrors when URI sequence is malformed
        var returnVal;
        try {
            returnVal = encodeURI(str);
        } catch (e) {
            throw {
                code: "D3140",
                stack: (new Error()).stack,
                value: str,
                functionName: "encodeUrl"
            };
        }
        return returnVal;
    }

    /**
     * Decode a string from a component for a url
     * @param {String} str - String to decode
     * @returns {string} Decoded string
     */
    function decodeUrlComponent(str) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }

        // Catch URIErrors when URI sequence is malformed
        var returnVal;
        try {
            returnVal = decodeURIComponent(str);
        } catch (e) {
            throw {
                code: "D3140",
                stack: (new Error()).stack,
                value: str,
                functionName: "decodeUrlComponent"
            };
        }
        return returnVal;
    }

    /**
     * Decode a string from a url
     * @param {String} str - String to decode
     * @returns {string} Decoded string
     */
    function decodeUrl(str) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }

        // Catch URIErrors when URI sequence is malformed
        var returnVal;
        try {
            returnVal = decodeURI(str);
        } catch (e) {
            throw {
                code: "D3140",
                stack: (new Error()).stack,
                value: str,
                functionName: "decodeUrl"
            };
        }
        return returnVal;
    }

    /**
     * Split a string into an array of substrings
     * @param {String} str - string
     * @param {String} separator - the token or regex that splits the string
     * @param {Integer} [limit] - max number of substrings
     * @returns {Array} The array of string
     */
    function* split(str, separator, limit) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }

        // limit, if specified, must be a non-negative number
        if (limit < 0) {
            throw {
                code: "D3020",
                stack: (new Error()).stack,
                value: limit,
                index: 3
            };
        }

        var result = [];

        if (typeof limit === 'undefined' || limit > 0) {
            if (typeof separator === 'string') {
                result = str.split(separator, limit);
            } else {
                var count = 0;
                var matches = yield* evaluateMatcher(separator, str);
                if (typeof matches !== 'undefined') {
                    var start = 0;
                    while (typeof matches !== 'undefined' && (typeof limit === 'undefined' || count < limit)) {
                        result.push(str.substring(start, matches.start));
                        start = matches.end;
                        matches = yield* evaluateMatcher(matches.next);
                        count++;
                    }
                    if (typeof limit === 'undefined' || count < limit) {
                        result.push(str.substring(start));
                    }
                } else {
                    result.push(str);
                }
            }
        }

        return result;
    }

    /**
     * Join an array of strings
     * @param {Array} strs - array of string
     * @param {String} [separator] - the token that splits the string
     * @returns {String} The concatenated string
     */
    function join(strs, separator) {
        // undefined inputs always return undefined
        if (typeof strs === 'undefined') {
            return undefined;
        }

        // if separator is not specified, default to empty string
        if (typeof separator === 'undefined') {
            separator = "";
        }

        return strs.join(separator);
    }

    /**
     * Formats a number into a decimal string representation using XPath 3.1 F&O fn:format-number spec
     * @param {number} value - number to format
     * @param {String} picture - picture string definition
     * @param {Object} [options] - override locale defaults
     * @returns {String} The formatted string
     */
    function formatNumber(value, picture, options) {
        // undefined inputs always return undefined
        if (typeof value === 'undefined') {
            return undefined;
        }

        var defaults = {
            "decimal-separator": ".",
            "grouping-separator": ",",
            "exponent-separator": "e",
            "infinity": "Infinity",
            "minus-sign": "-",
            "NaN": "NaN",
            "percent": "%",
            "per-mille": "\u2030",
            "zero-digit": "0",
            "digit": "#",
            "pattern-separator": ";"
        };

        // if `options` is specified, then its entries override defaults
        var properties = defaults;
        if (typeof options !== 'undefined') {
            Object.keys(options).forEach(function (key) {
                properties[key] = options[key];
            });
        }

        var decimalDigitFamily = [];
        var zeroCharCode = properties['zero-digit'].charCodeAt(0);
        for (var ii = zeroCharCode; ii < zeroCharCode + 10; ii++) {
            decimalDigitFamily.push(String.fromCharCode(ii));
        }

        var activeChars = decimalDigitFamily.concat([properties['decimal-separator'], properties['exponent-separator'], properties['grouping-separator'], properties.digit, properties['pattern-separator']]);

        var subPictures = picture.split(properties['pattern-separator']);

        if (subPictures.length > 2) {
            throw {
                code: 'D3080',
                stack: (new Error()).stack
            };
        }

        var splitParts = function (subpicture) {
            var prefix = (function () {
                var ch;
                for (var ii = 0; ii < subpicture.length; ii++) {
                    ch = subpicture.charAt(ii);
                    if (activeChars.indexOf(ch) !== -1 && ch !== properties['exponent-separator']) {
                        return subpicture.substring(0, ii);
                    }
                }
            })();
            var suffix = (function () {
                var ch;
                for (var ii = subpicture.length - 1; ii >= 0; ii--) {
                    ch = subpicture.charAt(ii);
                    if (activeChars.indexOf(ch) !== -1 && ch !== properties['exponent-separator']) {
                        return subpicture.substring(ii + 1);
                    }
                }
            })();
            var activePart = subpicture.substring(prefix.length, subpicture.length - suffix.length);
            var mantissaPart, exponentPart, integerPart, fractionalPart;
            var exponentPosition = subpicture.indexOf(properties['exponent-separator'], prefix.length);
            if (exponentPosition === -1 || exponentPosition > subpicture.length - suffix.length) {
                mantissaPart = activePart;
                exponentPart = undefined;
            } else {
                mantissaPart = activePart.substring(0, exponentPosition);
                exponentPart = activePart.substring(exponentPosition + 1);
            }
            var decimalPosition = mantissaPart.indexOf(properties['decimal-separator']);
            if (decimalPosition === -1) {
                integerPart = mantissaPart;
                fractionalPart = suffix;
            } else {
                integerPart = mantissaPart.substring(0, decimalPosition);
                fractionalPart = mantissaPart.substring(decimalPosition + 1);
            }
            return {
                prefix: prefix,
                suffix: suffix,
                activePart: activePart,
                mantissaPart: mantissaPart,
                exponentPart: exponentPart,
                integerPart: integerPart,
                fractionalPart: fractionalPart,
                subpicture: subpicture
            };
        };

        // validate the picture string, F&O 4.7.3
        var validate = function (parts) {
            var error;
            var ii;
            var subpicture = parts.subpicture;
            var decimalPos = subpicture.indexOf(properties['decimal-separator']);
            if (decimalPos !== subpicture.lastIndexOf(properties['decimal-separator'])) {
                error = 'D3081';
            }
            if (subpicture.indexOf(properties.percent) !== subpicture.lastIndexOf(properties.percent)) {
                error = 'D3082';
            }
            if (subpicture.indexOf(properties['per-mille']) !== subpicture.lastIndexOf(properties['per-mille'])) {
                error = 'D3083';
            }
            if (subpicture.indexOf(properties.percent) !== -1 && subpicture.indexOf(properties['per-mille']) !== -1) {
                error = 'D3084';
            }
            var valid = false;
            for (ii = 0; ii < parts.mantissaPart.length; ii++) {
                var ch = parts.mantissaPart.charAt(ii);
                if (decimalDigitFamily.indexOf(ch) !== -1 || ch === properties.digit) {
                    valid = true;
                    break;
                }
            }
            if (!valid) {
                error = 'D3085';
            }
            var charTypes = parts.activePart.split('').map(function (char) {
                return activeChars.indexOf(char) === -1 ? 'p' : 'a';
            }).join('');
            if (charTypes.indexOf('p') !== -1) {
                error = 'D3086';
            }
            if (decimalPos !== -1) {
                if (subpicture.charAt(decimalPos - 1) === properties['grouping-separator'] || subpicture.charAt(decimalPos + 1) === properties['grouping-separator']) {
                    error = 'D3087';
                }
            } else if (parts.integerPart.charAt(parts.integerPart.length - 1) === properties['grouping-separator']) {
                error = 'D3088';
            }
            if (subpicture.indexOf(properties['grouping-separator'] + properties['grouping-separator']) !== -1) {
                error = 'D3089';
            }
            var optionalDigitPos = parts.integerPart.indexOf(properties.digit);
            if (optionalDigitPos !== -1 && parts.integerPart.substring(0, optionalDigitPos).split('').filter(function (char) {
                return decimalDigitFamily.indexOf(char) > -1;
            }).length > 0) {
                error = 'D3090';
            }
            optionalDigitPos = parts.fractionalPart.lastIndexOf(properties.digit);
            if (optionalDigitPos !== -1 && parts.fractionalPart.substring(optionalDigitPos).split('').filter(function (char) {
                return decimalDigitFamily.indexOf(char) > -1;
            }).length > 0) {
                error = 'D3091';
            }
            var exponentExists = (typeof parts.exponentPart === 'string');
            if (exponentExists && parts.exponentPart.length > 0 && (subpicture.indexOf(properties.percent) !== -1 || subpicture.indexOf(properties['per-mille']) !== -1)) {
                error = 'D3092';
            }
            if (exponentExists && (parts.exponentPart.length === 0 || parts.exponentPart.split('').filter(function (char) {
                return decimalDigitFamily.indexOf(char) === -1;
            }).length > 0)) {
                error = 'D3093';
            }
            if (error) {
                throw {
                    code: error,
                    stack: (new Error()).stack
                };
            }
        };

        // analyse the picture string, F&O 4.7.4
        var analyse = function (parts) {
            var getGroupingPositions = function (part, toLeft) {
                var positions = [];
                var groupingPosition = part.indexOf(properties['grouping-separator']);
                while (groupingPosition !== -1) {
                    var charsToTheRight = (toLeft ? part.substring(0, groupingPosition) : part.substring(groupingPosition)).split('').filter(function (char) {
                        return decimalDigitFamily.indexOf(char) !== -1 || char === properties.digit;
                    }).length;
                    positions.push(charsToTheRight);
                    groupingPosition = parts.integerPart.indexOf(properties['grouping-separator'], groupingPosition + 1);
                }
                return positions;
            };
            var integerPartGroupingPositions = getGroupingPositions(parts.integerPart);
            var regular = function (indexes) {
                // are the grouping positions regular? i.e. same interval between each of them
                if (indexes.length === 0) {
                    return 0;
                }
                var gcd = function (a, b) {
                    return b === 0 ? a : gcd(b, a % b);
                };
                // find the greatest common divisor of all the positions
                var factor = indexes.reduce(gcd);
                // is every position separated by this divisor? If so, it's regular
                for (var index = 1; index <= indexes.length; index++) {
                    if (indexes.indexOf(index * factor) === -1) {
                        return 0;
                    }
                }
                return factor;
            };

            var regularGrouping = regular(integerPartGroupingPositions);
            var fractionalPartGroupingPositions = getGroupingPositions(parts.fractionalPart, true);

            var minimumIntegerPartSize = parts.integerPart.split('').filter(function (char) {
                return decimalDigitFamily.indexOf(char) !== -1;
            }).length;
            var scalingFactor = minimumIntegerPartSize;

            var fractionalPartArray = parts.fractionalPart.split('');
            var minimumFactionalPartSize = fractionalPartArray.filter(function (char) {
                return decimalDigitFamily.indexOf(char) !== -1;
            }).length;
            var maximumFactionalPartSize = fractionalPartArray.filter(function (char) {
                return decimalDigitFamily.indexOf(char) !== -1 || char === properties.digit;
            }).length;
            var exponentPresent = typeof parts.exponentPart === 'string';
            if (minimumIntegerPartSize === 0 && maximumFactionalPartSize === 0) {
                if (exponentPresent) {
                    minimumFactionalPartSize = 1;
                    maximumFactionalPartSize = 1;
                } else {
                    minimumIntegerPartSize = 1;
                }
            }
            if (exponentPresent && minimumIntegerPartSize === 0 && parts.integerPart.indexOf(properties.digit) !== -1) {
                minimumIntegerPartSize = 1;
            }
            if (minimumIntegerPartSize === 0 && minimumFactionalPartSize === 0) {
                minimumFactionalPartSize = 1;
            }
            var minimumExponentSize = 0;
            if (exponentPresent) {
                minimumExponentSize = parts.exponentPart.split('').filter(function (char) {
                    return decimalDigitFamily.indexOf(char) !== -1;
                }).length;
            }

            return {
                integerPartGroupingPositions: integerPartGroupingPositions,
                regularGrouping: regularGrouping,
                minimumIntegerPartSize: minimumIntegerPartSize,
                scalingFactor: scalingFactor,
                prefix: parts.prefix,
                fractionalPartGroupingPositions: fractionalPartGroupingPositions,
                minimumFactionalPartSize: minimumFactionalPartSize,
                maximumFactionalPartSize: maximumFactionalPartSize,
                minimumExponentSize: minimumExponentSize,
                suffix: parts.suffix,
                picture: parts.subpicture
            };
        };

        var parts = subPictures.map(splitParts);
        parts.forEach(validate);

        var variables = parts.map(analyse);

        var minus_sign = properties['minus-sign'];
        var zero_digit = properties['zero-digit'];
        var decimal_separator = properties['decimal-separator'];
        var grouping_separator = properties['grouping-separator'];

        if (variables.length === 1) {
            variables.push(JSON.parse(JSON.stringify(variables[0])));
            variables[1].prefix = minus_sign + variables[1].prefix;
        }

        // TODO cache the result of the analysis

        // format the number
        // bullet 1: TODO: NaN - not sure we'd ever get this in JSON
        var pic;
        // bullet 2:
        if (value >= 0) {
            pic = variables[0];
        } else {
            pic = variables[1];
        }
        var adjustedNumber;
        // bullet 3:
        if (pic.picture.indexOf(properties.percent) !== -1) {
            adjustedNumber = value * 100;
        } else if (pic.picture.indexOf(properties['per-mille']) !== -1) {
            adjustedNumber = value * 1000;
        } else {
            adjustedNumber = value;
        }
        // bullet 4:
        // TODO: infinity - not sure we'd ever get this in JSON
        // bullet 5:
        var mantissa, exponent;
        if (pic.minimumExponentSize === 0) {
            mantissa = adjustedNumber;
        } else {
            // mantissa * 10^exponent = adjustedNumber
            var maxMantissa = Math.pow(10, pic.scalingFactor);
            var minMantissa = Math.pow(10, pic.scalingFactor - 1);
            mantissa = adjustedNumber;
            exponent = 0;
            while (mantissa < minMantissa) {
                mantissa *= 10;
                exponent -= 1;
            }
            while (mantissa > maxMantissa) {
                mantissa /= 10;
                exponent += 1;
            }
        }
        // bullet 6:
        var roundedNumber = round(mantissa, pic.maximumFactionalPartSize);
        // bullet 7:
        var makeString = function (value, dp) {
            var str = Math.abs(value).toFixed(dp);
            if (zero_digit !== '0') {
                str = str.split('').map(function (digit) {
                    if (digit >= '0' && digit <= '9') {
                        return decimalDigitFamily[digit.charCodeAt(0) - 48];
                    } else {
                        return digit;
                    }
                }).join('');
            }
            return str;
        };
        var stringValue = makeString(roundedNumber, pic.maximumFactionalPartSize);
        var decimalPos = stringValue.indexOf('.');
        if (decimalPos === -1) {
            stringValue = stringValue + decimal_separator;
        } else {
            stringValue = stringValue.replace('.', decimal_separator);
        }
        while (stringValue.charAt(0) === zero_digit) {
            stringValue = stringValue.substring(1);
        }
        while (stringValue.charAt(stringValue.length - 1) === zero_digit) {
            stringValue = stringValue.substring(0, stringValue.length - 1);
        }
        // bullets 8 & 9:
        decimalPos = stringValue.indexOf(decimal_separator);
        var padLeft = pic.minimumIntegerPartSize - decimalPos;
        var padRight = pic.minimumFactionalPartSize - (stringValue.length - decimalPos - 1);
        stringValue = (padLeft > 0 ? new Array(padLeft + 1).join(zero_digit) : '') + stringValue;
        stringValue = stringValue + (padRight > 0 ? new Array(padRight + 1).join(zero_digit) : '');
        decimalPos = stringValue.indexOf(decimal_separator);
        // bullet 10:
        if (pic.regularGrouping > 0) {
            var groupCount = Math.floor((decimalPos - 1) / pic.regularGrouping);
            for (var group = 1; group <= groupCount; group++) {
                stringValue = [stringValue.slice(0, decimalPos - group * pic.regularGrouping), grouping_separator, stringValue.slice(decimalPos - group * pic.regularGrouping)].join('');
            }
        } else {
            pic.integerPartGroupingPositions.forEach(function (pos) {
                stringValue = [stringValue.slice(0, decimalPos - pos), grouping_separator, stringValue.slice(decimalPos - pos)].join('');
                decimalPos++;
            });
        }
        // bullet 11:
        decimalPos = stringValue.indexOf(decimal_separator);
        pic.fractionalPartGroupingPositions.forEach(function (pos) {
            stringValue = [stringValue.slice(0, pos + decimalPos + 1), grouping_separator, stringValue.slice(pos + decimalPos + 1)].join('');
        });
        // bullet 12:
        decimalPos = stringValue.indexOf(decimal_separator);
        if (pic.picture.indexOf(decimal_separator) === -1 || decimalPos === stringValue.length - 1) {
            stringValue = stringValue.substring(0, stringValue.length - 1);
        }
        // bullet 13:
        if (typeof exponent !== 'undefined') {
            var stringExponent = makeString(exponent, 0);
            padLeft = pic.minimumExponentSize - stringExponent.length;
            if (padLeft > 0) {
                stringExponent = new Array(padLeft + 1).join(zero_digit) + stringExponent;
            }
            stringValue = stringValue + properties['exponent-separator'] + (exponent < 0 ? minus_sign : '') + stringExponent;
        }
        // bullet 14:
        stringValue = pic.prefix + stringValue + pic.suffix;
        return stringValue;
    }

    /**
     * Converts a number to a string using a specified number base
     * @param {number} value - the number to convert
     * @param {number} [radix] - the number base; must be between 2 and 36. Defaults to 10
     * @returns {string} - the converted string
     */
    function formatBase(value, radix) {
        // undefined inputs always return undefined
        if (typeof value === 'undefined') {
            return undefined;
        }

        value = round(value);

        if (typeof radix === 'undefined') {
            radix = 10;
        } else {
            radix = round(radix);
        }

        if (radix < 2 || radix > 36) {
            throw {
                code: 'D3100',
                stack: (new Error()).stack,
                value: radix
            };

        }

        var result = value.toString(radix);

        return result;
    }

    /**
     * Cast argument to number
     * @param {Object} arg - Argument
     * @returns {Number} numeric value of argument
     */
    function number(arg) {
        var result;

        // undefined inputs always return undefined
        if (typeof arg === 'undefined') {
            return undefined;
        }

        if (typeof arg === 'number') {
            // already a number
            result = arg;
        } else if (typeof arg === 'string' && /^-?[0-9]+(\.[0-9]+)?([Ee][-+]?[0-9]+)?$/.test(arg) && !isNaN(parseFloat(arg)) && isFinite(arg)) {
            result = parseFloat(arg);
        } else if (arg === true) {
            // boolean true casts to 1
            result = 1;
        } else if (arg === false) {
            // boolean false casts to 0
            result = 0;
        } else {
            throw {
                code: "D3030",
                value: arg,
                stack: (new Error()).stack,
                index: 1
            };
        }
        return result;
    }

    /**
     * Absolute value of a number
     * @param {Number} arg - Argument
     * @returns {Number} absolute value of argument
     */
    function abs(arg) {
        var result;

        // undefined inputs always return undefined
        if (typeof arg === 'undefined') {
            return undefined;
        }

        result = Math.abs(arg);
        return result;
    }

    /**
     * Rounds a number down to integer
     * @param {Number} arg - Argument
     * @returns {Number} rounded integer
     */
    function floor(arg) {
        var result;

        // undefined inputs always return undefined
        if (typeof arg === 'undefined') {
            return undefined;
        }

        result = Math.floor(arg);
        return result;
    }

    /**
     * Rounds a number up to integer
     * @param {Number} arg - Argument
     * @returns {Number} rounded integer
     */
    function ceil(arg) {
        var result;

        // undefined inputs always return undefined
        if (typeof arg === 'undefined') {
            return undefined;
        }

        result = Math.ceil(arg);
        return result;
    }

    /**
     * Round to half even
     * @param {Number} arg - Argument
     * @param {Number} [precision] - number of decimal places
     * @returns {Number} rounded integer
     */
    function round(arg, precision) {
        var result;

        // undefined inputs always return undefined
        if (typeof arg === 'undefined') {
            return undefined;
        }

        if (precision) {
            // shift the decimal place - this needs to be done in a string since multiplying
            // by a power of ten can introduce floating point precision errors which mess up
            // this rounding algorithm - See 'Decimal rounding' in
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
            // Shift
            var value = arg.toString().split('e');
            arg = +(value[0] + 'e' + (value[1] ? (+value[1] + precision) : precision));

        }

        // round up to nearest int
        result = Math.round(arg);
        var diff = result - arg;
        if (Math.abs(diff) === 0.5 && Math.abs(result % 2) === 1) {
            // rounded the wrong way - adjust to nearest even number
            result = result - 1;
        }
        if (precision) {
            // Shift back
            value = result.toString().split('e');
            /* istanbul ignore next */
            result = +(value[0] + 'e' + (value[1] ? (+value[1] - precision) : -precision));
        }
        if (Object.is(result, -0)) { // ESLint rule 'no-compare-neg-zero' suggests this way
            // JSON doesn't do -0
            result = 0;
        }
        return result;
    }

    /**
     * Square root of number
     * @param {Number} arg - Argument
     * @returns {Number} square root
     */
    function sqrt(arg) {
        var result;

        // undefined inputs always return undefined
        if (typeof arg === 'undefined') {
            return undefined;
        }

        if (arg < 0) {
            throw {
                stack: (new Error()).stack,
                code: "D3060",
                index: 1,
                value: arg
            };
        }

        result = Math.sqrt(arg);

        return result;
    }

    /**
     * Raises number to the power of the second number
     * @param {Number} arg - the base
     * @param {Number} exp - the exponent
     * @returns {Number} rounded integer
     */
    function power(arg, exp) {
        var result;

        // undefined inputs always return undefined
        if (typeof arg === 'undefined') {
            return undefined;
        }

        result = Math.pow(arg, exp);

        if (!isFinite(result)) {
            throw {
                stack: (new Error()).stack,
                code: "D3061",
                index: 1,
                value: arg,
                exp: exp
            };
        }

        return result;
    }

    /**
     * Returns a random number 0 <= n < 1
     * @returns {number} random number
     */
    function random() {
        return Math.random();
    }

    /**
     * Evaluate an input and return a boolean
     * @param {*} arg - Arguments
     * @returns {boolean} Boolean
     */
    function boolean(arg) {
        // cast arg to its effective boolean value
        // boolean: unchanged
        // string: zero-length -> false; otherwise -> true
        // number: 0 -> false; otherwise -> true
        // null -> false
        // array: empty -> false; length > 1 -> true
        // object: empty -> false; non-empty -> true
        // function -> false

        // undefined inputs always return undefined
        if (typeof arg === 'undefined') {
            return undefined;
        }

        var result = false;
        if (Array.isArray(arg)) {
            if (arg.length === 1) {
                result = boolean(arg[0]);
            } else if (arg.length > 1) {
                var trues = arg.filter(function (val) {
                    return boolean(val);
                });
                result = trues.length > 0;
            }
        } else if (typeof arg === 'string') {
            if (arg.length > 0) {
                result = true;
            }
        } else if (isNumeric(arg)) {
            if (arg !== 0) {
                result = true;
            }
        } else if (arg !== null && typeof arg === 'object') {
            if (Object.keys(arg).length > 0) {
                result = true;
            }
        } else if (typeof arg === 'boolean' && arg === true) {
            result = true;
        }
        return result;
    }

    /**
     * returns the Boolean NOT of the arg
     * @param {*} arg - argument
     * @returns {boolean} - NOT arg
     */
    function not(arg) {
        // undefined inputs always return undefined
        if (typeof arg === 'undefined') {
            return undefined;
        }

        return !boolean(arg);
    }

    /**
     * Helper function to build the arguments to be supplied to the function arg of the
     * HOFs map, filter, each, sift and single
     * @param {function} func - the function to be invoked
     * @param {*} arg1 - the first (required) arg - the value
     * @param {*} arg2 - the second (optional) arg - the position (index or key)
     * @param {*} arg3 - the third (optional) arg - the whole structure (array or object)
     * @returns {*[]} the argument list
     */
    function hofFuncArgs(func, arg1, arg2, arg3) {
        var func_args = [arg1]; // the first arg (the value) is required
        // the other two are optional - only supply it if the function can take it
        var length = getFunctionArity(func);
        if (length >= 2) {
            func_args.push(arg2);
        }
        if (length >= 3) {
            func_args.push(arg3);
        }
        return func_args;
    }

    /**
     * Create a map from an array of arguments
     * @param {Array} [arr] - array to map over
     * @param {Function} func - function to apply
     * @returns {Array} Map array
     */
    function* map(arr, func) {
        // undefined inputs always return undefined
        if (typeof arr === 'undefined') {
            return undefined;
        }

        var result = createSequence();
        // do the map - iterate over the arrays, and invoke func
        for (var i = 0; i < arr.length; i++) {
            var func_args = hofFuncArgs(func, arr[i], i, arr);
            // invoke func
            var res = yield* func.apply(this, func_args);
            if (typeof res !== 'undefined') {
                result.push(res);
            }
        }

        return result;
    }

    /**
     * Create a map from an array of arguments
     * @param {Array} [arr] - array to filter
     * @param {Function} func - predicate function
     * @returns {Array} Map array
     */
    function* filter(arr, func) { // eslint-disable-line require-yield
        // undefined inputs always return undefined
        if (typeof arr === 'undefined') {
            return undefined;
        }

        var result = createSequence();

        for (var i = 0; i < arr.length; i++) {
            var entry = arr[i];
            var func_args = hofFuncArgs(func, entry, i, arr);
            // invoke func
            var res = yield* func.apply(this, func_args);
            if (boolean(res)) {
                result.push(entry);
            }
        }

        return result;
    }

    /**
     * Given an array, find the single element matching a specified condition
     * Throws an exception if the number of matching elements is not exactly one
     * @param {Array} [arr] - array to filter
     * @param {Function} [func] - predicate function
     * @returns {*} Matching element
     */
    function* single(arr, func) { // eslint-disable-line require-yield
        // undefined inputs always return undefined
        if (typeof arr === 'undefined') {
            return undefined;
        }

        var hasFoundMatch = false;
        var result;

        for (var i = 0; i < arr.length; i++) {
            var entry = arr[i];
            var positiveResult = true;
            if (typeof func !== 'undefined') {
                var func_args = hofFuncArgs(func, entry, i, arr);
                // invoke func
                var res = yield* func.apply(this, func_args);
                positiveResult = boolean(res);
            }
            if (positiveResult) {
                if(!hasFoundMatch) {
                    result = entry;
                    hasFoundMatch = true;
                } else {
                    throw {
                        stack: (new Error()).stack,
                        code: "D3138",
                        index: i
                    };
                }
            }
        }

        if(!hasFoundMatch) {
            throw {
                stack: (new Error()).stack,
                code: "D3139"
            };
        }

        return result;
    }

    /**
     * Convolves (zips) each value from a set of arrays
     * @param {Array} [args] - arrays to zip
     * @returns {Array} Zipped array
     */
    function zip() {
        // this can take a variable number of arguments
        var result = [];
        var args = Array.prototype.slice.call(arguments);
        // length of the shortest array
        var length = Math.min.apply(Math, args.map(function (arg) {
            if (Array.isArray(arg)) {
                return arg.length;
            }
            return 0;
        }));
        for (var i = 0; i < length; i++) {
            var tuple = args.map((arg) => {
                return arg[i];
            });
            result.push(tuple);
        }
        return result;
    }

    /**
     * Fold left function
     * @param {Array} sequence - Sequence
     * @param {Function} func - Function
     * @param {Object} init - Initial value
     * @returns {*} Result
     */
    function* foldLeft(sequence, func, init) {
        // undefined inputs always return undefined
        if (typeof sequence === 'undefined') {
            return undefined;
        }

        var result;

        var arity = getFunctionArity(func);
        if (arity < 2) {
            throw {
                stack: (new Error()).stack,
                code: "D3050",
                index: 1
            };
        }

        var index;
        if (typeof init === 'undefined' && sequence.length > 0) {
            result = sequence[0];
            index = 1;
        } else {
            result = init;
            index = 0;
        }

        while (index < sequence.length) {
            var args = [result, sequence[index]];
            if (arity >= 3) {
                args.push(index);
            }
            if (arity >= 4) {
                args.push(sequence);
            }
            result = yield* func.apply(this, args);
            index++;
        }

        return result;
    }

    /**
     * Return keys for an object
     * @param {Object} arg - Object
     * @returns {Array} Array of keys
     */
    function keys(arg) {
        var result = createSequence();

        if (Array.isArray(arg)) {
            // merge the keys of all of the items in the array
            var merge = {};
            arg.forEach(function (item) {
                var allkeys = keys(item);
                allkeys.forEach(function (key) {
                    merge[key] = true;
                });
            });
            result = keys(merge);
        } else if (arg !== null && typeof arg === 'object' && !(isLambda(arg))) {
            Object.keys(arg).forEach(key => result.push(key));
        }
        return result;
    }

    /**
     * Return value from an object for a given key
     * @param {Object} input - Object/Array
     * @param {String} key - Key in object
     * @returns {*} Value of key in object
     */
    function lookup(input, key) {
        // lookup the 'name' item in the input
        var result;
        if (Array.isArray(input)) {
            result = createSequence();
            for(var ii = 0; ii < input.length; ii++) {
                var res =  lookup(input[ii], key);
                if (typeof res !== 'undefined') {
                    if (Array.isArray(res)) {
                        res.forEach(val => result.push(val));
                    } else {
                        result.push(res);
                    }
                }
            }
        } else if (input !== null && typeof input === 'object') {
            result = input[key];
        }
        return result;
    }

    /**
     * Append second argument to first
     * @param {Array|Object} arg1 - First argument
     * @param {Array|Object} arg2 - Second argument
     * @returns {*} Appended arguments
     */
    function append(arg1, arg2) {
        // disregard undefined args
        if (typeof arg1 === 'undefined') {
            return arg2;
        }
        if (typeof arg2 === 'undefined') {
            return arg1;
        }
        // if either argument is not an array, make it so
        if (!Array.isArray(arg1)) {
            arg1 = createSequence(arg1);
        }
        if (!Array.isArray(arg2)) {
            arg2 = [arg2];
        }
        return arg1.concat(arg2);
    }

    /**
     * Determines if the argument is undefined
     * @param {*} arg - argument
     * @returns {boolean} False if argument undefined, otherwise true
     */
    function exists(arg) {
        if (typeof arg === 'undefined') {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Splits an object into an array of object with one property each
     * @param {*} arg - the object to split
     * @returns {*} - the array
     */
    function spread(arg) {
        var result = createSequence();

        if (Array.isArray(arg)) {
            // spread all of the items in the array
            arg.forEach(function (item) {
                result = append(result, spread(item));
            });
        } else if (arg !== null && typeof arg === 'object' && !isLambda(arg)) {
            for (var key in arg) {
                var obj = {};
                obj[key] = arg[key];
                result.push(obj);
            }
        } else {
            result = arg;
        }
        return result;
    }

    /**
     * Merges an array of objects into a single object.  Duplicate properties are
     * overridden by entries later in the array
     * @param {*} arg - the objects to merge
     * @returns {*} - the object
     */
    function merge(arg) {
        // undefined inputs always return undefined
        if (typeof arg === 'undefined') {
            return undefined;
        }

        var result = {};

        arg.forEach(function (obj) {
            for (var prop in obj) {
                result[prop] = obj[prop];
            }
        });
        return result;
    }

    /**
     * Reverses the order of items in an array
     * @param {Array} arr - the array to reverse
     * @returns {Array} - the reversed array
     */
    function reverse(arr) {
        // undefined inputs always return undefined
        if (typeof arr === 'undefined') {
            return undefined;
        }

        if (arr.length <= 1) {
            return arr;
        }

        var length = arr.length;
        var result = new Array(length);
        for (var i = 0; i < length; i++) {
            result[length - i - 1] = arr[i];
        }

        return result;
    }

    /**
     *
     * @param {*} obj - the input object to iterate over
     * @param {*} func - the function to apply to each key/value pair
     * @returns {Array} - the resultant array
     */
    function* each(obj, func) {
        var result = createSequence();

        for (var key in obj) {
            var func_args = hofFuncArgs(func, obj[key], key, obj);
            // invoke func
            var val = yield* func.apply(this, func_args);
            if(typeof val !== 'undefined') {
                result.push(val);
            }
        }

        return result;
    }

    /**
     *
     * @param {string} [message] - the message to attach to the error
     * @throws custom error with code 'D3137'
     */
    function error(message) {
        throw {
            code: "D3137",
            stack: (new Error()).stack,
            message: message || "$error() function evaluated"
        };
    }

    /**
     *
     * @param {boolean} condition - the condition to evaluate
     * @param {string} [message] - the message to attach to the error
     * @throws custom error with code 'D3137'
     * @returns {undefined}
     */
    function assert(condition, message) {
        if(!condition) {
            throw {
                code: "D3141",
                stack: (new Error()).stack,
                message: message || "$assert() statement failed"
            };
        }

        return undefined;
    }

    /**
     *
     * @param {*} [value] - the input to which the type will be checked
     * @returns {string} - the type of the input
     */
    function type(value) {
        if (value === undefined) {
            return undefined;
        }

        if (value === null) {
            return 'null';
        }

        if (isNumeric(value)) {
            return 'number';
        }

        if (typeof value === 'string') {
            return 'string';
        }

        if (typeof value === 'boolean') {
            return 'boolean';
        }

        if(Array.isArray(value)) {
            return 'array';
        }

        if(isFunction(value)) {
            return 'function';
        }

        return 'object';
    }

    /**
     * Implements the merge sort (stable) with optional comparator function
     *
     * @param {Array} arr - the array to sort
     * @param {*} comparator - comparator function
     * @returns {Array} - sorted array
     */
    function* sort(arr, comparator) {
        // undefined inputs always return undefined
        if (typeof arr === 'undefined') {
            return undefined;
        }

        if (arr.length <= 1) {
            return arr;
        }

        var comp;
        if (typeof comparator === 'undefined') {
            // inject a default comparator - only works for numeric or string arrays
            if (!isArrayOfNumbers(arr) && !isArrayOfStrings(arr)) {
                throw {
                    stack: (new Error()).stack,
                    code: "D3070",
                    index: 1
                };
            }

            comp = function* (a, b) {  // eslint-disable-line require-yield
                return a > b;
            };
        } else {
            // for internal usage of functionSort (i.e. order-by syntax)
            comp = comparator;
        }

        var merge = function* (l, r) {
            var merge_iter = function* (result, left, right) {
                if (left.length === 0) {
                    Array.prototype.push.apply(result, right);
                } else if (right.length === 0) {
                    Array.prototype.push.apply(result, left);
                } else if (yield* comp(left[0], right[0])) { // invoke the comparator function
                    // if it returns true - swap left and right
                    result.push(right[0]);
                    yield* merge_iter(result, left, right.slice(1));
                } else {
                    // otherwise keep the same order
                    result.push(left[0]);
                    yield* merge_iter(result, left.slice(1), right);
                }
            };
            var merged = [];
            yield* merge_iter(merged, l, r);
            return merged;
        };

        var msort = function* (array) {
            if (!Array.isArray(array) || array.length <= 1) {
                return array;
            } else {
                var middle = Math.floor(array.length / 2);
                var left = array.slice(0, middle);
                var right = array.slice(middle);
                left = yield* msort(left);
                right = yield* msort(right);
                return yield* merge(left, right);
            }
        };

        var result = yield* msort(arr);

        return result;
    }

    /**
     * Randomly shuffles the contents of an array
     * @param {Array} arr - the input array
     * @returns {Array} the shuffled array
     */
    function shuffle(arr) {
        // undefined inputs always return undefined
        if (typeof arr === 'undefined') {
            return undefined;
        }

        if (arr.length <= 1) {
            return arr;
        }

        // shuffle using the 'inside-out' variant of the Fisher-Yates algorithm
        var result = new Array(arr.length);
        for (var i = 0; i < arr.length; i++) {
            var j = Math.floor(Math.random() * (i + 1)); // random integer such that 0 ≤ j ≤ i
            if (i !== j) {
                result[i] = result[j];
            }
            result[j] = arr[i];
        }

        return result;
    }

    /**
     * Returns the values that appear in a sequence, with duplicates eliminated.
     * @param {Array} arr - An array or sequence of values
     * @returns {Array} - sequence of distinct values
     */
    function distinct(arr) {
        // undefined inputs always return undefined
        if (typeof arr === 'undefined') {
            return undefined;
        }

        if(!Array.isArray(arr) || arr.length <= 1) {
            return arr;
        }

        var results = isSequence(arr) ? createSequence() : [];

        for(var ii = 0; ii < arr.length; ii++) {
            var value = arr[ii];
            // is this value already in the result sequence?
            var includes = false;
            for(var jj = 0; jj < results.length; jj++) {
                if (deepEquals(value, results[jj])) {
                    includes = true;
                    break;
                }
            }
            if(!includes) {
                results.push(value);
            }
        }
        return results;
    }

    /**
     * Applies a predicate function to each key/value pair in an object, and returns an object containing
     * only the key/value pairs that passed the predicate
     *
     * @param {object} arg - the object to be sifted
     * @param {object} func - the predicate function (lambda or native)
     * @returns {object} - sifted object
     */
    function* sift(arg, func) {
        var result = {};

        for (var item in arg) {
            var entry = arg[item];
            var func_args = hofFuncArgs(func, entry, item, arg);
            // invoke func
            var res = yield* func.apply(this, func_args);
            if (boolean(res)) {
                result[item] = entry;
            }
        }

        // empty objects should be changed to undefined
        if (Object.keys(result).length === 0) {
            result = undefined;
        }

        return result;
    }

    return {
        sum, count, max, min, average,
        string, substring, substringBefore, substringAfter, lowercase, uppercase, length, trim, pad,
        match, contains, replace, split, join,
        formatNumber, formatBase, number, floor, ceil, round, abs, sqrt, power, random,
        boolean, not,
        map, zip, filter, single, foldLeft, sift,
        keys, lookup, append, exists, spread, merge, reverse, each, error, assert, type, sort, shuffle, distinct,
        base64encode, base64decode,  encodeUrlComponent, encodeUrl, decodeUrlComponent, decodeUrl
    };
})();

module.exports = functions;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./utils":6}],3:[function(require,module,exports){
/**
 * © Copyright IBM Corp. 2016, 2017 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

/**
 * @module JSONata
 * @description JSON query and transformation language
 */

var datetime = require('./datetime');
var fn = require('./functions');
var utils = require('./utils');
var parser = require('./parser');
var parseSignature = require('./signature');

/**
 * jsonata
 * @function
 * @param {Object} expr - JSONata expression
 * @returns {{evaluate: evaluate, assign: assign}} Evaluated expression
 */
var jsonata = (function() {
    'use strict';

    var isNumeric = utils.isNumeric;
    var isArrayOfStrings = utils.isArrayOfStrings;
    var isArrayOfNumbers = utils.isArrayOfNumbers;
    var createSequence = utils.createSequence;
    var isSequence = utils.isSequence;
    var isFunction = utils.isFunction;
    var isLambda = utils.isLambda;
    var isIterable = utils.isIterable;
    var getFunctionArity = utils.getFunctionArity;
    var isDeepEqual = utils.isDeepEqual;

    // Start of Evaluator code

    var staticFrame = createFrame(null);

    /**
     * Evaluate expression against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluate(expr, input, environment) {
        var result;

        var entryCallback = environment.lookup('__evaluate_entry');
        if(entryCallback) {
            entryCallback(expr, input, environment);
        }

        switch (expr.type) {
            case 'path':
                result = yield * evaluatePath(expr, input, environment);
                break;
            case 'binary':
                result = yield * evaluateBinary(expr, input, environment);
                break;
            case 'unary':
                result = yield * evaluateUnary(expr, input, environment);
                break;
            case 'name':
                result = evaluateName(expr, input, environment);
                break;
            case 'string':
            case 'number':
            case 'value':
                result = evaluateLiteral(expr, input, environment);
                break;
            case 'wildcard':
                result = evaluateWildcard(expr, input, environment);
                break;
            case 'descendant':
                result = evaluateDescendants(expr, input, environment);
                break;
            case 'parent':
                result = environment.lookup(expr.slot.label);
                break;
            case 'condition':
                result = yield * evaluateCondition(expr, input, environment);
                break;
            case 'block':
                result = yield * evaluateBlock(expr, input, environment);
                break;
            case 'bind':
                result = yield * evaluateBindExpression(expr, input, environment);
                break;
            case 'regex':
                result = evaluateRegex(expr, input, environment);
                break;
            case 'function':
                result = yield * evaluateFunction(expr, input, environment);
                break;
            case 'variable':
                result = evaluateVariable(expr, input, environment);
                break;
            case 'lambda':
                result = evaluateLambda(expr, input, environment);
                break;
            case 'partial':
                result = yield * evaluatePartialApplication(expr, input, environment);
                break;
            case 'apply':
                result = yield * evaluateApplyExpression(expr, input, environment);
                break;
            case 'transform':
                result = evaluateTransformExpression(expr, input, environment);
                break;
        }

        if(environment.async &&
            (typeof result === 'undefined' || result === null || typeof result.then !== 'function')) {
            result = Promise.resolve(result);
        }
        if(environment.async && typeof result.then === 'function' && expr.nextFunction && typeof result[expr.nextFunction] === 'function') {
            // although this is a 'thenable', it is chaining a different function
            // so don't yield since yielding will trigger the .then()
        } else {
            result = yield result;
        }

        if (Object.prototype.hasOwnProperty.call(expr, 'predicate')) {
            for(var ii = 0; ii < expr.predicate.length; ii++) {
                result = yield * evaluateFilter(expr.predicate[ii].expr, result, environment);
            }
        }

        if (expr.type !== 'path' && Object.prototype.hasOwnProperty.call(expr, 'group')) {
            result = yield * evaluateGroupExpression(expr.group, result, environment);
        }

        var exitCallback = environment.lookup('__evaluate_exit');
        if(exitCallback) {
            exitCallback(expr, input, environment, result);
        }

        if(result && isSequence(result) && !result.tupleStream) {
            if(expr.keepArray) {
                result.keepSingleton = true;
            }
            if(result.length === 0) {
                result = undefined;
            } else if(result.length === 1) {
                result =  result.keepSingleton ? result : result[0];
            }

        }

        return result;
    }

    /**
     * Evaluate path expression against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluatePath(expr, input, environment) {
        var inputSequence;
        // expr is an array of steps
        // if the first step is a variable reference ($...), including root reference ($$),
        //   then the path is absolute rather than relative
        if (Array.isArray(input) && expr.steps[0].type !== 'variable') {
            inputSequence = input;
        } else {
            // if input is not an array, make it so
            inputSequence = createSequence(input);
        }

        var resultSequence;
        var isTupleStream = false;
        var tupleBindings = undefined;

        // evaluate each step in turn
        for(var ii = 0; ii < expr.steps.length; ii++) {
            var step = expr.steps[ii];

            if(step.tuple) {
                isTupleStream = true;
            }

            // if the first step is an explicit array constructor, then just evaluate that (i.e. don't iterate over a context array)
            if(ii === 0 && step.consarray) {
                resultSequence = yield * evaluate(step, inputSequence, environment);
            } else {
                if(isTupleStream) {
                    tupleBindings = yield * evaluateTupleStep(step, inputSequence, tupleBindings, environment);
                } else {
                    resultSequence = yield * evaluateStep(step, inputSequence, environment, ii === expr.steps.length - 1);
                }
            }

            if (!isTupleStream && (typeof resultSequence === 'undefined' || resultSequence.length === 0)) {
                break;
            }

            if(typeof step.focus === 'undefined') {
                inputSequence = resultSequence;
            }

        }

        if(isTupleStream) {
            if(expr.tuple) {
                // tuple stream is carrying ancestry information - keep this
                resultSequence = tupleBindings;
            } else {
                resultSequence = createSequence();
                for (ii = 0; ii < tupleBindings.length; ii++) {
                    resultSequence.push(tupleBindings[ii]['@']);
                }
            }
        }

        if(expr.keepSingletonArray) {
            if(!isSequence(resultSequence)) {
                resultSequence = createSequence(resultSequence);
            }
            resultSequence.keepSingleton = true;
        }

        if (expr.hasOwnProperty('group')) {
            resultSequence = yield* evaluateGroupExpression(expr.group, isTupleStream ? tupleBindings : resultSequence, environment)
        }

        return resultSequence;
    }

    function createFrameFromTuple(environment, tuple) {
        var frame = createFrame(environment);
        for(const prop in tuple) {
            frame.bind(prop, tuple[prop]);
        }
        return frame;
    }

    /**
     * Evaluate a step within a path
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @param {boolean} lastStep - flag the last step in a path
     * @returns {*} Evaluated input data
     */
    function* evaluateStep(expr, input, environment, lastStep) {
        var result;
        if(expr.type === 'sort') {
             result = yield* evaluateSortExpression(expr, input, environment);
             if(expr.stages) {
                 result = yield* evaluateStages(expr.stages, result, environment);
             }
             return result;
        }

        result = createSequence();

        for(var ii = 0; ii < input.length; ii++) {
            var res = yield * evaluate(expr, input[ii], environment);
            if(expr.stages) {
                for(var ss = 0; ss < expr.stages.length; ss++) {
                    res = yield* evaluateFilter(expr.stages[ss].expr, res, environment);
                }
            }
            if(typeof res !== 'undefined') {
                result.push(res);
            }
        }

        var resultSequence = createSequence();
        if(lastStep && result.length === 1 && Array.isArray(result[0]) && !isSequence(result[0])) {
            resultSequence = result[0];
        } else {
            // flatten the sequence
            result.forEach(function(res) {
                if (!Array.isArray(res) || res.cons) {
                    // it's not an array - just push into the result sequence
                    resultSequence.push(res);
                } else {
                    // res is a sequence - flatten it into the parent sequence
                    res.forEach(val => resultSequence.push(val));
                }
            });
        }

        return resultSequence;
    }

    function* evaluateStages(stages, input, environment) {
        var result = input;
        for(var ss = 0; ss < stages.length; ss++) {
            var stage = stages[ss];
            switch(stage.type) {
                case 'filter':
                    result = yield * evaluateFilter(stage.expr, result, environment);
                    break;
                case 'index':
                    for(var ee = 0; ee < result.length; ee++) {
                        var tuple = result[ee];
                        tuple[stage.value] = ee;
                    }
                    break;
            }
        }
        return result;
    }

    /**
     * Evaluate a step within a path
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} tupleBindings - The tuple stream
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluateTupleStep(expr, input, tupleBindings, environment) {
        var result;
        if(expr.type === 'sort') {
            if(tupleBindings) {
                result = yield* evaluateSortExpression(expr, tupleBindings, environment);
            } else {
                var sorted = yield* evaluateSortExpression(expr, input, environment);
                result = createSequence();
                result.tupleStream = true;
                for(var ss = 0; ss < sorted.length; ss++) {
                    var tuple = {'@': sorted[ss]};
                    tuple[expr.index] = ss;
                    result.push(tuple);
                }
            }
            if(expr.stages) {
                result = yield* evaluateStages(expr.stages, result, environment);
            }
            return result;
        }

        result = createSequence();
        result.tupleStream = true;
        var stepEnv = environment;
        if(tupleBindings === undefined) {
            tupleBindings = input.map(item => { return {'@': item} });
        }

        for(var ee = 0; ee < tupleBindings.length; ee++) {
            stepEnv = createFrameFromTuple(environment, tupleBindings[ee]);
            var res = yield* evaluate(expr, tupleBindings[ee]['@'], stepEnv);
            // res is the binding sequence for the output tuple stream
            if(typeof res !== 'undefined') {
                if (!Array.isArray(res)) {
                    res = [res];
                }
                for (var bb = 0; bb < res.length; bb++) {
                    tuple = {};
                    Object.assign(tuple, tupleBindings[ee]);
                    if(res.tupleStream) {
                        Object.assign(tuple, res[bb]);
                    } else {
                        if (expr.focus) {
                            tuple[expr.focus] = res[bb];
                            tuple['@'] = tupleBindings[ee]['@'];
                        } else {
                            tuple['@'] = res[bb];
                        }
                        if (expr.index) {
                            tuple[expr.index] = bb;
                        }
                        if (expr.ancestor) {
                            tuple[expr.ancestor.label] = tupleBindings[ee]['@'];
                        }
                    }
                    result.push(tuple);
                }
            }
        }

        if(expr.stages) {
            result = yield * evaluateStages(expr.stages, result, environment);
        }

        return result;
    }

    /**
     * Apply filter predicate to input data
     * @param {Object} predicate - filter expression
     * @param {Object} input - Input data to apply predicates against
     * @param {Object} environment - Environment
     * @returns {*} Result after applying predicates
     */
    function* evaluateFilter(predicate, input, environment) {
        var results = createSequence();
        if( input && input.tupleStream) {
            results.tupleStream = true;
        }
        if (!Array.isArray(input)) {
            input = createSequence(input);
        }
        if (predicate.type === 'number') {
            var index = Math.floor(predicate.value);  // round it down
            if (index < 0) {
                // count in from end of array
                index = input.length + index;
            }
            var item = input[index];
            if(typeof item !== 'undefined') {
                if(Array.isArray(item)) {
                    results = item;
                } else {
                    results.push(item);
                }
            }
        } else {
            for (index = 0; index < input.length; index++) {
                var item = input[index];
                var context = item;
                var env = environment;
                if(input.tupleStream) {
                    context = item['@'];
                    env = createFrameFromTuple(environment, item);
                }
                var res = yield* evaluate(predicate, context, env);
                if (isNumeric(res)) {
                    res = [res];
                }
                if (isArrayOfNumbers(res)) {
                    res.forEach(function (ires) {
                        // round it down
                        var ii = Math.floor(ires);
                        if (ii < 0) {
                            // count in from end of array
                            ii = input.length + ii;
                        }
                        if (ii === index) {
                            results.push(item);
                        }
                    });
                } else if (fn.boolean(res)) { // truthy
                    results.push(item);
                }
            }
        }
        return results;
    }

    /**
     * Evaluate binary expression against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function * evaluateBinary(expr, input, environment) {
        var result;
        var lhs = yield * evaluate(expr.lhs, input, environment);
        var rhs = yield * evaluate(expr.rhs, input, environment);
        var op = expr.value;

        try {
            switch (op) {
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    result = evaluateNumericExpression(lhs, rhs, op);
                    break;
                case '=':
                case '!=':
                    result = evaluateEqualityExpression(lhs, rhs, op);
                    break;
                case '<':
                case '<=':
                case '>':
                case '>=':
                    result = evaluateComparisonExpression(lhs, rhs, op);
                    break;
                case '&':
                    result = evaluateStringConcat(lhs, rhs);
                    break;
                case 'and':
                case 'or':
                    result = evaluateBooleanExpression(lhs, rhs, op);
                    break;
                case '..':
                    result = evaluateRangeExpression(lhs, rhs);
                    break;
                case 'in':
                    result = evaluateIncludesExpression(lhs, rhs);
                    break;
            }
        } catch(err) {
            err.position = expr.position;
            err.token = op;
            throw err;
        }
        return result;
    }

    /**
     * Evaluate unary expression against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluateUnary(expr, input, environment) {
        var result;

        switch (expr.value) {
            case '-':
                result = yield * evaluate(expr.expression, input, environment);
                if(typeof result === 'undefined') {
                    result = undefined;
                } else if (isNumeric(result)) {
                    result = -result;
                } else {
                    throw {
                        code: "D1002",
                        stack: (new Error()).stack,
                        position: expr.position,
                        token: expr.value,
                        value: result
                    };
                }
                break;
            case '[':
                // array constructor - evaluate each item
                result = [];
                for(var ii = 0; ii < expr.expressions.length; ii++) {
                    var item = expr.expressions[ii];
                    var value = yield * evaluate(item, input, environment);
                    if (typeof value !== 'undefined') {
                        if(item.value === '[') {
                            result.push(value);
                        } else {
                            result = fn.append(result, value);
                        }
                    }
                }
                if(expr.consarray) {
                    Object.defineProperty(result, 'cons', {
                        enumerable: false,
                        configurable: false,
                        value: true
                    });
                }
                break;
            case '{':
                // object constructor - apply grouping
                result = yield * evaluateGroupExpression(expr, input, environment);
                break;

        }
        return result;
    }

    /**
     * Evaluate name object against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function evaluateName(expr, input, environment) {
        // lookup the 'name' item in the input
        return fn.lookup(input, expr.value);
    }

    /**
     * Evaluate literal against input data
     * @param {Object} expr - JSONata expression
     * @returns {*} Evaluated input data
     */
    function evaluateLiteral(expr) {
        return expr.value;
    }

    /**
     * Evaluate wildcard against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @returns {*} Evaluated input data
     */
    function evaluateWildcard(expr, input) {
        var results = createSequence();
        if (input !== null && typeof input === 'object') {
            Object.keys(input).forEach(function (key) {
                var value = input[key];
                if(Array.isArray(value)) {
                    value = flatten(value);
                    results = fn.append(results, value);
                } else {
                    results.push(value);
                }
            });
        }

        //        result = normalizeSequence(results);
        return results;
    }

    /**
     * Returns a flattened array
     * @param {Array} arg - the array to be flatten
     * @param {Array} flattened - carries the flattened array - if not defined, will initialize to []
     * @returns {Array} - the flattened array
     */
    function flatten(arg, flattened) {
        if(typeof flattened === 'undefined') {
            flattened = [];
        }
        if(Array.isArray(arg)) {
            arg.forEach(function (item) {
                flatten(item, flattened);
            });
        } else {
            flattened.push(arg);
        }
        return flattened;
    }

    /**
     * Evaluate descendants against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @returns {*} Evaluated input data
     */
    function evaluateDescendants(expr, input) {
        var result;
        var resultSequence = createSequence();
        if (typeof input !== 'undefined') {
            // traverse all descendants of this object/array
            recurseDescendants(input, resultSequence);
            if (resultSequence.length === 1) {
                result = resultSequence[0];
            } else {
                result = resultSequence;
            }
        }
        return result;
    }

    /**
     * Recurse through descendants
     * @param {Object} input - Input data
     * @param {Object} results - Results
     */
    function recurseDescendants(input, results) {
        // this is the equivalent of //* in XPath
        if (!Array.isArray(input)) {
            results.push(input);
        }
        if (Array.isArray(input)) {
            input.forEach(function (member) {
                recurseDescendants(member, results);
            });
        } else if (input !== null && typeof input === 'object') {
            Object.keys(input).forEach(function (key) {
                recurseDescendants(input[key], results);
            });
        }
    }

    /**
     * Evaluate numeric expression against input data
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @param {Object} op - opcode
     * @returns {*} Result
     */
    function evaluateNumericExpression(lhs, rhs, op) {
        var result;

        if (typeof lhs !== 'undefined' && !isNumeric(lhs)) {
            throw {
                code: "T2001",
                stack: (new Error()).stack,
                value: lhs
            };
        }
        if (typeof rhs !== 'undefined' && !isNumeric(rhs)) {
            throw {
                code: "T2002",
                stack: (new Error()).stack,
                value: rhs
            };
        }

        if (typeof lhs === 'undefined' || typeof rhs === 'undefined') {
            // if either side is undefined, the result is undefined
            return result;
        }

        switch (op) {
            case '+':
                result = lhs + rhs;
                break;
            case '-':
                result = lhs - rhs;
                break;
            case '*':
                result = lhs * rhs;
                break;
            case '/':
                result = lhs / rhs;
                break;
            case '%':
                result = lhs % rhs;
                break;
        }
        return result;
    }

    /**
     * Evaluate equality expression against input data
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @param {Object} op - opcode
     * @returns {*} Result
     */
    function evaluateEqualityExpression(lhs, rhs, op) {
        var result;

        // type checks
        var ltype = typeof lhs;
        var rtype = typeof rhs;

        if (ltype === 'undefined' || rtype === 'undefined') {
            // if either side is undefined, the result is false
            return false;
        }

        switch (op) {
            case '=':
                result = isDeepEqual(lhs, rhs);
                break;
            case '!=':
                result = !isDeepEqual(lhs, rhs);
                break;
        }
        return result;
    }

    /**
     * Evaluate comparison expression against input data
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @param {Object} op - opcode
     * @returns {*} Result
     */
    function evaluateComparisonExpression(lhs, rhs, op) {
        var result;

        // type checks
        var ltype = typeof lhs;
        var rtype = typeof rhs;

        var lcomparable = (ltype === 'undefined' || ltype === 'string' || ltype === 'number');
        var rcomparable = (rtype === 'undefined' || rtype === 'string' || rtype === 'number');

        // if either aa or bb are not comparable (string or numeric) values, then throw an error
        if (!lcomparable || !rcomparable) {
            throw {
                code: "T2010",
                stack: (new Error()).stack,
                value: !(ltype === 'string' || ltype === 'number') ? lhs : rhs
            };
        }

        // if either side is undefined, the result is undefined
        if (ltype === 'undefined' || rtype === 'undefined') {
            return undefined;
        }

        //if aa and bb are not of the same type
        if (ltype !== rtype) {
            throw {
                code: "T2009",
                stack: (new Error()).stack,
                value: lhs,
                value2: rhs
            };
        }

        switch (op) {
            case '<':
                result = lhs < rhs;
                break;
            case '<=':
                result = lhs <= rhs;
                break;
            case '>':
                result = lhs > rhs;
                break;
            case '>=':
                result = lhs >= rhs;
                break;
        }
        return result;
    }

    /**
     * Inclusion operator - in
     *
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @returns {boolean} - true if lhs is a member of rhs
     */
    function evaluateIncludesExpression(lhs, rhs) {
        var result = false;

        if (typeof lhs === 'undefined' || typeof rhs === 'undefined') {
            // if either side is undefined, the result is false
            return false;
        }

        if(!Array.isArray(rhs)) {
            rhs = [rhs];
        }

        for(var i = 0; i < rhs.length; i++) {
            if(rhs[i] === lhs) {
                result = true;
                break;
            }
        }

        return result;
    }

    /**
     * Evaluate boolean expression against input data
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @param {Object} op - opcode
     * @returns {*} Result
     */
    function evaluateBooleanExpression(lhs, rhs, op) {
        var result;

        var lBool = fn.boolean(lhs);
        var rBool = fn.boolean(rhs);

        if (typeof  lBool === 'undefined') {
            lBool = false;
        }

        if (typeof  rBool === 'undefined') {
            rBool = false;
        }

        switch (op) {
            case 'and':
                result = lBool && rBool;
                break;
            case 'or':
                result = lBool || rBool;
                break;
        }
        return result;
    }

    /**
     * Evaluate string concatenation against input data
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @returns {string|*} Concatenated string
     */
    function evaluateStringConcat(lhs, rhs) {
        var result;

        var lstr = '';
        var rstr = '';
        if (typeof lhs !== 'undefined') {
            lstr = fn.string(lhs);
        }
        if (typeof rhs !== 'undefined') {
            rstr = fn.string(rhs);
        }

        result = lstr.concat(rstr);
        return result;
    }

    /**
     * Evaluate group expression against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {{}} Evaluated input data
     */
    function* evaluateGroupExpression(expr, input, environment) {
        var result = {};
        var groups = {};
        var reduce = input && input.tupleStream ? true : false;
        // group the input sequence by 'key' expression
        if (!Array.isArray(input)) {
            input = createSequence(input);
        }

        for(var itemIndex = 0; itemIndex < input.length; itemIndex++) {
            var item = input[itemIndex];
            var env = reduce ? createFrameFromTuple(environment, item) : environment;
            for(var pairIndex = 0; pairIndex < expr.lhs.length; pairIndex++) {
                var pair = expr.lhs[pairIndex];
                var key = yield * evaluate(pair[0], reduce ? item['@'] : item, env);
                // key has to be a string
                if (typeof  key !== 'string') {
                    throw {
                        code: "T1003",
                        stack: (new Error()).stack,
                        position: expr.position,
                        value: key
                    };
                }
                var entry = {data: item, exprIndex: pairIndex};
                if (groups.hasOwnProperty(key)) {
                    // a value already exists in this slot
                    if(groups[key].exprIndex !== pairIndex) {
                        // this key has been generated by another expression in this group
                        // when multiple key expressions evaluate to the same key, then error D1009 must be thrown
                        throw {
                            code: "D1009",
                            stack: (new Error()).stack,
                            position: expr.position,
                            value: key
                        };
                    }

                    // append it as an array
                    groups[key].data = fn.append(groups[key].data, item);
                } else {
                    groups[key] = entry;
                }
            }
        }

        // iterate over the groups to evaluate the 'value' expression
        for (key in groups) {
            entry = groups[key];
            var context = entry.data;
            var env = environment;
            if (reduce) {
                var tuple = reduceTupleStream(entry.data);
                context = tuple['@'];
                delete tuple['@'];
                env = createFrameFromTuple(environment, tuple);
            }
            var value = yield * evaluate(expr.lhs[entry.exprIndex][1], context, env);
            if(typeof value !== 'undefined') {
                result[key] = value;
            }
        }

        return result;
    }

    function reduceTupleStream(tupleStream) {
        if(!Array.isArray(tupleStream)) {
            return tupleStream;
        }
        var result = {};
        Object.assign(result, tupleStream[0]);
        for(var ii = 1; ii < tupleStream.length; ii++) {
            for(const prop in tupleStream[ii]) {
                result[prop] = fn.append(result[prop], tupleStream[ii][prop]);
            }
        }
        return result;
    }

    /**
     * Evaluate range expression against input data
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @returns {Array} Resultant array
     */
    function evaluateRangeExpression(lhs, rhs) {
        var result;

        if (typeof lhs !== 'undefined' && !Number.isInteger(lhs)) {
            throw {
                code: "T2003",
                stack: (new Error()).stack,
                value: lhs
            };
        }
        if (typeof rhs !== 'undefined' && !Number.isInteger(rhs)) {
            throw {
                code: "T2004",
                stack: (new Error()).stack,
                value: rhs
            };
        }

        if (typeof lhs === 'undefined' || typeof rhs === 'undefined') {
            // if either side is undefined, the result is undefined
            return result;
        }

        if (lhs > rhs) {
            // if the lhs is greater than the rhs, return undefined
            return result;
        }

        // limit the size of the array to ten million entries (1e7)
        // this is an implementation defined limit to protect against
        // memory and performance issues.  This value may increase in the future.
        var size = rhs - lhs + 1;
        if(size > 1e7) {
            throw {
                code: "D2014",
                stack: (new Error()).stack,
                value: size
            };
        }

        result = new Array(size);
        for (var item = lhs, index = 0; item <= rhs; item++, index++) {
            result[index] = item;
        }
        result.sequence = true;
        return result;
    }

    /**
     * Evaluate bind expression against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluateBindExpression(expr, input, environment) {
        // The RHS is the expression to evaluate
        // The LHS is the name of the variable to bind to - should be a VARIABLE token (enforced by parser)
        var value = yield * evaluate(expr.rhs, input, environment);
        environment.bind(expr.lhs.value, value);
        return value;
    }

    /**
     * Evaluate condition against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluateCondition(expr, input, environment) {
        var result;
        var condition = yield * evaluate(expr.condition, input, environment);
        if (fn.boolean(condition)) {
            result = yield * evaluate(expr.then, input, environment);
        } else if (typeof expr.else !== 'undefined') {
            result = yield * evaluate(expr.else, input, environment);
        }
        return result;
    }

    /**
     * Evaluate block against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluateBlock(expr, input, environment) {
        var result;
        // create a new frame to limit the scope of variable assignments
        // TODO, only do this if the post-parse stage has flagged this as required
        var frame = createFrame(environment);
        // invoke each expression in turn
        // only return the result of the last one
        for(var ii = 0; ii < expr.expressions.length; ii++) {
            result = yield * evaluate(expr.expressions[ii], input, frame);
        }

        return result;
    }

    /**
     * Prepare a regex
     * @param {Object} expr - expression containing regex
     * @returns {Function} Higher order function representing prepared regex
     */
    function evaluateRegex(expr) {
        var re = new RegExp(expr.value);
        var closure = function(str, fromIndex) {
            var result;
            re.lastIndex = fromIndex || 0;
            var match = re.exec(str);
            if(match !== null) {
                result = {
                    match: match[0],
                    start: match.index,
                    end: match.index + match[0].length,
                    groups: []
                };
                if(match.length > 1) {
                    for(var i = 1; i < match.length; i++) {
                        result.groups.push(match[i]);
                    }
                }
                result.next = function() {
                    if(re.lastIndex >= str.length) {
                        return undefined;
                    } else {
                        var next = closure(str, re.lastIndex);
                        if(next && next.match === '') {
                            // matches zero length string; this will never progress
                            throw {
                                code: "D1004",
                                stack: (new Error()).stack,
                                position: expr.position,
                                value: expr.value.source
                            };
                        }
                        return next;
                    }
                };
            }

            return result;
        };
        return closure;
    }

    /**
     * Evaluate variable against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function evaluateVariable(expr, input, environment) {
        // lookup the variable value in the environment
        var result;
        // if the variable name is empty string, then it refers to context value
        if (expr.value === '') {
            result = input && input.outerWrapper ? input[0] : input;
        } else {
            result = environment.lookup(expr.value);
        }
        return result;
    }

    /**
     * sort / order-by operator
     * @param {Object} expr - AST for operator
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Ordered sequence
     */
    function* evaluateSortExpression(expr, input, environment) {
        var result;

        // evaluate the lhs, then sort the results in order according to rhs expression
        //var lhs = yield * evaluate(expr.lhs, input, environment);
        var lhs = input;
        var isTupleSort = input.tupleStream ? true : false;

        // sort the lhs array
        // use comparator function
        var comparator = function*(a, b) { // eslint-disable-line require-yield
            // expr.terms is an array of order-by in priority order
            var comp = 0;
            for(var index = 0; comp === 0 && index < expr.terms.length; index++) {
                var term = expr.terms[index];
                //evaluate the sort term in the context of a
                var context = a;
                var env = environment;
                if(isTupleSort) {
                    context = a['@'];
                    env = createFrameFromTuple(environment, a);
                }
                var aa = yield * evaluate(term.expression, context, env);
                //evaluate the sort term in the context of b
                context = b;
                env = environment;
                if(isTupleSort) {
                    context = b['@'];
                    env = createFrameFromTuple(environment, b);
                }
                var bb = yield * evaluate(term.expression, context, env);

                // type checks
                var atype = typeof aa;
                var btype = typeof bb;
                // undefined should be last in sort order
                if(atype === 'undefined') {
                    // swap them, unless btype is also undefined
                    comp = (btype === 'undefined') ? 0 : 1;
                    continue;
                }
                if(btype === 'undefined') {
                    comp = -1;
                    continue;
                }

                // if aa or bb are not string or numeric values, then throw an error
                if(!(atype === 'string' || atype === 'number') || !(btype === 'string' || btype === 'number')) {
                    throw {
                        code: "T2008",
                        stack: (new Error()).stack,
                        position: expr.position,
                        value: !(atype === 'string' || atype === 'number') ? aa : bb
                    };
                }

                //if aa and bb are not of the same type
                if(atype !== btype) {
                    throw {
                        code: "T2007",
                        stack: (new Error()).stack,
                        position: expr.position,
                        value: aa,
                        value2: bb
                    };
                }
                if(aa === bb) {
                    // both the same - move on to next term
                    continue;
                } else if (aa < bb) {
                    comp = -1;
                } else {
                    comp = 1;
                }
                if(term.descending === true) {
                    comp = -comp;
                }
            }
            // only swap a & b if comp equals 1
            return comp === 1;
        };

        var focus = {
            environment: environment,
            input: input
        };
        // the `focus` is passed in as the `this` for the invoked function
        result = yield * fn.sort.apply(focus, [lhs, comparator]);

        return result;
    }

    /**
     * create a transformer function
     * @param {Object} expr - AST for operator
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} tranformer function
     */
    function evaluateTransformExpression(expr, input, environment) {
        // create a function to implement the transform definition
        var transformer = function*(obj) { // signature <(oa):o>
            // undefined inputs always return undefined
            if(typeof obj === 'undefined') {
                return undefined;
            }

            // this function returns a copy of obj with changes specified by the pattern/operation
            var cloneFunction = environment.lookup('clone');
            if(!isFunction(cloneFunction)) {
                // throw type error
                throw {
                    code: "T2013",
                    stack: (new Error()).stack,
                    position: expr.position
                };
            }
            var result = yield * apply(cloneFunction, [obj], null, environment);
            var matches = yield * evaluate(expr.pattern, result, environment);
            if(typeof matches !== 'undefined') {
                if(!Array.isArray(matches)) {
                    matches = [matches];
                }
                for(var ii = 0; ii < matches.length; ii++) {
                    var match = matches[ii];
                    // evaluate the update value for each match
                    var update = yield * evaluate(expr.update, match, environment);
                    // update must be an object
                    var updateType = typeof update;
                    if(updateType !== 'undefined') {
                        if(updateType !== 'object' || update === null || Array.isArray(update)) {
                            // throw type error
                            throw {
                                code: "T2011",
                                stack: (new Error()).stack,
                                position: expr.update.position,
                                value: update
                            };
                        }
                        // merge the update
                        for(var prop in update) {
                            match[prop] = update[prop];
                        }
                    }

                    // delete, if specified, must be an array of strings (or single string)
                    if(typeof expr.delete !== 'undefined') {
                        var deletions = yield * evaluate(expr.delete, match, environment);
                        if(typeof deletions !== 'undefined') {
                            var val = deletions;
                            if (!Array.isArray(deletions)) {
                                deletions = [deletions];
                            }
                            if (!isArrayOfStrings(deletions)) {
                                // throw type error
                                throw {
                                    code: "T2012",
                                    stack: (new Error()).stack,
                                    position: expr.delete.position,
                                    value: val
                                };
                            }
                            for (var jj = 0; jj < deletions.length; jj++) {
                                if(typeof match === 'object' && match !== null) {
                                    delete match[deletions[jj]];
                                }
                            }
                        }
                    }
                }
            }

            return result;
        };

        return defineFunction(transformer, '<(oa):o>');
    }

    var chainAST = parser('function($f, $g) { function($x){ $g($f($x)) } }');

    /**
     * Apply the function on the RHS using the sequence on the LHS as the first argument
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluateApplyExpression(expr, input, environment) {
        var result;


        var lhs = yield * evaluate(expr.lhs, input, environment);
        if(expr.rhs.type === 'function') {
            // this is a function _invocation_; invoke it with lhs expression as the first argument
            result = yield * evaluateFunction(expr.rhs, input, environment, { context: lhs });
        } else {
            var func = yield * evaluate(expr.rhs, input, environment);

            if(!isFunction(func)) {
                throw {
                    code: "T2006",
                    stack: (new Error()).stack,
                    position: expr.position,
                    value: func
                };
            }

            if(isFunction(lhs)) {
                // this is function chaining (func1 ~> func2)
                // λ($f, $g) { λ($x){ $g($f($x)) } }
                var chain = yield * evaluate(chainAST, null, environment);
                result = yield * apply(chain, [lhs, func], null, environment);
            } else {
                result = yield * apply(func, [lhs], null, environment);
            }

        }

        return result;
    }

    /**
     * Evaluate function against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluateFunction(expr, input, environment, applyto) {
        var result;

        // create the procedure
        // can't assume that expr.procedure is a lambda type directly
        // could be an expression that evaluates to a function (e.g. variable reference, parens expr etc.
        // evaluate it generically first, then check that it is a function.  Throw error if not.
        var proc = yield * evaluate(expr.procedure, input, environment);

        if (typeof proc === 'undefined' && expr.procedure.type === 'path' && environment.lookup(expr.procedure.steps[0].value)) {
            // help the user out here if they simply forgot the leading $
            throw {
                code: "T1005",
                stack: (new Error()).stack,
                position: expr.position,
                token: expr.procedure.steps[0].value
            };
        }

        var evaluatedArgs = [];
        if(typeof applyto !== 'undefined') {
            evaluatedArgs.push(applyto.context);
        }
        // eager evaluation - evaluate the arguments
        for (var jj = 0; jj < expr.arguments.length; jj++) {
            const arg = yield* evaluate(expr.arguments[jj], input, environment);
            if(isFunction(arg)) {
                // wrap this in a closure
                const closure = function* (...params) {
                    // invoke func
                    return yield * apply(arg, params, null, environment);
                };
                closure.arity = getFunctionArity(arg);
                evaluatedArgs.push(closure);
            } else {
                evaluatedArgs.push(arg);
            }
        }
        // apply the procedure
        var procName = expr.procedure.type === 'path' ? expr.procedure.steps[0].value : expr.procedure.value;
        try {
            if(typeof proc === 'object') {
                proc.token = procName;
                proc.position = expr.position;
            }
            result = yield * apply(proc, evaluatedArgs, input, environment);
        } catch (err) {
            if(!err.position) {
                // add the position field to the error
                err.position = expr.position;
            }
            if (!err.token) {
                // and the function identifier
                err.token = procName;
            }
            throw err;
        }
        return result;
    }

    /**
     * Apply procedure or function
     * @param {Object} proc - Procedure
     * @param {Array} args - Arguments
     * @param {Object} input - input
     * @param {Object} environment - environment
     * @returns {*} Result of procedure
     */
    function* apply(proc, args, input, environment) {
        var result;
        result = yield * applyInner(proc, args, input, environment);
        while(isLambda(result) && result.thunk === true) {
            // trampoline loop - this gets invoked as a result of tail-call optimization
            // the function returned a tail-call thunk
            // unpack it, evaluate its arguments, and apply the tail call
            var next = yield * evaluate(result.body.procedure, result.input, result.environment);
            if(result.body.procedure.type === 'variable') {
                next.token = result.body.procedure.value;
            }
            next.position = result.body.procedure.position;
            var evaluatedArgs = [];
            for(var ii = 0; ii < result.body.arguments.length; ii++) {
                evaluatedArgs.push(yield * evaluate(result.body.arguments[ii], result.input, result.environment));
            }

            result = yield * applyInner(next, evaluatedArgs, input, environment);
        }
        return result;
    }

    /**
     * Apply procedure or function
     * @param {Object} proc - Procedure
     * @param {Array} args - Arguments
     * @param {Object} input - input
     * @param {Object} environment - environment
     * @returns {*} Result of procedure
     */
    function* applyInner(proc, args, input, environment) {
        var result;
        try {
            var validatedArgs = args;
            if (proc) {
                validatedArgs = validateArguments(proc.signature, args, input);
            }

            if (isLambda(proc)) {
                result = yield* applyProcedure(proc, validatedArgs);
            } else if (proc && proc._jsonata_function === true) {
                var focus = {
                    environment: environment,
                    input: input
                };
                // the `focus` is passed in as the `this` for the invoked function
                result = proc.implementation.apply(focus, validatedArgs);
                // `proc.implementation` might be a generator function
                // and `result` might be a generator - if so, yield
                if (isIterable(result)) {
                    result = yield* result;
                }
            } else if (typeof proc === 'function') {
                // typically these are functions that are returned by the invocation of plugin functions
                // the `input` is being passed in as the `this` for the invoked function
                // this is so that functions that return objects containing functions can chain
                // e.g. $func().next().next()
                result = proc.apply(input, validatedArgs);
                /* istanbul ignore next */
                if (isIterable(result)) {
                    result = yield* result;
                }
            } else {
                throw {
                    code: "T1006",
                    stack: (new Error()).stack
                };
            }
        } catch(err) {
            if(proc) {
                if (typeof err.token == 'undefined' && typeof proc.token !== 'undefined') {
                    err.token = proc.token;
                }
                err.position = proc.position;
            }
            throw err;
        }
        return result;
    }

    /**
     * Evaluate lambda against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {{lambda: boolean, input: *, environment: *, arguments: *, body: *}} Evaluated input data
     */
    function evaluateLambda(expr, input, environment) {
        // make a function (closure)
        var procedure = {
            _jsonata_lambda: true,
            input: input,
            environment: environment,
            arguments: expr.arguments,
            signature: expr.signature,
            body: expr.body
        };
        if(expr.thunk === true) {
            procedure.thunk = true;
        }
        procedure.apply = function*(self, args) {
            return yield * apply(procedure, args, input, self.environment);
        };
        return procedure;
    }

    /**
     * Evaluate partial application
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluatePartialApplication(expr, input, environment) {
        // partially apply a function
        var result;
        // evaluate the arguments
        var evaluatedArgs = [];
        for(var ii = 0; ii < expr.arguments.length; ii++) {
            var arg = expr.arguments[ii];
            if (arg.type === 'operator' && arg.value === '?') {
                evaluatedArgs.push(arg);
            } else {
                evaluatedArgs.push(yield * evaluate(arg, input, environment));
            }
        }
        // lookup the procedure
        var proc = yield * evaluate(expr.procedure, input, environment);
        if (typeof proc === 'undefined' && expr.procedure.type === 'path' && environment.lookup(expr.procedure.steps[0].value)) {
            // help the user out here if they simply forgot the leading $
            throw {
                code: "T1007",
                stack: (new Error()).stack,
                position: expr.position,
                token: expr.procedure.steps[0].value
            };
        }
        if (isLambda(proc)) {
            result = partialApplyProcedure(proc, evaluatedArgs);
        } else if (proc && proc._jsonata_function === true) {
            result = partialApplyNativeFunction(proc.implementation, evaluatedArgs);
        } else if (typeof proc === 'function') {
            result = partialApplyNativeFunction(proc, evaluatedArgs);
        } else {
            throw {
                code: "T1008",
                stack: (new Error()).stack,
                position: expr.position,
                token: expr.procedure.type === 'path' ? expr.procedure.steps[0].value : expr.procedure.value
            };
        }
        return result;
    }

    /**
     * Validate the arguments against the signature validator (if it exists)
     * @param {Function} signature - validator function
     * @param {Array} args - function arguments
     * @param {*} context - context value
     * @returns {Array} - validated arguments
     */
    function validateArguments(signature, args, context) {
        if(typeof signature === 'undefined') {
            // nothing to validate
            return args;
        }
        var validatedArgs = signature.validate(args, context);
        return validatedArgs;
    }

    /**
     * Apply procedure
     * @param {Object} proc - Procedure
     * @param {Array} args - Arguments
     * @returns {*} Result of procedure
     */
    function* applyProcedure(proc, args) {
        var result;
        var env = createFrame(proc.environment);
        proc.arguments.forEach(function (param, index) {
            env.bind(param.value, args[index]);
        });
        if (typeof proc.body === 'function') {
            // this is a lambda that wraps a native function - generated by partially evaluating a native
            result = yield * applyNativeFunction(proc.body, env);
        } else {
            result = yield * evaluate(proc.body, proc.input, env);
        }
        return result;
    }

    /**
     * Partially apply procedure
     * @param {Object} proc - Procedure
     * @param {Array} args - Arguments
     * @returns {{lambda: boolean, input: *, environment: {bind, lookup}, arguments: Array, body: *}} Result of partially applied procedure
     */
    function partialApplyProcedure(proc, args) {
        // create a closure, bind the supplied parameters and return a function that takes the remaining (?) parameters
        var env = createFrame(proc.environment);
        var unboundArgs = [];
        proc.arguments.forEach(function (param, index) {
            var arg = args[index];
            if (arg && arg.type === 'operator' && arg.value === '?') {
                unboundArgs.push(param);
            } else {
                env.bind(param.value, arg);
            }
        });
        var procedure = {
            _jsonata_lambda: true,
            input: proc.input,
            environment: env,
            arguments: unboundArgs,
            body: proc.body
        };
        return procedure;
    }

    /**
     * Partially apply native function
     * @param {Function} native - Native function
     * @param {Array} args - Arguments
     * @returns {{lambda: boolean, input: *, environment: {bind, lookup}, arguments: Array, body: *}} Result of partially applying native function
     */
    function partialApplyNativeFunction(native, args) {
        // create a lambda function that wraps and invokes the native function
        // get the list of declared arguments from the native function
        // this has to be picked out from the toString() value
        var sigArgs = getNativeFunctionArguments(native);
        sigArgs = sigArgs.map(function (sigArg) {
            return '$' + sigArg.trim();
        });
        var body = 'function(' + sigArgs.join(', ') + '){ _ }';

        var bodyAST = parser(body);
        bodyAST.body = native;

        var partial = partialApplyProcedure(bodyAST, args);
        return partial;
    }

    /**
     * Apply native function
     * @param {Object} proc - Procedure
     * @param {Object} env - Environment
     * @returns {*} Result of applying native function
     */
    function* applyNativeFunction(proc, env) {
        var sigArgs = getNativeFunctionArguments(proc);
        // generate the array of arguments for invoking the function - look them up in the environment
        var args = sigArgs.map(function (sigArg) {
            return env.lookup(sigArg.trim());
        });

        var focus = {
            environment: env
        };
        var result = proc.apply(focus, args);
        if(isIterable(result)) {
            result = yield * result;
        }
        return result;
    }

    /**
     * Get native function arguments
     * @param {Function} func - Function
     * @returns {*|Array} Native function arguments
     */
    function getNativeFunctionArguments(func) {
        var signature = func.toString();
        var sigParens = /\(([^)]*)\)/.exec(signature)[1]; // the contents of the parens
        var sigArgs = sigParens.split(',');
        return sigArgs;
    }

    /**
     * Creates a function definition
     * @param {Function} func - function implementation in Javascript
     * @param {string} signature - JSONata function signature definition
     * @returns {{implementation: *, signature: *}} function definition
     */
    function defineFunction(func, signature) {
        var definition = {
            _jsonata_function: true,
            implementation: func
        };
        if(typeof signature !== 'undefined') {
            definition.signature = parseSignature(signature);
        }
        return definition;
    }


    /**
     * parses and evaluates the supplied expression
     * @param {string} expr - expression to evaluate
     * @returns {*} - result of evaluating the expression
     */
    function* functionEval(expr, focus) {
        // undefined inputs always return undefined
        if(typeof expr === 'undefined') {
            return undefined;
        }
        var input = this.input;
        if(typeof focus !== 'undefined') {
            input = focus;
        }

        try {
            var ast = parser(expr, false);
        } catch(err) {
            // error parsing the expression passed to $eval
            populateMessage(err);
            throw {
                stack: (new Error()).stack,
                code: "D3120",
                value: err.message,
                error: err
            };
        }
        try {
            var result = yield* evaluate(ast, input, this.environment);
        } catch(err) {
            // error evaluating the expression passed to $eval
            populateMessage(err);
            throw {
                stack: (new Error()).stack,
                code: "D3121",
                value:err.message,
                error: err
            };
        }

        return result;
    }

    /**
     * Clones an object
     * @param {Object} arg - object to clone (deep copy)
     * @returns {*} - the cloned object
     */
    function functionClone(arg) {
        // undefined inputs always return undefined
        if(typeof arg === 'undefined') {
            return undefined;
        }

        return JSON.parse(fn.string(arg));
    }

    /**
     * Create frame
     * @param {Object} enclosingEnvironment - Enclosing environment
     * @returns {{bind: bind, lookup: lookup}} Created frame
     */
    function createFrame(enclosingEnvironment) {
        var bindings = {};
        return {
            bind: function (name, value) {
                bindings[name] = value;
            },
            lookup: function (name) {
                var value;
                if(bindings.hasOwnProperty(name)) {
                    value = bindings[name];
                } else if (enclosingEnvironment) {
                    value = enclosingEnvironment.lookup(name);
                }
                return value;
            },
            timestamp: enclosingEnvironment ? enclosingEnvironment.timestamp : null,
            async: enclosingEnvironment ? enclosingEnvironment.async : false,
            global: enclosingEnvironment ? enclosingEnvironment.global : {
                ancestry: [ null ]
            }
        };
    }

    // Function registration
    staticFrame.bind('sum', defineFunction(fn.sum, '<a<n>:n>'));
    staticFrame.bind('count', defineFunction(fn.count, '<a:n>'));
    staticFrame.bind('max', defineFunction(fn.max, '<a<n>:n>'));
    staticFrame.bind('min', defineFunction(fn.min, '<a<n>:n>'));
    staticFrame.bind('average', defineFunction(fn.average, '<a<n>:n>'));
    staticFrame.bind('string', defineFunction(fn.string, '<x-b?:s>'));
    staticFrame.bind('substring', defineFunction(fn.substring, '<s-nn?:s>'));
    staticFrame.bind('substringBefore', defineFunction(fn.substringBefore, '<s-s:s>'));
    staticFrame.bind('substringAfter', defineFunction(fn.substringAfter, '<s-s:s>'));
    staticFrame.bind('lowercase', defineFunction(fn.lowercase, '<s-:s>'));
    staticFrame.bind('uppercase', defineFunction(fn.uppercase, '<s-:s>'));
    staticFrame.bind('length', defineFunction(fn.length, '<s-:n>'));
    staticFrame.bind('trim', defineFunction(fn.trim, '<s-:s>'));
    staticFrame.bind('pad', defineFunction(fn.pad, '<s-ns?:s>'));
    staticFrame.bind('match', defineFunction(fn.match, '<s-f<s:o>n?:a<o>>'));
    staticFrame.bind('contains', defineFunction(fn.contains, '<s-(sf):b>')); // TODO <s-(sf<s:o>):b>
    staticFrame.bind('replace', defineFunction(fn.replace, '<s-(sf)(sf)n?:s>')); // TODO <s-(sf<s:o>)(sf<o:s>)n?:s>
    staticFrame.bind('split', defineFunction(fn.split, '<s-(sf)n?:a<s>>')); // TODO <s-(sf<s:o>)n?:a<s>>
    staticFrame.bind('join', defineFunction(fn.join, '<a<s>s?:s>'));
    staticFrame.bind('formatNumber', defineFunction(fn.formatNumber, '<n-so?:s>'));
    staticFrame.bind('formatBase', defineFunction(fn.formatBase, '<n-n?:s>'));
    staticFrame.bind('formatInteger', defineFunction(datetime.formatInteger, '<n-s:s>'));
    staticFrame.bind('parseInteger', defineFunction(datetime.parseInteger, '<s-s:n>'));
    staticFrame.bind('number', defineFunction(fn.number, '<(nsb)-:n>'));
    staticFrame.bind('floor', defineFunction(fn.floor, '<n-:n>'));
    staticFrame.bind('ceil', defineFunction(fn.ceil, '<n-:n>'));
    staticFrame.bind('round', defineFunction(fn.round, '<n-n?:n>'));
    staticFrame.bind('abs', defineFunction(fn.abs, '<n-:n>'));
    staticFrame.bind('sqrt', defineFunction(fn.sqrt, '<n-:n>'));
    staticFrame.bind('power', defineFunction(fn.power, '<n-n:n>'));
    staticFrame.bind('random', defineFunction(fn.random, '<:n>'));
    staticFrame.bind('boolean', defineFunction(fn.boolean, '<x-:b>'));
    staticFrame.bind('not', defineFunction(fn.not, '<x-:b>'));
    staticFrame.bind('map', defineFunction(fn.map, '<af>'));
    staticFrame.bind('zip', defineFunction(fn.zip, '<a+>'));
    staticFrame.bind('filter', defineFunction(fn.filter, '<af>'));
    staticFrame.bind('single', defineFunction(fn.single, '<af?>'));
    staticFrame.bind('reduce', defineFunction(fn.foldLeft, '<afj?:j>')); // TODO <f<jj:j>a<j>j?:j>
    staticFrame.bind('sift', defineFunction(fn.sift, '<o-f?:o>'));
    staticFrame.bind('keys', defineFunction(fn.keys, '<x-:a<s>>'));
    staticFrame.bind('lookup', defineFunction(fn.lookup, '<x-s:x>'));
    staticFrame.bind('append', defineFunction(fn.append, '<xx:a>'));
    staticFrame.bind('exists', defineFunction(fn.exists, '<x:b>'));
    staticFrame.bind('spread', defineFunction(fn.spread, '<x-:a<o>>'));
    staticFrame.bind('merge', defineFunction(fn.merge, '<a<o>:o>'));
    staticFrame.bind('reverse', defineFunction(fn.reverse, '<a:a>'));
    staticFrame.bind('each', defineFunction(fn.each, '<o-f:a>'));
    staticFrame.bind('error', defineFunction(fn.error, '<s?:x>'));
    staticFrame.bind('assert', defineFunction(fn.assert, '<bs?:x>'));
    staticFrame.bind('type', defineFunction(fn.type, '<x:s>'));
    staticFrame.bind('sort', defineFunction(fn.sort, '<af?:a>'));
    staticFrame.bind('shuffle', defineFunction(fn.shuffle, '<a:a>'));
    staticFrame.bind('distinct', defineFunction(fn.distinct, '<x:x>'));
    staticFrame.bind('base64encode', defineFunction(fn.base64encode, '<s-:s>'));
    staticFrame.bind('base64decode', defineFunction(fn.base64decode, '<s-:s>'));
    staticFrame.bind('encodeUrlComponent', defineFunction(fn.encodeUrlComponent, '<s-:s>'));
    staticFrame.bind('encodeUrl', defineFunction(fn.encodeUrl, '<s-:s>'));
    staticFrame.bind('decodeUrlComponent', defineFunction(fn.decodeUrlComponent, '<s-:s>'));
    staticFrame.bind('decodeUrl', defineFunction(fn.decodeUrl, '<s-:s>'));
    staticFrame.bind('eval', defineFunction(functionEval, '<sx?:x>'));
    staticFrame.bind('toMillis', defineFunction(datetime.toMillis, '<s-s?:n>'));
    staticFrame.bind('fromMillis', defineFunction(datetime.fromMillis, '<n-s?s?:s>'));
    staticFrame.bind('clone', defineFunction(functionClone, '<(oa)-:o>'));

    /**
     * Error codes
     *
     * Sxxxx    - Static errors (compile time)
     * Txxxx    - Type errors
     * Dxxxx    - Dynamic errors (evaluate time)
     *  01xx    - tokenizer
     *  02xx    - parser
     *  03xx    - regex parser
     *  04xx    - function signature parser/evaluator
     *  10xx    - evaluator
     *  20xx    - operators
     *  3xxx    - functions (blocks of 10 for each function)
     */
    var errorCodes = {
        "S0101": "String literal must be terminated by a matching quote",
        "S0102": "Number out of range: {{token}}",
        "S0103": "Unsupported escape sequence: \\{{token}}",
        "S0104": "The escape sequence \\u must be followed by 4 hex digits",
        "S0105": "Quoted property name must be terminated with a backquote (`)",
        "S0106": "Comment has no closing tag",
        "S0201": "Syntax error: {{token}}",
        "S0202": "Expected {{value}}, got {{token}}",
        "S0203": "Expected {{value}} before end of expression",
        "S0204": "Unknown operator: {{token}}",
        "S0205": "Unexpected token: {{token}}",
        "S0206": "Unknown expression type: {{token}}",
        "S0207": "Unexpected end of expression",
        "S0208": "Parameter {{value}} of function definition must be a variable name (start with $)",
        "S0209": "A predicate cannot follow a grouping expression in a step",
        "S0210": "Each step can only have one grouping expression",
        "S0211": "The symbol {{token}} cannot be used as a unary operator",
        "S0212": "The left side of := must be a variable name (start with $)",
        "S0213": "The literal value {{value}} cannot be used as a step within a path expression",
        "S0214": "The right side of {{token}} must be a variable name (start with $)",
        "S0215": "A context variable binding must precede any predicates on a step",
        "S0216": "A context variable binding must precede the 'order-by' clause on a step",
        "S0217": "The object representing the 'parent' cannot be derived from this expression",
        "S0301": "Empty regular expressions are not allowed",
        "S0302": "No terminating / in regular expression",
        "S0402": "Choice groups containing parameterized types are not supported",
        "S0401": "Type parameters can only be applied to functions and arrays",
        "S0500": "Attempted to evaluate an expression containing syntax error(s)",
        "T0410": "Argument {{index}} of function {{token}} does not match function signature",
        "T0411": "Context value is not a compatible type with argument {{index}} of function {{token}}",
        "T0412": "Argument {{index}} of function {{token}} must be an array of {{type}}",
        "D1001": "Number out of range: {{value}}",
        "D1002": "Cannot negate a non-numeric value: {{value}}",
        "T1003": "Key in object structure must evaluate to a string; got: {{value}}",
        "D1004": "Regular expression matches zero length string",
        "T1005": "Attempted to invoke a non-function. Did you mean ${{{token}}}?",
        "T1006": "Attempted to invoke a non-function",
        "T1007": "Attempted to partially apply a non-function. Did you mean ${{{token}}}?",
        "T1008": "Attempted to partially apply a non-function",
        "D1009": "Multiple key definitions evaluate to same key: {{value}}",
        "T1010": "The matcher function argument passed to function {{token}} does not return the correct object structure",
        "T2001": "The left side of the {{token}} operator must evaluate to a number",
        "T2002": "The right side of the {{token}} operator must evaluate to a number",
        "T2003": "The left side of the range operator (..) must evaluate to an integer",
        "T2004": "The right side of the range operator (..) must evaluate to an integer",
        "D2005": "The left side of := must be a variable name (start with $)",  // defunct - replaced by S0212 parser error
        "T2006": "The right side of the function application operator ~> must be a function",
        "T2007": "Type mismatch when comparing values {{value}} and {{value2}} in order-by clause",
        "T2008": "The expressions within an order-by clause must evaluate to numeric or string values",
        "T2009": "The values {{value}} and {{value2}} either side of operator {{token}} must be of the same data type",
        "T2010": "The expressions either side of operator {{token}} must evaluate to numeric or string values",
        "T2011": "The insert/update clause of the transform expression must evaluate to an object: {{value}}",
        "T2012": "The delete clause of the transform expression must evaluate to a string or array of strings: {{value}}",
        "T2013": "The transform expression clones the input object using the $clone() function.  This has been overridden in the current scope by a non-function.",
        "D2014": "The size of the sequence allocated by the range operator (..) must not exceed 1e6.  Attempted to allocate {{value}}.",
        "D3001": "Attempting to invoke string function on Infinity or NaN",
        "D3010": "Second argument of replace function cannot be an empty string",
        "D3011": "Fourth argument of replace function must evaluate to a positive number",
        "D3012": "Attempted to replace a matched string with a non-string value",
        "D3020": "Third argument of split function must evaluate to a positive number",
        "D3030": "Unable to cast value to a number: {{value}}",
        "D3040": "Third argument of match function must evaluate to a positive number",
        "D3050": "The second argument of reduce function must be a function with at least two arguments",
        "D3060": "The sqrt function cannot be applied to a negative number: {{value}}",
        "D3061": "The power function has resulted in a value that cannot be represented as a JSON number: base={{value}}, exponent={{exp}}",
        "D3070": "The single argument form of the sort function can only be applied to an array of strings or an array of numbers.  Use the second argument to specify a comparison function",
        "D3080": "The picture string must only contain a maximum of two sub-pictures",
        "D3081": "The sub-picture must not contain more than one instance of the 'decimal-separator' character",
        "D3082": "The sub-picture must not contain more than one instance of the 'percent' character",
        "D3083": "The sub-picture must not contain more than one instance of the 'per-mille' character",
        "D3084": "The sub-picture must not contain both a 'percent' and a 'per-mille' character",
        "D3085": "The mantissa part of a sub-picture must contain at least one character that is either an 'optional digit character' or a member of the 'decimal digit family'",
        "D3086": "The sub-picture must not contain a passive character that is preceded by an active character and that is followed by another active character",
        "D3087": "The sub-picture must not contain a 'grouping-separator' character that appears adjacent to a 'decimal-separator' character",
        "D3088": "The sub-picture must not contain a 'grouping-separator' at the end of the integer part",
        "D3089": "The sub-picture must not contain two adjacent instances of the 'grouping-separator' character",
        "D3090": "The integer part of the sub-picture must not contain a member of the 'decimal digit family' that is followed by an instance of the 'optional digit character'",
        "D3091": "The fractional part of the sub-picture must not contain an instance of the 'optional digit character' that is followed by a member of the 'decimal digit family'",
        "D3092": "A sub-picture that contains a 'percent' or 'per-mille' character must not contain a character treated as an 'exponent-separator'",
        "D3093": "The exponent part of the sub-picture must comprise only of one or more characters that are members of the 'decimal digit family'",
        "D3100": "The radix of the formatBase function must be between 2 and 36.  It was given {{value}}",
        "D3110": "The argument of the toMillis function must be an ISO 8601 formatted timestamp. Given {{value}}",
        "D3120": "Syntax error in expression passed to function eval: {{value}}",
        "D3121": "Dynamic error evaluating the expression passed to function eval: {{value}}",
        "D3130": "Formatting or parsing an integer as a sequence starting with {{value}} is not supported by this implementation",
        "D3131": "In a decimal digit pattern, all digits must be from the same decimal group",
        "D3132": "Unknown component specifier {{value}} in date/time picture string",
        "D3133": "The 'name' modifier can only be applied to months and days in the date/time picture string, not {{value}}",
        "D3134": "The timezone integer format specifier cannot have more than four digits",
        "D3135": "No matching closing bracket ']' in date/time picture string",
        "D3136": "The date/time picture string is missing specifiers required to parse the timestamp",
        "D3137": "{{{message}}}",
        "D3138": "The $single() function expected exactly 1 matching result.  Instead it matched more.",
        "D3139": "The $single() function expected exactly 1 matching result.  Instead it matched 0.",
        "D3140": "Malformed URL passed to ${{{functionName}}}(): {{value}}",
        "D3141": "{{{message}}}"
    };

    /**
     * lookup a message template from the catalog and substitute the inserts.
     * Populates `err.message` with the substituted message. Leaves `err.message`
     * untouched if code lookup fails.
     * @param {string} err - error code to lookup
     * @returns {undefined} - `err` is modified in place
     */
    function populateMessage(err) {
        var template = errorCodes[err.code];
        if(typeof template !== 'undefined') {
            // if there are any handlebars, replace them with the field references
            // triple braces - replace with value
            // double braces - replace with json stringified value
            var message = template.replace(/\{\{\{([^}]+)}}}/g, function() {
                return err[arguments[1]];
            });
            message = message.replace(/\{\{([^}]+)}}/g, function() {
                return JSON.stringify(err[arguments[1]]);
            });
            err.message = message;
        }
        // Otherwise retain the original `err.message`
    }

    /**
     * JSONata
     * @param {Object} expr - JSONata expression
     * @param {boolean} options - recover: attempt to recover on parse error
     * @returns {{evaluate: evaluate, assign: assign}} Evaluated expression
     */
    function jsonata(expr, options) {
        var ast;
        var errors;
        try {
            ast = parser(expr, options && options.recover);
            errors = ast.errors;
            delete ast.errors;
        } catch(err) {
            // insert error message into structure
            populateMessage(err); // possible side-effects on `err`
            throw err;
        }
        var environment = createFrame(staticFrame);

        var timestamp = new Date(); // will be overridden on each call to evalute()
        environment.bind('now', defineFunction(function(picture, timezone) {
            return datetime.fromMillis(timestamp.getTime(), picture, timezone);
        }, '<s?s?:s>'));
        environment.bind('millis', defineFunction(function() {
            return timestamp.getTime();
        }, '<:n>'));

        return {
            evaluate: function (input, bindings, callback) {
                // throw if the expression compiled with syntax errors
                if(typeof errors !== 'undefined') {
                    var err = {
                        code: 'S0500',
                        position: 0
                    };
                    populateMessage(err); // possible side-effects on `err`
                    throw err;
                }

                if (typeof bindings !== 'undefined') {
                    var exec_env;
                    // the variable bindings have been passed in - create a frame to hold these
                    exec_env = createFrame(environment);
                    for (var v in bindings) {
                        exec_env.bind(v, bindings[v]);
                    }
                } else {
                    exec_env = environment;
                }
                // put the input document into the environment as the root object
                exec_env.bind('$', input);

                // capture the timestamp and put it in the execution environment
                // the $now() and $millis() functions will return this value - whenever it is called
                timestamp = new Date();
                exec_env.timestamp = timestamp;

                // if the input is a JSON array, then wrap it in a singleton sequence so it gets treated as a single input
                if(Array.isArray(input) && !isSequence(input)) {
                    input = createSequence(input);
                    input.outerWrapper = true;
                }

                var result, it;
                // if a callback function is supplied, then drive the generator in a promise chain
                if(typeof callback === 'function') {
                    exec_env.async = true;
                    var catchHandler = function (err) {
                        populateMessage(err); // possible side-effects on `err`
                        callback(err, null);
                    };
                    var thenHandler = function (response) {
                        result = it.next(response);
                        if (result.done) {
                            callback(null, result.value);
                        } else {
                            result.value.then(thenHandler).catch(catchHandler);
                        }
                    };
                    it = evaluate(ast, input, exec_env);
                    result = it.next();
                    result.value.then(thenHandler).catch(catchHandler);
                } else {
                    // no callback function - drive the generator to completion synchronously
                    try {
                        it = evaluate(ast, input, exec_env);
                        result = it.next();
                        while (!result.done) {
                            result = it.next(result.value);
                        }
                        return result.value;
                    } catch (err) {
                        // insert error message into structure
                        populateMessage(err); // possible side-effects on `err`
                        throw err;
                    }
                }
            },
            assign: function (name, value) {
                environment.bind(name, value);
            },
            registerFunction: function(name, implementation, signature) {
                var func = defineFunction(implementation, signature);
                environment.bind(name, func);
            },
            ast: function() {
                return ast;
            },
            errors: function() {
                return errors;
            }
        };
    }

    jsonata.parser = parser; // TODO remove this in a future release - use ast() instead

    return jsonata;

})();

module.exports = jsonata;

},{"./datetime":1,"./functions":2,"./parser":4,"./signature":5,"./utils":6}],4:[function(require,module,exports){
/**
 * © Copyright IBM Corp. 2016, 2018 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

var parseSignature = require('./signature');

const parser = (() => {
    'use strict';

    var operators = {
        '.': 75,
        '[': 80,
        ']': 0,
        '{': 70,
        '}': 0,
        '(': 80,
        ')': 0,
        ',': 0,
        '@': 80,
        '#': 80,
        ';': 80,
        ':': 80,
        '?': 20,
        '+': 50,
        '-': 50,
        '*': 60,
        '/': 60,
        '%': 60,
        '|': 20,
        '=': 40,
        '<': 40,
        '>': 40,
        '^': 40,
        '**': 60,
        '..': 20,
        ':=': 10,
        '!=': 40,
        '<=': 40,
        '>=': 40,
        '~>': 40,
        'and': 30,
        'or': 25,
        'in': 40,
        '&': 50,
        '!': 0,   // not an operator, but needed as a stop character for name tokens
        '~': 0   // not an operator, but needed as a stop character for name tokens
    };

    var escapes = {  // JSON string escape sequences - see json.org
        '"': '"',
        '\\': '\\',
        '/': '/',
        'b': '\b',
        'f': '\f',
        'n': '\n',
        'r': '\r',
        't': '\t'
    };

    // Tokenizer (lexer) - invoked by the parser to return one token at a time
    var tokenizer = function (path) {
        var position = 0;
        var length = path.length;

        var create = function (type, value) {
            var obj = {type: type, value: value, position: position};
            return obj;
        };

        var scanRegex = function () {
            // the prefix '/' will have been previously scanned. Find the end of the regex.
            // search for closing '/' ignoring any that are escaped, or within brackets
            var start = position;
            var depth = 0;
            var pattern;
            var flags;
            while (position < length) {
                var currentChar = path.charAt(position);
                if (currentChar === '/' && path.charAt(position - 1) !== '\\' && depth === 0) {
                    // end of regex found
                    pattern = path.substring(start, position);
                    if (pattern === '') {
                        throw {
                            code: "S0301",
                            stack: (new Error()).stack,
                            position: position
                        };
                    }
                    position++;
                    currentChar = path.charAt(position);
                    // flags
                    start = position;
                    while (currentChar === 'i' || currentChar === 'm') {
                        position++;
                        currentChar = path.charAt(position);
                    }
                    flags = path.substring(start, position) + 'g';
                    return new RegExp(pattern, flags);
                }
                if ((currentChar === '(' || currentChar === '[' || currentChar === '{') && path.charAt(position - 1) !== '\\') {
                    depth++;
                }
                if ((currentChar === ')' || currentChar === ']' || currentChar === '}') && path.charAt(position - 1) !== '\\') {
                    depth--;
                }

                position++;
            }
            throw {
                code: "S0302",
                stack: (new Error()).stack,
                position: position
            };
        };

        var next = function (prefix) {
            if (position >= length) return null;
            var currentChar = path.charAt(position);
            // skip whitespace
            while (position < length && ' \t\n\r\v'.indexOf(currentChar) > -1) {
                position++;
                currentChar = path.charAt(position);
            }
            // skip comments
            if (currentChar === '/' && path.charAt(position + 1) === '*') {
                var commentStart = position;
                position += 2;
                currentChar = path.charAt(position);
                while (!(currentChar === '*' && path.charAt(position + 1) === '/')) {
                    currentChar = path.charAt(++position);
                    if (position >= length) {
                        // no closing tag
                        throw {
                            code: "S0106",
                            stack: (new Error()).stack,
                            position: commentStart
                        };
                    }
                }
                position += 2;
                currentChar = path.charAt(position);
                return next(prefix); // need this to swallow any following whitespace
            }
            // test for regex
            if (prefix !== true && currentChar === '/') {
                position++;
                return create('regex', scanRegex());
            }
            // handle double-char operators
            if (currentChar === '.' && path.charAt(position + 1) === '.') {
                // double-dot .. range operator
                position += 2;
                return create('operator', '..');
            }
            if (currentChar === ':' && path.charAt(position + 1) === '=') {
                // := assignment
                position += 2;
                return create('operator', ':=');
            }
            if (currentChar === '!' && path.charAt(position + 1) === '=') {
                // !=
                position += 2;
                return create('operator', '!=');
            }
            if (currentChar === '>' && path.charAt(position + 1) === '=') {
                // >=
                position += 2;
                return create('operator', '>=');
            }
            if (currentChar === '<' && path.charAt(position + 1) === '=') {
                // <=
                position += 2;
                return create('operator', '<=');
            }
            if (currentChar === '*' && path.charAt(position + 1) === '*') {
                // **  descendant wildcard
                position += 2;
                return create('operator', '**');
            }
            if (currentChar === '~' && path.charAt(position + 1) === '>') {
                // ~>  chain function
                position += 2;
                return create('operator', '~>');
            }
            // test for single char operators
            if (Object.prototype.hasOwnProperty.call(operators, currentChar)) {
                position++;
                return create('operator', currentChar);
            }
            // test for string literals
            if (currentChar === '"' || currentChar === "'") {
                var quoteType = currentChar;
                // double quoted string literal - find end of string
                position++;
                var qstr = "";
                while (position < length) {
                    currentChar = path.charAt(position);
                    if (currentChar === '\\') { // escape sequence
                        position++;
                        currentChar = path.charAt(position);
                        if (Object.prototype.hasOwnProperty.call(escapes, currentChar)) {
                            qstr += escapes[currentChar];
                        } else if (currentChar === 'u') {
                            // \u should be followed by 4 hex digits
                            var octets = path.substr(position + 1, 4);
                            if (/^[0-9a-fA-F]+$/.test(octets)) {
                                var codepoint = parseInt(octets, 16);
                                qstr += String.fromCharCode(codepoint);
                                position += 4;
                            } else {
                                throw {
                                    code: "S0104",
                                    stack: (new Error()).stack,
                                    position: position
                                };
                            }
                        } else {
                            // illegal escape sequence
                            throw {
                                code: "S0103",
                                stack: (new Error()).stack,
                                position: position,
                                token: currentChar
                            };

                        }
                    } else if (currentChar === quoteType) {
                        position++;
                        return create('string', qstr);
                    } else {
                        qstr += currentChar;
                    }
                    position++;
                }
                throw {
                    code: "S0101",
                    stack: (new Error()).stack,
                    position: position
                };
            }
            // test for numbers
            var numregex = /^-?(0|([1-9][0-9]*))(\.[0-9]+)?([Ee][-+]?[0-9]+)?/;
            var match = numregex.exec(path.substring(position));
            if (match !== null) {
                var num = parseFloat(match[0]);
                if (!isNaN(num) && isFinite(num)) {
                    position += match[0].length;
                    return create('number', num);
                } else {
                    throw {
                        code: "S0102",
                        stack: (new Error()).stack,
                        position: position,
                        token: match[0]
                    };
                }
            }
            // test for quoted names (backticks)
            var name;
            if (currentChar === '`') {
                // scan for closing quote
                position++;
                var end = path.indexOf('`', position);
                if (end !== -1) {
                    name = path.substring(position, end);
                    position = end + 1;
                    return create('name', name);
                }
                position = length;
                throw {
                    code: "S0105",
                    stack: (new Error()).stack,
                    position: position
                };
            }
            // test for names
            var i = position;
            var ch;
            for (; ;) {
                ch = path.charAt(i);
                if (i === length || ' \t\n\r\v'.indexOf(ch) > -1 || Object.prototype.hasOwnProperty.call(operators, ch)) {
                    if (path.charAt(position) === '$') {
                        // variable reference
                        name = path.substring(position + 1, i);
                        position = i;
                        return create('variable', name);
                    } else {
                        name = path.substring(position, i);
                        position = i;
                        switch (name) {
                            case 'or':
                            case 'in':
                            case 'and':
                                return create('operator', name);
                            case 'true':
                                return create('value', true);
                            case 'false':
                                return create('value', false);
                            case 'null':
                                return create('value', null);
                            default:
                                if (position === length && name === '') {
                                    // whitespace at end of input
                                    return null;
                                }
                                return create('name', name);
                        }
                    }
                } else {
                    i++;
                }
            }
        };

        return next;
    };

    // This parser implements the 'Top down operator precedence' algorithm developed by Vaughan R Pratt; http://dl.acm.org/citation.cfm?id=512931.
    // and builds on the Javascript framework described by Douglas Crockford at http://javascript.crockford.com/tdop/tdop.html
    // and in 'Beautiful Code', edited by Andy Oram and Greg Wilson, Copyright 2007 O'Reilly Media, Inc. 798-0-596-51004-6

    var parser = function (source, recover) {
        var node;
        var lexer;

        var symbol_table = {};
        var errors = [];

        var remainingTokens = function () {
            var remaining = [];
            if (node.id !== '(end)') {
                remaining.push({type: node.type, value: node.value, position: node.position});
            }
            var nxt = lexer();
            while (nxt !== null) {
                remaining.push(nxt);
                nxt = lexer();
            }
            return remaining;
        };

        var base_symbol = {
            nud: function () {
                // error - symbol has been invoked as a unary operator
                var err = {
                    code: 'S0211',
                    token: this.value,
                    position: this.position
                };

                if (recover) {
                    err.remaining = remainingTokens();
                    err.type = 'error';
                    errors.push(err);
                    return err;
                } else {
                    err.stack = (new Error()).stack;
                    throw err;
                }
            }
        };

        var symbol = function (id, bp) {
            var s = symbol_table[id];
            bp = bp || 0;
            if (s) {
                if (bp >= s.lbp) {
                    s.lbp = bp;
                }
            } else {
                s = Object.create(base_symbol);
                s.id = s.value = id;
                s.lbp = bp;
                symbol_table[id] = s;
            }
            return s;
        };

        var handleError = function (err) {
            if (recover) {
                // tokenize the rest of the buffer and add it to an error token
                err.remaining = remainingTokens();
                errors.push(err);
                var symbol = symbol_table["(error)"];
                node = Object.create(symbol);
                node.error = err;
                node.type = "(error)";
                return node;
            } else {
                err.stack = (new Error()).stack;
                throw err;
            }
        };

        var advance = function (id, infix) {
            if (id && node.id !== id) {
                var code;
                if (node.id === '(end)') {
                    // unexpected end of buffer
                    code = "S0203";
                } else {
                    code = "S0202";
                }
                var err = {
                    code: code,
                    position: node.position,
                    token: node.value,
                    value: id
                };
                return handleError(err);
            }
            var next_token = lexer(infix);
            if (next_token === null) {
                node = symbol_table["(end)"];
                node.position = source.length;
                return node;
            }
            var value = next_token.value;
            var type = next_token.type;
            var symbol;
            switch (type) {
                case 'name':
                case 'variable':
                    symbol = symbol_table["(name)"];
                    break;
                case 'operator':
                    symbol = symbol_table[value];
                    if (!symbol) {
                        return handleError({
                            code: "S0204",
                            stack: (new Error()).stack,
                            position: next_token.position,
                            token: value
                        });
                    }
                    break;
                case 'string':
                case 'number':
                case 'value':
                    symbol = symbol_table["(literal)"];
                    break;
                case 'regex':
                    type = "regex";
                    symbol = symbol_table["(regex)"];
                    break;
                /* istanbul ignore next */
                default:
                    return handleError({
                        code: "S0205",
                        stack: (new Error()).stack,
                        position: next_token.position,
                        token: value
                    });
            }

            node = Object.create(symbol);
            node.value = value;
            node.type = type;
            node.position = next_token.position;
            return node;
        };

        // Pratt's algorithm
        var expression = function (rbp) {
            var left;
            var t = node;
            advance(null, true);
            left = t.nud();
            while (rbp < node.lbp) {
                t = node;
                advance();
                left = t.led(left);
            }
            return left;
        };

        var terminal = function (id) {
            var s = symbol(id, 0);
            s.nud = function () {
                return this;
            };
        };

        // match infix operators
        // <expression> <operator> <expression>
        // left associative
        var infix = function (id, bp, led) {
            var bindingPower = bp || operators[id];
            var s = symbol(id, bindingPower);
            s.led = led || function (left) {
                this.lhs = left;
                this.rhs = expression(bindingPower);
                this.type = "binary";
                return this;
            };
            return s;
        };

        // match infix operators
        // <expression> <operator> <expression>
        // right associative
        var infixr = function (id, bp, led) {
            var s = symbol(id, bp);
            s.led = led;
            return s;
        };

        // match prefix operators
        // <operator> <expression>
        var prefix = function (id, nud) {
            var s = symbol(id);
            s.nud = nud || function () {
                this.expression = expression(70);
                this.type = "unary";
                return this;
            };
            return s;
        };

        terminal("(end)");
        terminal("(name)");
        terminal("(literal)");
        terminal("(regex)");
        symbol(":");
        symbol(";");
        symbol(",");
        symbol(")");
        symbol("]");
        symbol("}");
        symbol(".."); // range operator
        infix("."); // map operator
        infix("+"); // numeric addition
        infix("-"); // numeric subtraction
        infix("*"); // numeric multiplication
        infix("/"); // numeric division
        infix("%"); // numeric modulus
        infix("="); // equality
        infix("<"); // less than
        infix(">"); // greater than
        infix("!="); // not equal to
        infix("<="); // less than or equal
        infix(">="); // greater than or equal
        infix("&"); // string concatenation
        infix("and"); // Boolean AND
        infix("or"); // Boolean OR
        infix("in"); // is member of array
        terminal("and"); // the 'keywords' can also be used as terminals (field names)
        terminal("or"); //
        terminal("in"); //
        prefix("-"); // unary numeric negation
        infix("~>"); // function application

        infixr("(error)", 10, function (left) {
            this.lhs = left;

            this.error = node.error;
            this.remaining = remainingTokens();
            this.type = 'error';
            return this;
        });

        // field wildcard (single level)
        prefix('*', function () {
            this.type = "wildcard";
            return this;
        });

        // descendant wildcard (multi-level)
        prefix('**', function () {
            this.type = "descendant";
            return this;
        });

        // parent operator
        prefix('%', function () {
            this.type = "parent";
            return this;
        });

        // function invocation
        infix("(", operators['('], function (left) {
            // left is is what we are trying to invoke
            this.procedure = left;
            this.type = 'function';
            this.arguments = [];
            if (node.id !== ')') {
                for (; ;) {
                    if (node.type === 'operator' && node.id === '?') {
                        // partial function application
                        this.type = 'partial';
                        this.arguments.push(node);
                        advance('?');
                    } else {
                        this.arguments.push(expression(0));
                    }
                    if (node.id !== ',') break;
                    advance(',');
                }
            }
            advance(")", true);
            // if the name of the function is 'function' or λ, then this is function definition (lambda function)
            if (left.type === 'name' && (left.value === 'function' || left.value === '\u03BB')) {
                // all of the args must be VARIABLE tokens
                this.arguments.forEach(function (arg, index) {
                    if (arg.type !== 'variable') {
                        return handleError({
                            code: "S0208",
                            stack: (new Error()).stack,
                            position: arg.position,
                            token: arg.value,
                            value: index + 1
                        });
                    }
                });
                this.type = 'lambda';
                // is the next token a '<' - if so, parse the function signature
                if (node.id === '<') {
                    var sigPos = node.position;
                    var depth = 1;
                    var sig = '<';
                    while (depth > 0 && node.id !== '{' && node.id !== '(end)') {
                        var tok = advance();
                        if (tok.id === '>') {
                            depth--;
                        } else if (tok.id === '<') {
                            depth++;
                        }
                        sig += tok.value;
                    }
                    advance('>');
                    try {
                        this.signature = parseSignature(sig);
                    } catch (err) {
                        // insert the position into this error
                        err.position = sigPos + err.offset;
                        return handleError(err);
                    }
                }
                // parse the function body
                advance('{');
                this.body = expression(0);
                advance('}');
            }
            return this;
        });

        // parenthesis - block expression
        prefix("(", function () {
            var expressions = [];
            while (node.id !== ")") {
                expressions.push(expression(0));
                if (node.id !== ";") {
                    break;
                }
                advance(";");
            }
            advance(")", true);
            this.type = 'block';
            this.expressions = expressions;
            return this;
        });

        // array constructor
        prefix("[", function () {
            var a = [];
            if (node.id !== "]") {
                for (; ;) {
                    var item = expression(0);
                    if (node.id === "..") {
                        // range operator
                        var range = {type: "binary", value: "..", position: node.position, lhs: item};
                        advance("..");
                        range.rhs = expression(0);
                        item = range;
                    }
                    a.push(item);
                    if (node.id !== ",") {
                        break;
                    }
                    advance(",");
                }
            }
            advance("]", true);
            this.expressions = a;
            this.type = "unary";
            return this;
        });

        // filter - predicate or array index
        infix("[", operators['['], function (left) {
            if (node.id === "]") {
                // empty predicate means maintain singleton arrays in the output
                var step = left;
                while (step && step.type === 'binary' && step.value === '[') {
                    step = step.lhs;
                }
                step.keepArray = true;
                advance("]");
                return left;
            } else {
                this.lhs = left;
                this.rhs = expression(operators[']']);
                this.type = 'binary';
                advance("]", true);
                return this;
            }
        });

        // order-by
        infix("^", operators['^'], function (left) {
            advance("(");
            var terms = [];
            for (; ;) {
                var term = {
                    descending: false
                };
                if (node.id === "<") {
                    // ascending sort
                    advance("<");
                } else if (node.id === ">") {
                    // descending sort
                    term.descending = true;
                    advance(">");
                } else {
                    //unspecified - default to ascending
                }
                term.expression = expression(0);
                terms.push(term);
                if (node.id !== ",") {
                    break;
                }
                advance(",");
            }
            advance(")");
            this.lhs = left;
            this.rhs = terms;
            this.type = 'binary';
            return this;
        });

        var objectParser = function (left) {
            var a = [];
            if (node.id !== "}") {
                for (; ;) {
                    var n = expression(0);
                    advance(":");
                    var v = expression(0);
                    a.push([n, v]); // holds an array of name/value expression pairs
                    if (node.id !== ",") {
                        break;
                    }
                    advance(",");
                }
            }
            advance("}", true);
            if (typeof left === 'undefined') {
                // NUD - unary prefix form
                this.lhs = a;
                this.type = "unary";
            } else {
                // LED - binary infix form
                this.lhs = left;
                this.rhs = a;
                this.type = 'binary';
            }
            return this;
        };

        // object constructor
        prefix("{", objectParser);

        // object grouping
        infix("{", operators['{'], objectParser);

        // bind variable
        infixr(":=", operators[':='], function (left) {
            if (left.type !== 'variable') {
                return handleError({
                    code: "S0212",
                    stack: (new Error()).stack,
                    position: left.position,
                    token: left.value
                });
            }
            this.lhs = left;
            this.rhs = expression(operators[':='] - 1); // subtract 1 from bindingPower for right associative operators
            this.type = "binary";
            return this;
        });

        // focus variable bind
        infix("@", operators['@'], function (left) {
            this.lhs = left;
            this.rhs = expression(operators['@']);
            if(this.rhs.type !== 'variable') {
                return handleError({
                    code: "S0214",
                    stack: (new Error()).stack,
                    position: this.rhs.position,
                    token: "@"
                });
            }
            this.type = "binary";
            return this;
        });

        // index (position) variable bind
        infix("#", operators['#'], function (left) {
            this.lhs = left;
            this.rhs = expression(operators['#']);
            if(this.rhs.type !== 'variable') {
                return handleError({
                    code: "S0214",
                    stack: (new Error()).stack,
                    position: this.rhs.position,
                    token: "#"
                });
            }
            this.type = "binary";
            return this;
        });

        // if/then/else ternary operator ?:
        infix("?", operators['?'], function (left) {
            this.type = 'condition';
            this.condition = left;
            this.then = expression(0);
            if (node.id === ':') {
                // else condition
                advance(":");
                this.else = expression(0);
            }
            return this;
        });

        // object transformer
        prefix("|", function () {
            this.type = 'transform';
            this.pattern = expression(0);
            advance('|');
            this.update = expression(0);
            if (node.id === ',') {
                advance(',');
                this.delete = expression(0);
            }
            advance('|');
            return this;
        });

        // tail call optimization
        // this is invoked by the post parser to analyse lambda functions to see
        // if they make a tail call.  If so, it is replaced by a thunk which will
        // be invoked by the trampoline loop during function application.
        // This enables tail-recursive functions to be written without growing the stack
        var tailCallOptimize = function (expr) {
            var result;
            if (expr.type === 'function' && !expr.predicate) {
                var thunk = {type: 'lambda', thunk: true, arguments: [], position: expr.position};
                thunk.body = expr;
                result = thunk;
            } else if (expr.type === 'condition') {
                // analyse both branches
                expr.then = tailCallOptimize(expr.then);
                if (typeof expr.else !== 'undefined') {
                    expr.else = tailCallOptimize(expr.else);
                }
                result = expr;
            } else if (expr.type === 'block') {
                // only the last expression in the block
                var length = expr.expressions.length;
                if (length > 0) {
                    expr.expressions[length - 1] = tailCallOptimize(expr.expressions[length - 1]);
                }
                result = expr;
            } else {
                result = expr;
            }
            return result;
        };

        var ancestorLabel = 0;
        var ancestorIndex = 0;
        var ancestry = [];

        var seekParent = function (node, slot) {
            switch (node.type) {
                case 'name':
                case 'wildcard':
                    slot.level--;
                    if(slot.level === 0) {
                        if (typeof node.ancestor === 'undefined') {
                            node.ancestor = slot;
                        } else {
                            // reuse the existing label
                            ancestry[slot.index].slot.label = node.ancestor.label;
                            node.ancestor = slot;
                        }
                        node.tuple = true;
                    }
                    break;
                case 'parent':
                    slot.level++;
                    break;
                case 'block':
                    // look in last expression in the block
                    if(node.expressions.length > 0) {
                        node.tuple = true;
                        slot = seekParent(node.expressions[node.expressions.length - 1], slot);
                    }
                    break;
                case 'path':
                    // last step in path
                    node.tuple = true;
                    var index = node.steps.length - 1;
                    slot = seekParent(node.steps[index--], slot);
                    while (slot.level > 0 && index >= 0) {
                        // check previous steps
                        slot = seekParent(node.steps[index--], slot);
                    }
                    break;
                default:
                    // error - can't derive ancestor
                    throw {
                        code: "S0217",
                        token: node.type,
                        position: node.position
                    };
            }
            return slot;
        };

        var pushAncestry = function(result, value) {
            if(typeof value.seekingParent !== 'undefined' || value.type === 'parent') {
                var slots = (typeof value.seekingParent !== 'undefined') ? value.seekingParent : [];
                if (value.type === 'parent') {
                    slots.push(value.slot);
                }
                if(typeof result.seekingParent === 'undefined') {
                    result.seekingParent = slots;
                } else {
                    Array.prototype.push.apply(result.seekingParent, slots);
                }
            }
        };

        var resolveAncestry = function(path) {
            var index = path.steps.length - 1;
            var laststep = path.steps[index];
            var slots = (typeof laststep.seekingParent !== 'undefined') ? laststep.seekingParent : [];
            if (laststep.type === 'parent') {
                slots.push(laststep.slot);
            }
            for(var is = 0; is < slots.length; is++) {
                var slot = slots[is];
                index = path.steps.length - 2;
                while (slot.level > 0) {
                    if (index < 0) {
                        if(typeof path.seekingParent === 'undefined') {
                            path.seekingParent = [slot];
                        } else {
                            path.seekingParent.push(slot);
                        }
                        break;
                    }
                    // try previous step
                    var step = path.steps[index--];
                    // multiple contiguous steps that bind the focus should be skipped
                    while(index >= 0 && step.focus && path.steps[index].focus) {
                        step = path.steps[index--];
                    }
                    slot = seekParent(step, slot);
                }
            }
        };

        // post-parse stage
        // the purpose of this is to add as much semantic value to the parse tree as possible
        // in order to simplify the work of the evaluator.
        // This includes flattening the parts of the AST representing location paths,
        // converting them to arrays of steps which in turn may contain arrays of predicates.
        // following this, nodes containing '.' and '[' should be eliminated from the AST.
        var processAST = function (expr) {
            var result;
            switch (expr.type) {
                case 'binary':
                    switch (expr.value) {
                        case '.':
                            var lstep = processAST(expr.lhs);

                            if (lstep.type === 'path') {
                                result = lstep;
                            } else {
                                result = {type: 'path', steps: [lstep]};
                            }
                            if(lstep.type === 'parent') {
                                result.seekingParent = [lstep.slot];
                            }
                            var rest = processAST(expr.rhs);
                            if (rest.type === 'function' &&
                                rest.procedure.type === 'path' &&
                                rest.procedure.steps.length === 1 &&
                                rest.procedure.steps[0].type === 'name' &&
                                result.steps[result.steps.length - 1].type === 'function') {
                                // next function in chain of functions - will override a thenable
                                result.steps[result.steps.length - 1].nextFunction = rest.procedure.steps[0].value;
                            }
                            if (rest.type === 'path') {
                                Array.prototype.push.apply(result.steps, rest.steps);
                            } else {
                                if(typeof rest.predicate !== 'undefined') {
                                    rest.stages = rest.predicate;
                                    delete rest.predicate;
                                }
                                result.steps.push(rest);
                            }
                            // any steps within a path that are string literals, should be changed to 'name'
                            result.steps.filter(function (step) {
                                if (step.type === 'number' || step.type === 'value') {
                                    // don't allow steps to be numbers or the values true/false/null
                                    throw {
                                        code: "S0213",
                                        stack: (new Error()).stack,
                                        position: step.position,
                                        value: step.value
                                    };
                                }
                                return step.type === 'string';
                            }).forEach(function (lit) {
                                lit.type = 'name';
                            });
                            // any step that signals keeping a singleton array, should be flagged on the path
                            if (result.steps.filter(function (step) {
                                return step.keepArray === true;
                            }).length > 0) {
                                result.keepSingletonArray = true;
                            }
                            // if first step is a path constructor, flag it for special handling
                            var firststep = result.steps[0];
                            if (firststep.type === 'unary' && firststep.value === '[') {
                                firststep.consarray = true;
                            }
                            // if the last step is an array constructor, flag it so it doesn't flatten
                            var laststep = result.steps[result.steps.length - 1];
                            if (laststep.type === 'unary' && laststep.value === '[') {
                                laststep.consarray = true;
                            }
                            resolveAncestry(result);
                            break;
                        case '[':
                            // predicated step
                            // LHS is a step or a predicated step
                            // RHS is the predicate expr
                            result = processAST(expr.lhs);
                            var step = result;
                            var type = 'predicate';
                            if (result.type === 'path') {
                                step = result.steps[result.steps.length - 1];
                                type = 'stages';
                            }
                            if (typeof step.group !== 'undefined') {
                                throw {
                                    code: "S0209",
                                    stack: (new Error()).stack,
                                    position: expr.position
                                };
                            }
                            if (typeof step[type] === 'undefined') {
                                step[type] = [];
                            }
                            var predicate = processAST(expr.rhs);
                            if(typeof predicate.seekingParent !== 'undefined') {
                                predicate.seekingParent.forEach(slot => {
                                    if(slot.level === 1) {
                                        seekParent(step, slot);
                                    } else {
                                        slot.level--;
                                    }
                                });
                                pushAncestry(step, predicate);
                            }
                            step[type].push({type: 'filter', expr: predicate, position: expr.position});
                            break;
                        case '{':
                            // group-by
                            // LHS is a step or a predicated step
                            // RHS is the object constructor expr
                            result = processAST(expr.lhs);
                            if (typeof result.group !== 'undefined') {
                                throw {
                                    code: "S0210",
                                    stack: (new Error()).stack,
                                    position: expr.position
                                };
                            }
                            // object constructor - process each pair
                            result.group = {
                                lhs: expr.rhs.map(function (pair) {
                                    return [processAST(pair[0]), processAST(pair[1])];
                                }),
                                position: expr.position
                            };
                            break;
                        case '^':
                            // order-by
                            // LHS is the array to be ordered
                            // RHS defines the terms
                            result = processAST(expr.lhs);
                            if (result.type !== 'path') {
                                result = {type: 'path', steps: [result]};
                            }
                            var sortStep = {type: 'sort', position: expr.position};
                            sortStep.terms = expr.rhs.map(function (terms) {
                                var expression = processAST(terms.expression);
                                pushAncestry(sortStep, expression);
                                return {
                                    descending: terms.descending,
                                    expression: expression
                                };
                            });
                            result.steps.push(sortStep);
                            resolveAncestry(result);
                            break;
                        case ':=':
                            result = {type: 'bind', value: expr.value, position: expr.position};
                            result.lhs = processAST(expr.lhs);
                            result.rhs = processAST(expr.rhs);
                            pushAncestry(result, result.rhs);
                            break;
                        case '@':
                            result = processAST(expr.lhs);
                            step = result;
                            if (result.type === 'path') {
                                step = result.steps[result.steps.length - 1];
                            }
                            // throw error if there are any predicates defined at this point
                            // at this point the only type of stages can be predicates
                            if(typeof step.stages !== 'undefined' || typeof step.predicate !== 'undefined') {
                                throw {
                                    code: "S0215",
                                    stack: (new Error()).stack,
                                    position: expr.position
                                };
                            }
                            // also throw if this is applied after an 'order-by' clause
                            if(step.type === 'sort') {
                                throw {
                                    code: "S0216",
                                    stack: (new Error()).stack,
                                    position: expr.position
                                };
                            }
                            if(expr.keepArray) {
                                step.keepArray = true;
                            }
                            step.focus = expr.rhs.value;
                            step.tuple = true;
                            break;
                        case '#':
                            result = processAST(expr.lhs);
                            step = result;
                            if (result.type === 'path') {
                                step = result.steps[result.steps.length - 1];
                            } else {
                                result = {type: 'path', steps: [result]};
                                if (typeof step.predicate !== 'undefined') {
                                    step.stages = step.predicate;
                                    delete step.predicate;
                                }
                            }
                            if (typeof step.stages === 'undefined') {
                                step.index = expr.rhs.value;
                            } else {
                                step.stages.push({type: 'index', value: expr.rhs.value, position: expr.position});
                            }
                            step.tuple = true;
                            break;
                        case '~>':
                            result = {type: 'apply', value: expr.value, position: expr.position};
                            result.lhs = processAST(expr.lhs);
                            result.rhs = processAST(expr.rhs);
                            break;
                        default:
                            result = {type: expr.type, value: expr.value, position: expr.position};
                            result.lhs = processAST(expr.lhs);
                            result.rhs = processAST(expr.rhs);
                            pushAncestry(result, result.lhs);
                            pushAncestry(result, result.rhs);
                    }
                    break;
                case 'unary':
                    result = {type: expr.type, value: expr.value, position: expr.position};
                    if (expr.value === '[') {
                        // array constructor - process each item
                        result.expressions = expr.expressions.map(function (item) {
                            var value = processAST(item);
                            pushAncestry(result, value);
                            return value;
                        });
                    } else if (expr.value === '{') {
                        // object constructor - process each pair
                        result.lhs = expr.lhs.map(function (pair) {
                            var key = processAST(pair[0]);
                            pushAncestry(result, key);
                            var value = processAST(pair[1]);
                            pushAncestry(result, value);
                            return [key, value];
                        });
                    } else {
                        // all other unary expressions - just process the expression
                        result.expression = processAST(expr.expression);
                        // if unary minus on a number, then pre-process
                        if (expr.value === '-' && result.expression.type === 'number') {
                            result = result.expression;
                            result.value = -result.value;
                        } else {
                            pushAncestry(result, result.expression);
                        }
                    }
                    break;
                case 'function':
                case 'partial':
                    result = {type: expr.type, name: expr.name, value: expr.value, position: expr.position};
                    result.arguments = expr.arguments.map(function (arg) {
                        var argAST = processAST(arg);
                        pushAncestry(result, argAST);
                        return argAST;
                    });
                    result.procedure = processAST(expr.procedure);
                    break;
                case 'lambda':
                    result = {
                        type: expr.type,
                        arguments: expr.arguments,
                        signature: expr.signature,
                        position: expr.position
                    };
                    var body = processAST(expr.body);
                    result.body = tailCallOptimize(body);
                    break;
                case 'condition':
                    result = {type: expr.type, position: expr.position};
                    result.condition = processAST(expr.condition);
                    pushAncestry(result, result.condition);
                    result.then = processAST(expr.then);
                    pushAncestry(result, result.then);
                    if (typeof expr.else !== 'undefined') {
                        result.else = processAST(expr.else);
                        pushAncestry(result, result.else);
                    }
                    break;
                case 'transform':
                    result = {type: expr.type, position: expr.position};
                    result.pattern = processAST(expr.pattern);
                    result.update = processAST(expr.update);
                    if (typeof expr.delete !== 'undefined') {
                        result.delete = processAST(expr.delete);
                    }
                    break;
                case 'block':
                    result = {type: expr.type, position: expr.position};
                    // array of expressions - process each one
                    result.expressions = expr.expressions.map(function (item) {
                        var part = processAST(item);
                        pushAncestry(result, part);
                        if (part.consarray || (part.type === 'path' && part.steps[0].consarray)) {
                            result.consarray = true;
                        }
                        return part;
                    });
                    // TODO scan the array of expressions to see if any of them assign variables
                    // if so, need to mark the block as one that needs to create a new frame
                    break;
                case 'name':
                    result = {type: 'path', steps: [expr]};
                    if (expr.keepArray) {
                        result.keepSingletonArray = true;
                    }
                    break;
                case 'parent':
                    result = {type: 'parent', slot: { label: '!' + ancestorLabel++, level: 1, index: ancestorIndex++ } };
                    ancestry.push(result);
                    break;
                case 'string':
                case 'number':
                case 'value':
                case 'wildcard':
                case 'descendant':
                case 'variable':
                case 'regex':
                    result = expr;
                    break;
                case 'operator':
                    // the tokens 'and' and 'or' might have been used as a name rather than an operator
                    if (expr.value === 'and' || expr.value === 'or' || expr.value === 'in') {
                        expr.type = 'name';
                        result = processAST(expr);
                    } else /* istanbul ignore else */ if (expr.value === '?') {
                        // partial application
                        result = expr;
                    } else {
                        throw {
                            code: "S0201",
                            stack: (new Error()).stack,
                            position: expr.position,
                            token: expr.value
                        };
                    }
                    break;
                case 'error':
                    result = expr;
                    if (expr.lhs) {
                        result = processAST(expr.lhs);
                    }
                    break;
                default:
                    var code = "S0206";
                    /* istanbul ignore else */
                    if (expr.id === '(end)') {
                        code = "S0207";
                    }
                    var err = {
                        code: code,
                        position: expr.position,
                        token: expr.value
                    };
                    if (recover) {
                        errors.push(err);
                        return {type: 'error', error: err};
                    } else {
                        err.stack = (new Error()).stack;
                        throw err;
                    }
            }
            if (expr.keepArray) {
                result.keepArray = true;
            }
            return result;
        };

        // now invoke the tokenizer and the parser and return the syntax tree
        lexer = tokenizer(source);
        advance();
        // parse the tokens
        var expr = expression(0);
        if (node.id !== '(end)') {
            var err = {
                code: "S0201",
                position: node.position,
                token: node.value
            };
            handleError(err);
        }
        expr = processAST(expr);

        if(expr.type === 'parent' || typeof expr.seekingParent !== 'undefined') {
            // error - trying to derive ancestor at top level
            throw {
                code: "S0217",
                token: expr.type,
                position: expr.position
            };
        }

        if (errors.length > 0) {
            expr.errors = errors;
        }

        return expr;
    };

    return parser;
})();

module.exports = parser;

},{"./signature":5}],5:[function(require,module,exports){
/**
 * © Copyright IBM Corp. 2016, 2018 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

var utils = require('./utils');

const signature = (() => {
    'use strict';

    // A mapping between the function signature symbols and the full plural of the type
    // Expected to be used in error messages
    var arraySignatureMapping = {
        "a": "arrays",
        "b": "booleans",
        "f": "functions",
        "n": "numbers",
        "o": "objects",
        "s": "strings"
    };

    /**
     * Parses a function signature definition and returns a validation function
     * @param {string} signature - the signature between the <angle brackets>
     * @returns {Function} validation function
     */
    function parseSignature(signature) {
        // create a Regex that represents this signature and return a function that when invoked,
        // returns the validated (possibly fixed-up) arguments, or throws a validation error
        // step through the signature, one symbol at a time
        var position = 1;
        var params = [];
        var param = {};
        var prevParam = param;
        while (position < signature.length) {
            var symbol = signature.charAt(position);
            if (symbol === ':') {
                // TODO figure out what to do with the return type
                // ignore it for now
                break;
            }

            var next = function () {
                params.push(param);
                prevParam = param;
                param = {};
            };

            var findClosingBracket = function (str, start, openSymbol, closeSymbol) {
                // returns the position of the closing symbol (e.g. bracket) in a string
                // that balances the opening symbol at position start
                var depth = 1;
                var position = start;
                while (position < str.length) {
                    position++;
                    symbol = str.charAt(position);
                    if (symbol === closeSymbol) {
                        depth--;
                        if (depth === 0) {
                            // we're done
                            break; // out of while loop
                        }
                    } else if (symbol === openSymbol) {
                        depth++;
                    }
                }
                return position;
            };

            switch (symbol) {
                case 's': // string
                case 'n': // number
                case 'b': // boolean
                case 'l': // not so sure about expecting null?
                case 'o': // object
                    param.regex = '[' + symbol + 'm]';
                    param.type = symbol;
                    next();
                    break;
                case 'a': // array
                    //  normally treat any value as singleton array
                    param.regex = '[asnblfom]';
                    param.type = symbol;
                    param.array = true;
                    next();
                    break;
                case 'f': // function
                    param.regex = 'f';
                    param.type = symbol;
                    next();
                    break;
                case 'j': // any JSON type
                    param.regex = '[asnblom]';
                    param.type = symbol;
                    next();
                    break;
                case 'x': // any type
                    param.regex = '[asnblfom]';
                    param.type = symbol;
                    next();
                    break;
                case '-': // use context if param not supplied
                    prevParam.context = true;
                    prevParam.contextRegex = new RegExp(prevParam.regex); // pre-compiled to test the context type at runtime
                    prevParam.regex += '?';
                    break;
                case '?': // optional param
                case '+': // one or more
                    prevParam.regex += symbol;
                    break;
                case '(': // choice of types
                    // search forward for matching ')'
                    var endParen = findClosingBracket(signature, position, '(', ')');
                    var choice = signature.substring(position + 1, endParen);
                    if (choice.indexOf('<') === -1) {
                        // no parameterized types, simple regex
                        param.regex = '[' + choice + 'm]';
                    } else {
                        // TODO harder
                        throw {
                            code: "S0402",
                            stack: (new Error()).stack,
                            value: choice,
                            offset: position
                        };
                    }
                    param.type = '(' + choice + ')';
                    position = endParen;
                    next();
                    break;
                case '<': // type parameter - can only be applied to 'a' and 'f'
                    if (prevParam.type === 'a' || prevParam.type === 'f') {
                        // search forward for matching '>'
                        var endPos = findClosingBracket(signature, position, '<', '>');
                        prevParam.subtype = signature.substring(position + 1, endPos);
                        position = endPos;
                    } else {
                        throw {
                            code: "S0401",
                            stack: (new Error()).stack,
                            value: prevParam.type,
                            offset: position
                        };
                    }
                    break;
            }
            position++;
        }
        var regexStr = '^' +
            params.map(function (param) {
                return '(' + param.regex + ')';
            }).join('') +
            '$';
        var regex = new RegExp(regexStr);
        var getSymbol = function (value) {
            var symbol;
            if (utils.isFunction(value)) {
                symbol = 'f';
            } else {
                var type = typeof value;
                switch (type) {
                    case 'string':
                        symbol = 's';
                        break;
                    case 'number':
                        symbol = 'n';
                        break;
                    case 'boolean':
                        symbol = 'b';
                        break;
                    case 'object':
                        if (value === null) {
                            symbol = 'l';
                        } else if (Array.isArray(value)) {
                            symbol = 'a';
                        } else {
                            symbol = 'o';
                        }
                        break;
                    case 'undefined':
                    default:
                        // any value can be undefined, but should be allowed to match
                        symbol = 'm'; // m for missing
                }
            }
            return symbol;
        };

        var throwValidationError = function (badArgs, badSig) {
            // to figure out where this went wrong we need apply each component of the
            // regex to each argument until we get to the one that fails to match
            var partialPattern = '^';
            var goodTo = 0;
            for (var index = 0; index < params.length; index++) {
                partialPattern += params[index].regex;
                var match = badSig.match(partialPattern);
                if (match === null) {
                    // failed here
                    throw {
                        code: "T0410",
                        stack: (new Error()).stack,
                        value: badArgs[goodTo],
                        index: goodTo + 1
                    };
                }
                goodTo = match[0].length;
            }
            // if it got this far, it's probably because of extraneous arguments (we
            // haven't added the trailing '$' in the regex yet.
            throw {
                code: "T0410",
                stack: (new Error()).stack,
                value: badArgs[goodTo],
                index: goodTo + 1
            };
        };

        return {
            definition: signature,
            validate: function (args, context) {
                var suppliedSig = '';
                args.forEach(function (arg) {
                    suppliedSig += getSymbol(arg);
                });
                var isValid = regex.exec(suppliedSig);
                if (isValid) {
                    var validatedArgs = [];
                    var argIndex = 0;
                    params.forEach(function (param, index) {
                        var arg = args[argIndex];
                        var match = isValid[index + 1];
                        if (match === '') {
                            if (param.context && param.contextRegex) {
                                // substitute context value for missing arg
                                // first check that the context value is the right type
                                var contextType = getSymbol(context);
                                // test contextType against the regex for this arg (without the trailing ?)
                                if (param.contextRegex.test(contextType)) {
                                    validatedArgs.push(context);
                                } else {
                                    // context value not compatible with this argument
                                    throw {
                                        code: "T0411",
                                        stack: (new Error()).stack,
                                        value: context,
                                        index: argIndex + 1
                                    };
                                }
                            } else {
                                validatedArgs.push(arg);
                                argIndex++;
                            }
                        } else {
                            // may have matched multiple args (if the regex ends with a '+'
                            // split into single tokens
                            match.split('').forEach(function (single) {
                                if (param.type === 'a') {
                                    if (single === 'm') {
                                        // missing (undefined)
                                        arg = undefined;
                                    } else {
                                        arg = args[argIndex];
                                        var arrayOK = true;
                                        // is there type information on the contents of the array?
                                        if (typeof param.subtype !== 'undefined') {
                                            if (single !== 'a' && match !== param.subtype) {
                                                arrayOK = false;
                                            } else if (single === 'a') {
                                                if (arg.length > 0) {
                                                    var itemType = getSymbol(arg[0]);
                                                    if (itemType !== param.subtype.charAt(0)) { // TODO recurse further
                                                        arrayOK = false;
                                                    } else {
                                                        // make sure every item in the array is this type
                                                        var differentItems = arg.filter(function (val) {
                                                            return (getSymbol(val) !== itemType);
                                                        });
                                                        arrayOK = (differentItems.length === 0);
                                                    }
                                                }
                                            }
                                        }
                                        if (!arrayOK) {
                                            throw {
                                                code: "T0412",
                                                stack: (new Error()).stack,
                                                value: arg,
                                                index: argIndex + 1,
                                                type: arraySignatureMapping[param.subtype]
                                            };
                                        }
                                        // the function expects an array. If it's not one, make it so
                                        if (single !== 'a') {
                                            arg = [arg];
                                        }
                                    }
                                    validatedArgs.push(arg);
                                    argIndex++;
                                } else {
                                    validatedArgs.push(arg);
                                    argIndex++;
                                }
                            });
                        }
                    });
                    return validatedArgs;
                }
                throwValidationError(args, suppliedSig);
            }
        };
    }

    return parseSignature;
})();

module.exports = signature;

},{"./utils":6}],6:[function(require,module,exports){
/**
 * © Copyright IBM Corp. 2016, 2018 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

const utils = (() => {
    'use strict';

    /**
     * Check if value is a finite number
     * @param {float} n - number to evaluate
     * @returns {boolean} True if n is a finite number
     */
    function isNumeric(n) {
        var isNum = false;
        if(typeof n === 'number') {
            isNum = !isNaN(n);
            if (isNum && !isFinite(n)) {
                throw {
                    code: "D1001",
                    value: n,
                    stack: (new Error()).stack
                };
            }
        }
        return isNum;
    }

    /**
     * Returns true if the arg is an array of strings
     * @param {*} arg - the item to test
     * @returns {boolean} True if arg is an array of strings
     */
    function isArrayOfStrings(arg) {
        var result = false;
        /* istanbul ignore else */
        if(Array.isArray(arg)) {
            result = (arg.filter(function(item){return typeof item !== 'string';}).length === 0);
        }
        return result;
    }

    /**
     * Returns true if the arg is an array of numbers
     * @param {*} arg - the item to test
     * @returns {boolean} True if arg is an array of numbers
     */
    function isArrayOfNumbers(arg) {
        var result = false;
        if(Array.isArray(arg)) {
            result = (arg.filter(function(item){return !isNumeric(item);}).length === 0);
        }
        return result;
    }

    /**
     * Create an empty sequence to contain query results
     * @returns {Array} - empty sequence
     */
    function createSequence() {
        var sequence = [];
        sequence.sequence = true;
        if (arguments.length === 1) {
            sequence.push(arguments[0]);
        }
        return sequence;
    }

    /**
     * Tests if a value is a sequence
     * @param {*} value the value to test
     * @returns {boolean} true if it's a sequence
     */
    function isSequence(value) {
        return value.sequence === true && Array.isArray(value);
    }

    /**
     *
     * @param {Object} arg - expression to test
     * @returns {boolean} - true if it is a function (lambda or built-in)
     */
    function isFunction(arg) {
        return ((arg && (arg._jsonata_function === true || arg._jsonata_lambda === true)) || typeof arg === 'function');
    }

    /**
     * Returns the arity (number of arguments) of the function
     * @param {*} func - the function
     * @returns {*} - the arity
     */
    function getFunctionArity(func) {
        var arity = typeof func.arity === 'number' ? func.arity :
            typeof func.implementation === 'function' ? func.implementation.length :
                typeof func.length === 'number' ? func.length : func.arguments.length;
        return arity;
    }

    /**
     * Tests whether arg is a lambda function
     * @param {*} arg - the value to test
     * @returns {boolean} - true if it is a lambda function
     */
    function isLambda(arg) {
        return arg && arg._jsonata_lambda === true;
    }

    // istanbul ignore next
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    // istanbul ignore next
    var iteratorSymbol = $Symbol.iterator || "@@iterator";

    /**
     * @param {Object} arg - expression to test
     * @returns {boolean} - true if it is iterable
     */
    function isIterable(arg) {
        return (
            typeof arg === 'object' &&
            arg !== null &&
            iteratorSymbol in arg &&
            'next' in arg &&
            typeof arg.next === 'function'
        );
    }

    /**
     * Compares two values for equality
     * @param {*} lhs first value
     * @param {*} rhs second value
     * @returns {boolean} true if they are deep equal
     */
    function isDeepEqual(lhs, rhs) {
        if (lhs === rhs) {
            return true;
        }
        if(typeof lhs === 'object' && typeof rhs === 'object' && lhs !== null && rhs !== null) {
            if(Array.isArray(lhs) && Array.isArray(rhs)) {
                // both arrays (or sequences)
                // must be the same length
                if(lhs.length !== rhs.length) {
                    return false;
                }
                // must contain same values in same order
                for(var ii = 0; ii < lhs.length; ii++) {
                    if(!isDeepEqual(lhs[ii], rhs[ii])) {
                        return false;
                    }
                }
                return true;
            }
            // both objects
            // must have the same set of keys (in any order)
            var lkeys = Object.getOwnPropertyNames(lhs);
            var rkeys = Object.getOwnPropertyNames(rhs);
            if(lkeys.length !== rkeys.length) {
                return false;
            }
            lkeys = lkeys.sort();
            rkeys = rkeys.sort();
            for(ii=0; ii < lkeys.length; ii++) {
                if(lkeys[ii] !== rkeys[ii]) {
                    return false;
                }
            }
            // must have the same values
            for(ii=0; ii < lkeys.length; ii++) {
                var key = lkeys[ii];
                if(!isDeepEqual(lhs[key], rhs[key])) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    /**
     * converts a string to an array of characters
     * @param {string} str - the input string
     * @returns {Array} - the array of characters
     */
    function stringToArray(str) {
        var arr = [];
        for (let char of str) {
            arr.push(char);
        }
        return arr;
    }

    return {
        isNumeric,
        isArrayOfStrings,
        isArrayOfNumbers,
        createSequence,
        isSequence,
        isFunction,
        isLambda,
        isIterable,
        getFunctionArity,
        isDeepEqual,
        stringToArray
    };
})();

module.exports = utils;

},{}]},{},[3])(3)
});


/***/ }),

/***/ 375:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {PassThrough: PassThroughStream} = __webpack_require__(413);

module.exports = options => {
	options = {...options};

	const {array} = options;
	let {encoding} = options;
	const isBuffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || isBuffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (isBuffer) {
		encoding = null;
	}

	const stream = new PassThroughStream({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	let length = 0;
	const chunks = [];

	stream.on('data', chunk => {
		chunks.push(chunk);

		if (objectMode) {
			length = chunks.length;
		} else {
			length += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return chunks;
		}

		return isBuffer ? Buffer.concat(chunks, length) : chunks.join('');
	};

	stream.getBufferedLength = () => length;

	return stream;
};


/***/ }),

/***/ 390:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const EventEmitter = __webpack_require__(614);
const urlLib = __webpack_require__(835);
const normalizeUrl = __webpack_require__(53);
const getStream = __webpack_require__(997);
const CachePolicy = __webpack_require__(154);
const Response = __webpack_require__(93);
const lowercaseKeys = __webpack_require__(474);
const cloneResponse = __webpack_require__(325);
const Keyv = __webpack_require__(303);

class CacheableRequest {
	constructor(request, cacheAdapter) {
		if (typeof request !== 'function') {
			throw new TypeError('Parameter `request` must be a function');
		}

		this.cache = new Keyv({
			uri: typeof cacheAdapter === 'string' && cacheAdapter,
			store: typeof cacheAdapter !== 'string' && cacheAdapter,
			namespace: 'cacheable-request'
		});

		return this.createCacheableRequest(request);
	}

	createCacheableRequest(request) {
		return (opts, cb) => {
			let url;
			if (typeof opts === 'string') {
				url = normalizeUrlObject(urlLib.parse(opts));
				opts = {};
			} else if (opts instanceof urlLib.URL) {
				url = normalizeUrlObject(urlLib.parse(opts.toString()));
				opts = {};
			} else {
				const [pathname, ...searchParts] = (opts.path || '').split('?');
				const search = searchParts.length > 0 ?
					`?${searchParts.join('?')}` :
					'';
				url = normalizeUrlObject({ ...opts, pathname, search });
			}

			opts = {
				headers: {},
				method: 'GET',
				cache: true,
				strictTtl: false,
				automaticFailover: false,
				...opts,
				...urlObjectToRequestOptions(url)
			};
			opts.headers = lowercaseKeys(opts.headers);

			const ee = new EventEmitter();
			const normalizedUrlString = normalizeUrl(
				urlLib.format(url),
				{
					stripWWW: false,
					removeTrailingSlash: false,
					stripAuthentication: false
				}
			);
			const key = `${opts.method}:${normalizedUrlString}`;
			let revalidate = false;
			let madeRequest = false;

			const makeRequest = opts => {
				madeRequest = true;
				let requestErrored = false;
				let requestErrorCallback;

				const requestErrorPromise = new Promise(resolve => {
					requestErrorCallback = () => {
						if (!requestErrored) {
							requestErrored = true;
							resolve();
						}
					};
				});

				const handler = response => {
					if (revalidate && !opts.forceRefresh) {
						response.status = response.statusCode;
						const revalidatedPolicy = CachePolicy.fromObject(revalidate.cachePolicy).revalidatedPolicy(opts, response);
						if (!revalidatedPolicy.modified) {
							const headers = revalidatedPolicy.policy.responseHeaders();
							response = new Response(revalidate.statusCode, headers, revalidate.body, revalidate.url);
							response.cachePolicy = revalidatedPolicy.policy;
							response.fromCache = true;
						}
					}

					if (!response.fromCache) {
						response.cachePolicy = new CachePolicy(opts, response, opts);
						response.fromCache = false;
					}

					let clonedResponse;
					if (opts.cache && response.cachePolicy.storable()) {
						clonedResponse = cloneResponse(response);

						(async () => {
							try {
								const bodyPromise = getStream.buffer(response);

								await Promise.race([
									requestErrorPromise,
									new Promise(resolve => response.once('end', resolve))
								]);

								if (requestErrored) {
									return;
								}

								const body = await bodyPromise;

								const value = {
									cachePolicy: response.cachePolicy.toObject(),
									url: response.url,
									statusCode: response.fromCache ? revalidate.statusCode : response.statusCode,
									body
								};

								let ttl = opts.strictTtl ? response.cachePolicy.timeToLive() : undefined;
								if (opts.maxTtl) {
									ttl = ttl ? Math.min(ttl, opts.maxTtl) : opts.maxTtl;
								}

								await this.cache.set(key, value, ttl);
							} catch (error) {
								ee.emit('error', new CacheableRequest.CacheError(error));
							}
						})();
					} else if (opts.cache && revalidate) {
						(async () => {
							try {
								await this.cache.delete(key);
							} catch (error) {
								ee.emit('error', new CacheableRequest.CacheError(error));
							}
						})();
					}

					ee.emit('response', clonedResponse || response);
					if (typeof cb === 'function') {
						cb(clonedResponse || response);
					}
				};

				try {
					const req = request(opts, handler);
					req.once('error', requestErrorCallback);
					req.once('abort', requestErrorCallback);
					ee.emit('request', req);
				} catch (error) {
					ee.emit('error', new CacheableRequest.RequestError(error));
				}
			};

			(async () => {
				const get = async opts => {
					await Promise.resolve();

					const cacheEntry = opts.cache ? await this.cache.get(key) : undefined;
					if (typeof cacheEntry === 'undefined') {
						return makeRequest(opts);
					}

					const policy = CachePolicy.fromObject(cacheEntry.cachePolicy);
					if (policy.satisfiesWithoutRevalidation(opts) && !opts.forceRefresh) {
						const headers = policy.responseHeaders();
						const response = new Response(cacheEntry.statusCode, headers, cacheEntry.body, cacheEntry.url);
						response.cachePolicy = policy;
						response.fromCache = true;

						ee.emit('response', response);
						if (typeof cb === 'function') {
							cb(response);
						}
					} else {
						revalidate = cacheEntry;
						opts.headers = policy.revalidationHeaders(opts);
						makeRequest(opts);
					}
				};

				const errorHandler = error => ee.emit('error', new CacheableRequest.CacheError(error));
				this.cache.once('error', errorHandler);
				ee.on('response', () => this.cache.removeListener('error', errorHandler));

				try {
					await get(opts);
				} catch (error) {
					if (opts.automaticFailover && !madeRequest) {
						makeRequest(opts);
					}

					ee.emit('error', new CacheableRequest.CacheError(error));
				}
			})();

			return ee;
		};
	}
}

function urlObjectToRequestOptions(url) {
	const options = { ...url };
	options.path = `${url.pathname || '/'}${url.search || ''}`;
	delete options.pathname;
	delete options.search;
	return options;
}

function normalizeUrlObject(url) {
	// If url was parsed by url.parse or new URL:
	// - hostname will be set
	// - host will be hostname[:port]
	// - port will be set if it was explicit in the parsed string
	// Otherwise, url was from request options:
	// - hostname or host may be set
	// - host shall not have port encoded
	return {
		protocol: url.protocol,
		auth: url.auth,
		hostname: url.hostname || url.host || 'localhost',
		port: url.port,
		pathname: url.pathname,
		search: url.search
	};
}

CacheableRequest.RequestError = class extends Error {
	constructor(error) {
		super(error.message);
		this.name = 'RequestError';
		Object.assign(this, error);
	}
};

CacheableRequest.CacheError = class extends Error {
	constructor(error) {
		super(error.message);
		this.name = 'CacheError';
		Object.assign(this, error);
	}
};

module.exports = CacheableRequest;


/***/ }),

/***/ 413:
/***/ (function(module) {

module.exports = require("stream");

/***/ }),

/***/ 422:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isResponseOk = void 0;
exports.isResponseOk = (response) => {
    const { statusCode } = response;
    const limitStatusCode = response.request.options.followRedirect ? 299 : 399;
    return (statusCode >= 200 && statusCode <= limitStatusCode) || statusCode === 304;
};


/***/ }),

/***/ 431:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(__webpack_require__(87));
const utils_1 = __webpack_require__(82);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 452:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// TODO: Update https://github.com/sindresorhus/get-stream
const getBuffer = async (stream) => {
    const chunks = [];
    let length = 0;
    for await (const chunk of stream) {
        chunks.push(chunk);
        length += Buffer.byteLength(chunk);
    }
    if (Buffer.isBuffer(chunks[0])) {
        return Buffer.concat(chunks, length);
    }
    return Buffer.from(chunks.join(''));
};
exports.default = getBuffer;


/***/ }),

/***/ 453:
/***/ (function(module, __unusedexports, __webpack_require__) {

var once = __webpack_require__(49)
var eos = __webpack_require__(9)
var fs = __webpack_require__(747) // we only need fs to get the ReadStream and WriteStream prototypes

var noop = function () {}
var ancient = /^v?\.0/.test(process.version)

var isFn = function (fn) {
  return typeof fn === 'function'
}

var isFS = function (stream) {
  if (!ancient) return false // newer node version do not need to care about fs is a special way
  if (!fs) return false // browser
  return (stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) && isFn(stream.close)
}

var isRequest = function (stream) {
  return stream.setHeader && isFn(stream.abort)
}

var destroyer = function (stream, reading, writing, callback) {
  callback = once(callback)

  var closed = false
  stream.on('close', function () {
    closed = true
  })

  eos(stream, {readable: reading, writable: writing}, function (err) {
    if (err) return callback(err)
    closed = true
    callback()
  })

  var destroyed = false
  return function (err) {
    if (closed) return
    if (destroyed) return
    destroyed = true

    if (isFS(stream)) return stream.close(noop) // use close for fs streams to avoid fd leaks
    if (isRequest(stream)) return stream.abort() // request.destroy just do .end - .abort is what we want

    if (isFn(stream.destroy)) return stream.destroy()

    callback(err || new Error('stream was destroyed'))
  }
}

var call = function (fn) {
  fn()
}

var pipe = function (from, to) {
  return from.pipe(to)
}

var pump = function () {
  var streams = Array.prototype.slice.call(arguments)
  var callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop

  if (Array.isArray(streams[0])) streams = streams[0]
  if (streams.length < 2) throw new Error('pump requires two streams per minimum')

  var error
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1
    var writing = i > 0
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err
      if (err) destroys.forEach(call)
      if (reading) return
      destroys.forEach(call)
      callback(error)
    })
  })

  return streams.reduce(pipe)
}

module.exports = pump


/***/ }),

/***/ 460:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = __webpack_require__(534);
exports.default = (body) => is_1.default.nodeStream(body) && is_1.default.function_(body.getBoundary);


/***/ }),

/***/ 461:
/***/ (function(module, __unusedexports, __webpack_require__) {

const jsonata = __webpack_require__(350);


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
            const result = await client.get(requestPath);
            body = result.body;
            responseCache.set(requestPath, body);
        }
        if (!selector.match(/.*[\.].*/)) {
            selector = '"' + selector + '"'
        }
        selector = "data." + selector
        body = JSON.parse(body)
        if (body.data["data"] != undefined) {
            selector = "data." + selector
        }

        const value = selectData(body, selector);
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
    if (!result && ((ata.ast().type === "path" && ata.ast()['steps'].length === 1) || ata.ast().type === "string") && selector !== 'data' && 'data' in data) {
        result = JSON.stringify(jsonata(`data.${selector}`).evaluate(data));
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

/***/ }),

/***/ 470:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __webpack_require__(431);
const file_command_1 = __webpack_require__(102);
const utils_1 = __webpack_require__(82);
const os = __importStar(__webpack_require__(87));
const path = __importStar(__webpack_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 474:
/***/ (function(module) {

"use strict";

module.exports = object => {
	const result = {};

	for (const [key, value] of Object.entries(object)) {
		result[key.toLowerCase()] = value;
	}

	return result;
};


/***/ }),

/***/ 490:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const defer_to_connect_1 = __webpack_require__(790);
const nodejsMajorVersion = Number(process.versions.node.split('.')[0]);
const timer = (request) => {
    const timings = {
        start: Date.now(),
        socket: undefined,
        lookup: undefined,
        connect: undefined,
        secureConnect: undefined,
        upload: undefined,
        response: undefined,
        end: undefined,
        error: undefined,
        abort: undefined,
        phases: {
            wait: undefined,
            dns: undefined,
            tcp: undefined,
            tls: undefined,
            request: undefined,
            firstByte: undefined,
            download: undefined,
            total: undefined
        }
    };
    request.timings = timings;
    const handleError = (origin) => {
        const emit = origin.emit.bind(origin);
        origin.emit = (event, ...args) => {
            // Catches the `error` event
            if (event === 'error') {
                timings.error = Date.now();
                timings.phases.total = timings.error - timings.start;
                origin.emit = emit;
            }
            // Saves the original behavior
            return emit(event, ...args);
        };
    };
    handleError(request);
    request.prependOnceListener('abort', () => {
        timings.abort = Date.now();
        // Let the `end` response event be responsible for setting the total phase,
        // unless the Node.js major version is >= 13.
        if (!timings.response || nodejsMajorVersion >= 13) {
            timings.phases.total = Date.now() - timings.start;
        }
    });
    const onSocket = (socket) => {
        timings.socket = Date.now();
        timings.phases.wait = timings.socket - timings.start;
        const lookupListener = () => {
            timings.lookup = Date.now();
            timings.phases.dns = timings.lookup - timings.socket;
        };
        socket.prependOnceListener('lookup', lookupListener);
        defer_to_connect_1.default(socket, {
            connect: () => {
                timings.connect = Date.now();
                if (timings.lookup === undefined) {
                    socket.removeListener('lookup', lookupListener);
                    timings.lookup = timings.connect;
                    timings.phases.dns = timings.lookup - timings.socket;
                }
                timings.phases.tcp = timings.connect - timings.lookup;
                // This callback is called before flushing any data,
                // so we don't need to set `timings.phases.request` here.
            },
            secureConnect: () => {
                timings.secureConnect = Date.now();
                timings.phases.tls = timings.secureConnect - timings.connect;
            }
        });
    };
    if (request.socket) {
        onSocket(request.socket);
    }
    else {
        request.prependOnceListener('socket', onSocket);
    }
    const onUpload = () => {
        var _a;
        timings.upload = Date.now();
        timings.phases.request = timings.upload - (_a = timings.secureConnect, (_a !== null && _a !== void 0 ? _a : timings.connect));
    };
    const writableFinished = () => {
        if (typeof request.writableFinished === 'boolean') {
            return request.writableFinished;
        }
        // Node.js doesn't have `request.writableFinished` property
        return request.finished && request.outputSize === 0 && (!request.socket || request.socket.writableLength === 0);
    };
    if (writableFinished()) {
        onUpload();
    }
    else {
        request.prependOnceListener('finish', onUpload);
    }
    request.prependOnceListener('response', (response) => {
        timings.response = Date.now();
        timings.phases.firstByte = timings.response - timings.upload;
        response.timings = timings;
        handleError(response);
        response.prependOnceListener('end', () => {
            timings.end = Date.now();
            timings.phases.download = timings.end - timings.response;
            timings.phases.total = timings.end - timings.start;
        });
    });
    return timings;
};
exports.default = timer;
// For CommonJS default export support
module.exports = timer;
module.exports.default = timer;


/***/ }),

/***/ 492:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const core = __webpack_require__(470);
const { exportSecrets } = __webpack_require__(928);

(async () => {
    try {
        await core.group('Get Vault Secrets', exportSecrets);
    } catch (error) {
        core.setFailed(error.message);
    }
})();


/***/ }),

/***/ 507:
/***/ (function(module) {

"use strict";

/* istanbul ignore file: https://github.com/nodejs/node/blob/a91293d4d9ab403046ab5eb022332e4e3d249bd3/lib/internal/url.js#L1257 */

module.exports = url => {
	const options = {
		protocol: url.protocol,
		hostname: typeof url.hostname === 'string' && url.hostname.startsWith('[') ? url.hostname.slice(1, -1) : url.hostname,
		host: url.host,
		hash: url.hash,
		search: url.search,
		pathname: url.pathname,
		href: url.href,
		path: `${url.pathname || ''}${url.search || ''}`
	};

	if (typeof url.port === 'string' && url.port.length !== 0) {
		options.port = Number(url.port);
	}

	if (url.username || url.password) {
		options.auth = `${url.username || ''}:${url.password || ''}`;
	}

	return options;
};


/***/ }),

/***/ 524:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const tls = __webpack_require__(16);

module.exports = (options = {}) => new Promise((resolve, reject) => {
	const socket = tls.connect(options, () => {
		if (options.resolveSocket) {
			socket.off('error', reject);
			resolve({alpnProtocol: socket.alpnProtocol, socket});
		} else {
			socket.destroy();
			resolve({alpnProtocol: socket.alpnProtocol});
		}
	});

	socket.on('error', reject);
});


/***/ }),

/***/ 534:
/***/ (function(module, exports) {

"use strict";

/// <reference lib="es2018"/>
/// <reference lib="dom"/>
/// <reference types="node"/>
Object.defineProperty(exports, "__esModule", { value: true });
const typedArrayTypeNames = [
    'Int8Array',
    'Uint8Array',
    'Uint8ClampedArray',
    'Int16Array',
    'Uint16Array',
    'Int32Array',
    'Uint32Array',
    'Float32Array',
    'Float64Array',
    'BigInt64Array',
    'BigUint64Array'
];
function isTypedArrayName(name) {
    return typedArrayTypeNames.includes(name);
}
const objectTypeNames = [
    'Function',
    'Generator',
    'AsyncGenerator',
    'GeneratorFunction',
    'AsyncGeneratorFunction',
    'AsyncFunction',
    'Observable',
    'Array',
    'Buffer',
    'Object',
    'RegExp',
    'Date',
    'Error',
    'Map',
    'Set',
    'WeakMap',
    'WeakSet',
    'ArrayBuffer',
    'SharedArrayBuffer',
    'DataView',
    'Promise',
    'URL',
    'HTMLElement',
    ...typedArrayTypeNames
];
function isObjectTypeName(name) {
    return objectTypeNames.includes(name);
}
const primitiveTypeNames = [
    'null',
    'undefined',
    'string',
    'number',
    'bigint',
    'boolean',
    'symbol'
];
function isPrimitiveTypeName(name) {
    return primitiveTypeNames.includes(name);
}
// eslint-disable-next-line @typescript-eslint/ban-types
function isOfType(type) {
    return (value) => typeof value === type;
}
const { toString } = Object.prototype;
const getObjectType = (value) => {
    const objectTypeName = toString.call(value).slice(8, -1);
    if (/HTML\w+Element/.test(objectTypeName) && is.domElement(value)) {
        return 'HTMLElement';
    }
    if (isObjectTypeName(objectTypeName)) {
        return objectTypeName;
    }
    return undefined;
};
const isObjectOfType = (type) => (value) => getObjectType(value) === type;
function is(value) {
    if (value === null) {
        return 'null';
    }
    switch (typeof value) {
        case 'undefined':
            return 'undefined';
        case 'string':
            return 'string';
        case 'number':
            return 'number';
        case 'boolean':
            return 'boolean';
        case 'function':
            return 'Function';
        case 'bigint':
            return 'bigint';
        case 'symbol':
            return 'symbol';
        default:
    }
    if (is.observable(value)) {
        return 'Observable';
    }
    if (is.array(value)) {
        return 'Array';
    }
    if (is.buffer(value)) {
        return 'Buffer';
    }
    const tagType = getObjectType(value);
    if (tagType) {
        return tagType;
    }
    if (value instanceof String || value instanceof Boolean || value instanceof Number) {
        throw new TypeError('Please don\'t use object wrappers for primitive types');
    }
    return 'Object';
}
is.undefined = isOfType('undefined');
is.string = isOfType('string');
const isNumberType = isOfType('number');
is.number = (value) => isNumberType(value) && !is.nan(value);
is.bigint = isOfType('bigint');
// eslint-disable-next-line @typescript-eslint/ban-types
is.function_ = isOfType('function');
is.null_ = (value) => value === null;
is.class_ = (value) => is.function_(value) && value.toString().startsWith('class ');
is.boolean = (value) => value === true || value === false;
is.symbol = isOfType('symbol');
is.numericString = (value) => is.string(value) && !is.emptyStringOrWhitespace(value) && !Number.isNaN(Number(value));
is.array = (value, assertion) => {
    if (!Array.isArray(value)) {
        return false;
    }
    if (!is.function_(assertion)) {
        return true;
    }
    return value.every(assertion);
};
is.buffer = (value) => { var _a, _b, _c, _d; return (_d = (_c = (_b = (_a = value) === null || _a === void 0 ? void 0 : _a.constructor) === null || _b === void 0 ? void 0 : _b.isBuffer) === null || _c === void 0 ? void 0 : _c.call(_b, value)) !== null && _d !== void 0 ? _d : false; };
is.nullOrUndefined = (value) => is.null_(value) || is.undefined(value);
is.object = (value) => !is.null_(value) && (typeof value === 'object' || is.function_(value));
is.iterable = (value) => { var _a; return is.function_((_a = value) === null || _a === void 0 ? void 0 : _a[Symbol.iterator]); };
is.asyncIterable = (value) => { var _a; return is.function_((_a = value) === null || _a === void 0 ? void 0 : _a[Symbol.asyncIterator]); };
is.generator = (value) => is.iterable(value) && is.function_(value.next) && is.function_(value.throw);
is.asyncGenerator = (value) => is.asyncIterable(value) && is.function_(value.next) && is.function_(value.throw);
is.nativePromise = (value) => isObjectOfType('Promise')(value);
const hasPromiseAPI = (value) => {
    var _a, _b;
    return is.function_((_a = value) === null || _a === void 0 ? void 0 : _a.then) &&
        is.function_((_b = value) === null || _b === void 0 ? void 0 : _b.catch);
};
is.promise = (value) => is.nativePromise(value) || hasPromiseAPI(value);
is.generatorFunction = isObjectOfType('GeneratorFunction');
is.asyncGeneratorFunction = (value) => getObjectType(value) === 'AsyncGeneratorFunction';
is.asyncFunction = (value) => getObjectType(value) === 'AsyncFunction';
// eslint-disable-next-line no-prototype-builtins, @typescript-eslint/ban-types
is.boundFunction = (value) => is.function_(value) && !value.hasOwnProperty('prototype');
is.regExp = isObjectOfType('RegExp');
is.date = isObjectOfType('Date');
is.error = isObjectOfType('Error');
is.map = (value) => isObjectOfType('Map')(value);
is.set = (value) => isObjectOfType('Set')(value);
is.weakMap = (value) => isObjectOfType('WeakMap')(value);
is.weakSet = (value) => isObjectOfType('WeakSet')(value);
is.int8Array = isObjectOfType('Int8Array');
is.uint8Array = isObjectOfType('Uint8Array');
is.uint8ClampedArray = isObjectOfType('Uint8ClampedArray');
is.int16Array = isObjectOfType('Int16Array');
is.uint16Array = isObjectOfType('Uint16Array');
is.int32Array = isObjectOfType('Int32Array');
is.uint32Array = isObjectOfType('Uint32Array');
is.float32Array = isObjectOfType('Float32Array');
is.float64Array = isObjectOfType('Float64Array');
is.bigInt64Array = isObjectOfType('BigInt64Array');
is.bigUint64Array = isObjectOfType('BigUint64Array');
is.arrayBuffer = isObjectOfType('ArrayBuffer');
is.sharedArrayBuffer = isObjectOfType('SharedArrayBuffer');
is.dataView = isObjectOfType('DataView');
is.directInstanceOf = (instance, class_) => Object.getPrototypeOf(instance) === class_.prototype;
is.urlInstance = (value) => isObjectOfType('URL')(value);
is.urlString = (value) => {
    if (!is.string(value)) {
        return false;
    }
    try {
        new URL(value); // eslint-disable-line no-new
        return true;
    }
    catch (_a) {
        return false;
    }
};
// TODO: Use the `not` operator with a type guard here when it's available.
// Example: `is.truthy = (value: unknown): value is (not false | not 0 | not '' | not undefined | not null) => Boolean(value);`
is.truthy = (value) => Boolean(value);
// Example: `is.falsy = (value: unknown): value is (not true | 0 | '' | undefined | null) => Boolean(value);`
is.falsy = (value) => !value;
is.nan = (value) => Number.isNaN(value);
is.primitive = (value) => is.null_(value) || isPrimitiveTypeName(typeof value);
is.integer = (value) => Number.isInteger(value);
is.safeInteger = (value) => Number.isSafeInteger(value);
is.plainObject = (value) => {
    // From: https://github.com/sindresorhus/is-plain-obj/blob/master/index.js
    if (toString.call(value) !== '[object Object]') {
        return false;
    }
    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.getPrototypeOf({});
};
is.typedArray = (value) => isTypedArrayName(getObjectType(value));
const isValidLength = (value) => is.safeInteger(value) && value >= 0;
is.arrayLike = (value) => !is.nullOrUndefined(value) && !is.function_(value) && isValidLength(value.length);
is.inRange = (value, range) => {
    if (is.number(range)) {
        return value >= Math.min(0, range) && value <= Math.max(range, 0);
    }
    if (is.array(range) && range.length === 2) {
        return value >= Math.min(...range) && value <= Math.max(...range);
    }
    throw new TypeError(`Invalid range: ${JSON.stringify(range)}`);
};
const NODE_TYPE_ELEMENT = 1;
const DOM_PROPERTIES_TO_CHECK = [
    'innerHTML',
    'ownerDocument',
    'style',
    'attributes',
    'nodeValue'
];
is.domElement = (value) => {
    return is.object(value) &&
        value.nodeType === NODE_TYPE_ELEMENT &&
        is.string(value.nodeName) &&
        !is.plainObject(value) &&
        DOM_PROPERTIES_TO_CHECK.every(property => property in value);
};
is.observable = (value) => {
    var _a, _b, _c, _d;
    if (!value) {
        return false;
    }
    // eslint-disable-next-line no-use-extend-native/no-use-extend-native
    if (value === ((_b = (_a = value)[Symbol.observable]) === null || _b === void 0 ? void 0 : _b.call(_a))) {
        return true;
    }
    if (value === ((_d = (_c = value)['@@observable']) === null || _d === void 0 ? void 0 : _d.call(_c))) {
        return true;
    }
    return false;
};
is.nodeStream = (value) => is.object(value) && is.function_(value.pipe) && !is.observable(value);
is.infinite = (value) => value === Infinity || value === -Infinity;
const isAbsoluteMod2 = (remainder) => (value) => is.integer(value) && Math.abs(value % 2) === remainder;
is.evenInteger = isAbsoluteMod2(0);
is.oddInteger = isAbsoluteMod2(1);
is.emptyArray = (value) => is.array(value) && value.length === 0;
is.nonEmptyArray = (value) => is.array(value) && value.length > 0;
is.emptyString = (value) => is.string(value) && value.length === 0;
// TODO: Use `not ''` when the `not` operator is available.
is.nonEmptyString = (value) => is.string(value) && value.length > 0;
const isWhiteSpaceString = (value) => is.string(value) && !/\S/.test(value);
is.emptyStringOrWhitespace = (value) => is.emptyString(value) || isWhiteSpaceString(value);
is.emptyObject = (value) => is.object(value) && !is.map(value) && !is.set(value) && Object.keys(value).length === 0;
// TODO: Use `not` operator here to remove `Map` and `Set` from type guard:
// - https://github.com/Microsoft/TypeScript/pull/29317
is.nonEmptyObject = (value) => is.object(value) && !is.map(value) && !is.set(value) && Object.keys(value).length > 0;
is.emptySet = (value) => is.set(value) && value.size === 0;
is.nonEmptySet = (value) => is.set(value) && value.size > 0;
is.emptyMap = (value) => is.map(value) && value.size === 0;
is.nonEmptyMap = (value) => is.map(value) && value.size > 0;
const predicateOnArray = (method, predicate, values) => {
    if (!is.function_(predicate)) {
        throw new TypeError(`Invalid predicate: ${JSON.stringify(predicate)}`);
    }
    if (values.length === 0) {
        throw new TypeError('Invalid number of values');
    }
    return method.call(values, predicate);
};
is.any = (predicate, ...values) => {
    const predicates = is.array(predicate) ? predicate : [predicate];
    return predicates.some(singlePredicate => predicateOnArray(Array.prototype.some, singlePredicate, values));
};
is.all = (predicate, ...values) => predicateOnArray(Array.prototype.every, predicate, values);
const assertType = (condition, description, value) => {
    if (!condition) {
        throw new TypeError(`Expected value which is \`${description}\`, received value of type \`${is(value)}\`.`);
    }
};
exports.assert = {
    // Unknowns.
    undefined: (value) => assertType(is.undefined(value), 'undefined', value),
    string: (value) => assertType(is.string(value), 'string', value),
    number: (value) => assertType(is.number(value), 'number', value),
    bigint: (value) => assertType(is.bigint(value), 'bigint', value),
    // eslint-disable-next-line @typescript-eslint/ban-types
    function_: (value) => assertType(is.function_(value), 'Function', value),
    null_: (value) => assertType(is.null_(value), 'null', value),
    class_: (value) => assertType(is.class_(value), "Class" /* class_ */, value),
    boolean: (value) => assertType(is.boolean(value), 'boolean', value),
    symbol: (value) => assertType(is.symbol(value), 'symbol', value),
    numericString: (value) => assertType(is.numericString(value), "string with a number" /* numericString */, value),
    array: (value, assertion) => {
        const assert = assertType;
        assert(is.array(value), 'Array', value);
        if (assertion) {
            value.forEach(assertion);
        }
    },
    buffer: (value) => assertType(is.buffer(value), 'Buffer', value),
    nullOrUndefined: (value) => assertType(is.nullOrUndefined(value), "null or undefined" /* nullOrUndefined */, value),
    object: (value) => assertType(is.object(value), 'Object', value),
    iterable: (value) => assertType(is.iterable(value), "Iterable" /* iterable */, value),
    asyncIterable: (value) => assertType(is.asyncIterable(value), "AsyncIterable" /* asyncIterable */, value),
    generator: (value) => assertType(is.generator(value), 'Generator', value),
    asyncGenerator: (value) => assertType(is.asyncGenerator(value), 'AsyncGenerator', value),
    nativePromise: (value) => assertType(is.nativePromise(value), "native Promise" /* nativePromise */, value),
    promise: (value) => assertType(is.promise(value), 'Promise', value),
    generatorFunction: (value) => assertType(is.generatorFunction(value), 'GeneratorFunction', value),
    asyncGeneratorFunction: (value) => assertType(is.asyncGeneratorFunction(value), 'AsyncGeneratorFunction', value),
    // eslint-disable-next-line @typescript-eslint/ban-types
    asyncFunction: (value) => assertType(is.asyncFunction(value), 'AsyncFunction', value),
    // eslint-disable-next-line @typescript-eslint/ban-types
    boundFunction: (value) => assertType(is.boundFunction(value), 'Function', value),
    regExp: (value) => assertType(is.regExp(value), 'RegExp', value),
    date: (value) => assertType(is.date(value), 'Date', value),
    error: (value) => assertType(is.error(value), 'Error', value),
    map: (value) => assertType(is.map(value), 'Map', value),
    set: (value) => assertType(is.set(value), 'Set', value),
    weakMap: (value) => assertType(is.weakMap(value), 'WeakMap', value),
    weakSet: (value) => assertType(is.weakSet(value), 'WeakSet', value),
    int8Array: (value) => assertType(is.int8Array(value), 'Int8Array', value),
    uint8Array: (value) => assertType(is.uint8Array(value), 'Uint8Array', value),
    uint8ClampedArray: (value) => assertType(is.uint8ClampedArray(value), 'Uint8ClampedArray', value),
    int16Array: (value) => assertType(is.int16Array(value), 'Int16Array', value),
    uint16Array: (value) => assertType(is.uint16Array(value), 'Uint16Array', value),
    int32Array: (value) => assertType(is.int32Array(value), 'Int32Array', value),
    uint32Array: (value) => assertType(is.uint32Array(value), 'Uint32Array', value),
    float32Array: (value) => assertType(is.float32Array(value), 'Float32Array', value),
    float64Array: (value) => assertType(is.float64Array(value), 'Float64Array', value),
    bigInt64Array: (value) => assertType(is.bigInt64Array(value), 'BigInt64Array', value),
    bigUint64Array: (value) => assertType(is.bigUint64Array(value), 'BigUint64Array', value),
    arrayBuffer: (value) => assertType(is.arrayBuffer(value), 'ArrayBuffer', value),
    sharedArrayBuffer: (value) => assertType(is.sharedArrayBuffer(value), 'SharedArrayBuffer', value),
    dataView: (value) => assertType(is.dataView(value), 'DataView', value),
    urlInstance: (value) => assertType(is.urlInstance(value), 'URL', value),
    urlString: (value) => assertType(is.urlString(value), "string with a URL" /* urlString */, value),
    truthy: (value) => assertType(is.truthy(value), "truthy" /* truthy */, value),
    falsy: (value) => assertType(is.falsy(value), "falsy" /* falsy */, value),
    nan: (value) => assertType(is.nan(value), "NaN" /* nan */, value),
    primitive: (value) => assertType(is.primitive(value), "primitive" /* primitive */, value),
    integer: (value) => assertType(is.integer(value), "integer" /* integer */, value),
    safeInteger: (value) => assertType(is.safeInteger(value), "integer" /* safeInteger */, value),
    plainObject: (value) => assertType(is.plainObject(value), "plain object" /* plainObject */, value),
    typedArray: (value) => assertType(is.typedArray(value), "TypedArray" /* typedArray */, value),
    arrayLike: (value) => assertType(is.arrayLike(value), "array-like" /* arrayLike */, value),
    domElement: (value) => assertType(is.domElement(value), "HTMLElement" /* domElement */, value),
    observable: (value) => assertType(is.observable(value), 'Observable', value),
    nodeStream: (value) => assertType(is.nodeStream(value), "Node.js Stream" /* nodeStream */, value),
    infinite: (value) => assertType(is.infinite(value), "infinite number" /* infinite */, value),
    emptyArray: (value) => assertType(is.emptyArray(value), "empty array" /* emptyArray */, value),
    nonEmptyArray: (value) => assertType(is.nonEmptyArray(value), "non-empty array" /* nonEmptyArray */, value),
    emptyString: (value) => assertType(is.emptyString(value), "empty string" /* emptyString */, value),
    nonEmptyString: (value) => assertType(is.nonEmptyString(value), "non-empty string" /* nonEmptyString */, value),
    emptyStringOrWhitespace: (value) => assertType(is.emptyStringOrWhitespace(value), "empty string or whitespace" /* emptyStringOrWhitespace */, value),
    emptyObject: (value) => assertType(is.emptyObject(value), "empty object" /* emptyObject */, value),
    nonEmptyObject: (value) => assertType(is.nonEmptyObject(value), "non-empty object" /* nonEmptyObject */, value),
    emptySet: (value) => assertType(is.emptySet(value), "empty set" /* emptySet */, value),
    nonEmptySet: (value) => assertType(is.nonEmptySet(value), "non-empty set" /* nonEmptySet */, value),
    emptyMap: (value) => assertType(is.emptyMap(value), "empty map" /* emptyMap */, value),
    nonEmptyMap: (value) => assertType(is.nonEmptyMap(value), "non-empty map" /* nonEmptyMap */, value),
    // Numbers.
    evenInteger: (value) => assertType(is.evenInteger(value), "even integer" /* evenInteger */, value),
    oddInteger: (value) => assertType(is.oddInteger(value), "odd integer" /* oddInteger */, value),
    // Two arguments.
    directInstanceOf: (instance, class_) => assertType(is.directInstanceOf(instance, class_), "T" /* directInstanceOf */, instance),
    inRange: (value, range) => assertType(is.inRange(value, range), "in range" /* inRange */, value),
    // Variadic functions.
    any: (predicate, ...values) => assertType(is.any(predicate, ...values), "predicate returns truthy for any value" /* any */, values),
    all: (predicate, ...values) => assertType(is.all(predicate, ...values), "predicate returns truthy for all values" /* all */, values)
};
// Some few keywords are reserved, but we'll populate them for Node.js users
// See https://github.com/Microsoft/TypeScript/issues/2536
Object.defineProperties(is, {
    class: {
        value: is.class_
    },
    function: {
        value: is.function_
    },
    null: {
        value: is.null_
    }
});
Object.defineProperties(exports.assert, {
    class: {
        value: exports.assert.class_
    },
    function: {
        value: exports.assert.function_
    },
    null: {
        value: exports.assert.null_
    }
});
exports.default = is;
// For CommonJS default export support
module.exports = is;
module.exports.default = is;
module.exports.assert = exports.assert;


/***/ }),

/***/ 537:
/***/ (function(module) {

"use strict";


// We define these manually to ensure they're always copied
// even if they would move up the prototype chain
// https://nodejs.org/api/http.html#http_class_http_incomingmessage
const knownProperties = [
	'aborted',
	'complete',
	'headers',
	'httpVersion',
	'httpVersionMinor',
	'httpVersionMajor',
	'method',
	'rawHeaders',
	'rawTrailers',
	'setTimeout',
	'socket',
	'statusCode',
	'statusMessage',
	'trailers',
	'url'
];

module.exports = (fromStream, toStream) => {
	if (toStream._readableState.autoDestroy) {
		throw new Error('The second stream must have the `autoDestroy` option set to `false`');
	}

	const fromProperties = new Set(Object.keys(fromStream).concat(knownProperties));

	const properties = {};

	for (const property of fromProperties) {
		// Don't overwrite existing properties.
		if (property in toStream) {
			continue;
		}

		properties[property] = {
			get() {
				const value = fromStream[property];
				const isFunction = typeof value === 'function';

				return isFunction ? value.bind(fromStream) : value;
			},
			set(value) {
				fromStream[property] = value;
			},
			enumerable: true,
			configurable: false
		};
	}

	Object.defineProperties(toStream, properties);

	fromStream.once('aborted', () => {
		toStream.destroy();

		toStream.emit('aborted');
	});

	fromStream.once('close', () => {
		if (fromStream.complete) {
			if (toStream.readable) {
				toStream.once('end', () => {
					toStream.emit('close');
				});
			} else {
				toStream.emit('close');
			}
		} else {
			toStream.emit('close');
		}
	});

	return toStream;
};


/***/ }),

/***/ 557:
/***/ (function(module) {

"use strict";


class CancelError extends Error {
	constructor(reason) {
		super(reason || 'Promise was canceled');
		this.name = 'CancelError';
	}

	get isCanceled() {
		return true;
	}
}

class PCancelable {
	static fn(userFn) {
		return (...arguments_) => {
			return new PCancelable((resolve, reject, onCancel) => {
				arguments_.push(onCancel);
				// eslint-disable-next-line promise/prefer-await-to-then
				userFn(...arguments_).then(resolve, reject);
			});
		};
	}

	constructor(executor) {
		this._cancelHandlers = [];
		this._isPending = true;
		this._isCanceled = false;
		this._rejectOnCancel = true;

		this._promise = new Promise((resolve, reject) => {
			this._reject = reject;

			const onResolve = value => {
				this._isPending = false;
				resolve(value);
			};

			const onReject = error => {
				this._isPending = false;
				reject(error);
			};

			const onCancel = handler => {
				if (!this._isPending) {
					throw new Error('The `onCancel` handler was attached after the promise settled.');
				}

				this._cancelHandlers.push(handler);
			};

			Object.defineProperties(onCancel, {
				shouldReject: {
					get: () => this._rejectOnCancel,
					set: boolean => {
						this._rejectOnCancel = boolean;
					}
				}
			});

			return executor(onResolve, onReject, onCancel);
		});
	}

	then(onFulfilled, onRejected) {
		// eslint-disable-next-line promise/prefer-await-to-then
		return this._promise.then(onFulfilled, onRejected);
	}

	catch(onRejected) {
		return this._promise.catch(onRejected);
	}

	finally(onFinally) {
		return this._promise.finally(onFinally);
	}

	cancel(reason) {
		if (!this._isPending || this._isCanceled) {
			return;
		}

		if (this._cancelHandlers.length > 0) {
			try {
				for (const handler of this._cancelHandlers) {
					handler();
				}
			} catch (error) {
				this._reject(error);
			}
		}

		this._isCanceled = true;
		if (this._rejectOnCancel) {
			this._reject(new CancelError(reason));
		}
	}

	get isCanceled() {
		return this._isCanceled;
	}
}

Object.setPrototypeOf(PCancelable.prototype, Promise.prototype);

module.exports = PCancelable;
module.exports.CancelError = CancelError;


/***/ }),

/***/ 565:
/***/ (function(module) {

module.exports = require("http2");

/***/ }),

/***/ 570:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {
	V4MAPPED,
	ADDRCONFIG,
	ALL,
	promises: {
		Resolver: AsyncResolver
	},
	lookup: dnsLookup
} = __webpack_require__(881);
const {promisify} = __webpack_require__(669);
const os = __webpack_require__(87);

const kCacheableLookupCreateConnection = Symbol('cacheableLookupCreateConnection');
const kCacheableLookupInstance = Symbol('cacheableLookupInstance');
const kExpires = Symbol('expires');

const supportsALL = typeof ALL === 'number';

const verifyAgent = agent => {
	if (!(agent && typeof agent.createConnection === 'function')) {
		throw new Error('Expected an Agent instance as the first argument');
	}
};

const map4to6 = entries => {
	for (const entry of entries) {
		if (entry.family === 6) {
			continue;
		}

		entry.address = `::ffff:${entry.address}`;
		entry.family = 6;
	}
};

const getIfaceInfo = () => {
	let has4 = false;
	let has6 = false;

	for (const device of Object.values(os.networkInterfaces())) {
		for (const iface of device) {
			if (iface.internal) {
				continue;
			}

			if (iface.family === 'IPv6') {
				has6 = true;
			} else {
				has4 = true;
			}

			if (has4 && has6) {
				return {has4, has6};
			}
		}
	}

	return {has4, has6};
};

const isIterable = map => {
	return Symbol.iterator in map;
};

const ttl = {ttl: true};
const all = {all: true};

class CacheableLookup {
	constructor({
		cache = new Map(),
		maxTtl = Infinity,
		fallbackDuration = 3600,
		errorTtl = 0.15,
		resolver = new AsyncResolver(),
		lookup = dnsLookup
	} = {}) {
		this.maxTtl = maxTtl;
		this.errorTtl = errorTtl;

		this._cache = cache;
		this._resolver = resolver;
		this._dnsLookup = promisify(lookup);

		if (this._resolver instanceof AsyncResolver) {
			this._resolve4 = this._resolver.resolve4.bind(this._resolver);
			this._resolve6 = this._resolver.resolve6.bind(this._resolver);
		} else {
			this._resolve4 = promisify(this._resolver.resolve4.bind(this._resolver));
			this._resolve6 = promisify(this._resolver.resolve6.bind(this._resolver));
		}

		this._iface = getIfaceInfo();

		this._pending = {};
		this._nextRemovalTime = false;
		this._hostnamesToFallback = new Set();

		if (fallbackDuration < 1) {
			this._fallback = false;
		} else {
			this._fallback = true;

			const interval = setInterval(() => {
				this._hostnamesToFallback.clear();
			}, fallbackDuration * 1000);

			/* istanbul ignore next: There is no `interval.unref()` when running inside an Electron renderer */
			if (interval.unref) {
				interval.unref();
			}
		}

		this.lookup = this.lookup.bind(this);
		this.lookupAsync = this.lookupAsync.bind(this);
	}

	set servers(servers) {
		this.clear();

		this._resolver.setServers(servers);
	}

	get servers() {
		return this._resolver.getServers();
	}

	lookup(hostname, options, callback) {
		if (typeof options === 'function') {
			callback = options;
			options = {};
		} else if (typeof options === 'number') {
			options = {
				family: options
			};
		}

		if (!callback) {
			throw new Error('Callback must be a function.');
		}

		// eslint-disable-next-line promise/prefer-await-to-then
		this.lookupAsync(hostname, options).then(result => {
			if (options.all) {
				callback(null, result);
			} else {
				callback(null, result.address, result.family, result.expires, result.ttl);
			}
		}, callback);
	}

	async lookupAsync(hostname, options = {}) {
		if (typeof options === 'number') {
			options = {
				family: options
			};
		}

		let cached = await this.query(hostname);

		if (options.family === 6) {
			const filtered = cached.filter(entry => entry.family === 6);

			if (options.hints & V4MAPPED) {
				if ((supportsALL && options.hints & ALL) || filtered.length === 0) {
					map4to6(cached);
				} else {
					cached = filtered;
				}
			} else {
				cached = filtered;
			}
		} else if (options.family === 4) {
			cached = cached.filter(entry => entry.family === 4);
		}

		if (options.hints & ADDRCONFIG) {
			const {_iface} = this;
			cached = cached.filter(entry => entry.family === 6 ? _iface.has6 : _iface.has4);
		}

		if (cached.length === 0) {
			const error = new Error(`cacheableLookup ENOTFOUND ${hostname}`);
			error.code = 'ENOTFOUND';
			error.hostname = hostname;

			throw error;
		}

		if (options.all) {
			return cached;
		}

		return cached[0];
	}

	async query(hostname) {
		let cached = await this._cache.get(hostname);

		if (!cached) {
			const pending = this._pending[hostname];

			if (pending) {
				cached = await pending;
			} else {
				const newPromise = this.queryAndCache(hostname);
				this._pending[hostname] = newPromise;

				try {
					cached = await newPromise;
				} finally {
					delete this._pending[hostname];
				}
			}
		}

		cached = cached.map(entry => {
			return {...entry};
		});

		return cached;
	}

	async _resolve(hostname) {
		const wrap = async promise => {
			try {
				return await promise;
			} catch (error) {
				if (error.code === 'ENODATA' || error.code === 'ENOTFOUND') {
					return [];
				}

				throw error;
			}
		};

		// ANY is unsafe as it doesn't trigger new queries in the underlying server.
		const [A, AAAA] = await Promise.all([
			this._resolve4(hostname, ttl),
			this._resolve6(hostname, ttl)
		].map(promise => wrap(promise)));

		let aTtl = 0;
		let aaaaTtl = 0;
		let cacheTtl = 0;

		const now = Date.now();

		for (const entry of A) {
			entry.family = 4;
			entry.expires = now + (entry.ttl * 1000);

			aTtl = Math.max(aTtl, entry.ttl);
		}

		for (const entry of AAAA) {
			entry.family = 6;
			entry.expires = now + (entry.ttl * 1000);

			aaaaTtl = Math.max(aaaaTtl, entry.ttl);
		}

		if (A.length > 0) {
			if (AAAA.length > 0) {
				cacheTtl = Math.min(aTtl, aaaaTtl);
			} else {
				cacheTtl = aTtl;
			}
		} else {
			cacheTtl = aaaaTtl;
		}

		return {
			entries: [
				...A,
				...AAAA
			],
			cacheTtl
		};
	}

	async _lookup(hostname) {
		try {
			const entries = await this._dnsLookup(hostname, {
				all: true
			});

			return {
				entries,
				cacheTtl: 0
			};
		} catch (_) {
			return {
				entries: [],
				cacheTtl: 0
			};
		}
	}

	async _set(hostname, data, cacheTtl) {
		if (this.maxTtl > 0 && cacheTtl > 0) {
			cacheTtl = Math.min(cacheTtl, this.maxTtl) * 1000;
			data[kExpires] = Date.now() + cacheTtl;

			try {
				await this._cache.set(hostname, data, cacheTtl);
			} catch (error) {
				this.lookupAsync = async () => {
					const cacheError = new Error('Cache Error. Please recreate the CacheableLookup instance.');
					cacheError.cause = error;

					throw cacheError;
				};
			}

			if (isIterable(this._cache)) {
				this._tick(cacheTtl);
			}
		}
	}

	async queryAndCache(hostname) {
		if (this._hostnamesToFallback.has(hostname)) {
			return this._dnsLookup(hostname, all);
		}

		let query = await this._resolve(hostname);

		if (query.entries.length === 0 && this._fallback) {
			query = await this._lookup(hostname);

			if (query.entries.length !== 0) {
				// Use `dns.lookup(...)` for that particular hostname
				this._hostnamesToFallback.add(hostname);
			}
		}

		const cacheTtl = query.entries.length === 0 ? this.errorTtl : query.cacheTtl;
		await this._set(hostname, query.entries, cacheTtl);

		return query.entries;
	}

	_tick(ms) {
		const nextRemovalTime = this._nextRemovalTime;

		if (!nextRemovalTime || ms < nextRemovalTime) {
			clearTimeout(this._removalTimeout);

			this._nextRemovalTime = ms;

			this._removalTimeout = setTimeout(() => {
				this._nextRemovalTime = false;

				let nextExpiry = Infinity;

				const now = Date.now();

				for (const [hostname, entries] of this._cache) {
					const expires = entries[kExpires];

					if (now >= expires) {
						this._cache.delete(hostname);
					} else if (expires < nextExpiry) {
						nextExpiry = expires;
					}
				}

				if (nextExpiry !== Infinity) {
					this._tick(nextExpiry - now);
				}
			}, ms);

			/* istanbul ignore next: There is no `timeout.unref()` when running inside an Electron renderer */
			if (this._removalTimeout.unref) {
				this._removalTimeout.unref();
			}
		}
	}

	install(agent) {
		verifyAgent(agent);

		if (kCacheableLookupCreateConnection in agent) {
			throw new Error('CacheableLookup has been already installed');
		}

		agent[kCacheableLookupCreateConnection] = agent.createConnection;
		agent[kCacheableLookupInstance] = this;

		agent.createConnection = (options, callback) => {
			if (!('lookup' in options)) {
				options.lookup = this.lookup;
			}

			return agent[kCacheableLookupCreateConnection](options, callback);
		};
	}

	uninstall(agent) {
		verifyAgent(agent);

		if (agent[kCacheableLookupCreateConnection]) {
			if (agent[kCacheableLookupInstance] !== this) {
				throw new Error('The agent is not owned by this CacheableLookup instance');
			}

			agent.createConnection = agent[kCacheableLookupCreateConnection];

			delete agent[kCacheableLookupCreateConnection];
			delete agent[kCacheableLookupInstance];
		}
	}

	updateInterfaceInfo() {
		const {_iface} = this;

		this._iface = getIfaceInfo();

		if ((_iface.has4 && !this._iface.has4) || (_iface.has6 && !this._iface.has6)) {
			this._cache.clear();
		}
	}

	clear(hostname) {
		if (hostname) {
			this._cache.delete(hostname);
			return;
		}

		this._cache.clear();
	}
}

module.exports = CacheableLookup;
module.exports.default = CacheableLookup;


/***/ }),

/***/ 577:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __webpack_require__(614);
const is_1 = __webpack_require__(534);
const PCancelable = __webpack_require__(557);
const types_1 = __webpack_require__(36);
const parse_body_1 = __webpack_require__(121);
const core_1 = __webpack_require__(946);
const proxy_events_1 = __webpack_require__(628);
const get_buffer_1 = __webpack_require__(452);
const is_response_ok_1 = __webpack_require__(422);
const proxiedRequestEvents = [
    'request',
    'response',
    'redirect',
    'uploadProgress',
    'downloadProgress'
];
function asPromise(normalizedOptions) {
    let globalRequest;
    let globalResponse;
    const emitter = new events_1.EventEmitter();
    const promise = new PCancelable((resolve, reject, onCancel) => {
        const makeRequest = (retryCount) => {
            const request = new core_1.default(undefined, normalizedOptions);
            request.retryCount = retryCount;
            request._noPipe = true;
            onCancel(() => request.destroy());
            onCancel.shouldReject = false;
            onCancel(() => reject(new types_1.CancelError(request)));
            globalRequest = request;
            request.once('response', async (response) => {
                var _a;
                response.retryCount = retryCount;
                if (response.request.aborted) {
                    // Canceled while downloading - will throw a `CancelError` or `TimeoutError` error
                    return;
                }
                // Download body
                let rawBody;
                try {
                    rawBody = await get_buffer_1.default(request);
                    response.rawBody = rawBody;
                }
                catch (_b) {
                    // The same error is caught below.
                    // See request.once('error')
                    return;
                }
                if (request._isAboutToError) {
                    return;
                }
                // Parse body
                const contentEncoding = ((_a = response.headers['content-encoding']) !== null && _a !== void 0 ? _a : '').toLowerCase();
                const isCompressed = ['gzip', 'deflate', 'br'].includes(contentEncoding);
                const { options } = request;
                if (isCompressed && !options.decompress) {
                    response.body = rawBody;
                }
                else {
                    try {
                        response.body = parse_body_1.default(response, options.responseType, options.parseJson, options.encoding);
                    }
                    catch (error) {
                        // Fallback to `utf8`
                        response.body = rawBody.toString();
                        if (is_response_ok_1.isResponseOk(response)) {
                            request._beforeError(error);
                            return;
                        }
                    }
                }
                try {
                    for (const [index, hook] of options.hooks.afterResponse.entries()) {
                        // @ts-expect-error TS doesn't notice that CancelableRequest is a Promise
                        // eslint-disable-next-line no-await-in-loop
                        response = await hook(response, async (updatedOptions) => {
                            const typedOptions = core_1.default.normalizeArguments(undefined, {
                                ...updatedOptions,
                                retry: {
                                    calculateDelay: () => 0
                                },
                                throwHttpErrors: false,
                                resolveBodyOnly: false
                            }, options);
                            // Remove any further hooks for that request, because we'll call them anyway.
                            // The loop continues. We don't want duplicates (asPromise recursion).
                            typedOptions.hooks.afterResponse = typedOptions.hooks.afterResponse.slice(0, index);
                            for (const hook of typedOptions.hooks.beforeRetry) {
                                // eslint-disable-next-line no-await-in-loop
                                await hook(typedOptions);
                            }
                            const promise = asPromise(typedOptions);
                            onCancel(() => {
                                promise.catch(() => { });
                                promise.cancel();
                            });
                            return promise;
                        });
                    }
                }
                catch (error) {
                    request._beforeError(new types_1.RequestError(error.message, error, request));
                    return;
                }
                if (!is_response_ok_1.isResponseOk(response)) {
                    request._beforeError(new types_1.HTTPError(response));
                    return;
                }
                globalResponse = response;
                resolve(request.options.resolveBodyOnly ? response.body : response);
            });
            const onError = (error) => {
                if (promise.isCanceled) {
                    return;
                }
                const { options } = request;
                if (error instanceof types_1.HTTPError && !options.throwHttpErrors) {
                    const { response } = error;
                    resolve(request.options.resolveBodyOnly ? response.body : response);
                    return;
                }
                reject(error);
            };
            request.once('error', onError);
            const previousBody = request.options.body;
            request.once('retry', (newRetryCount, error) => {
                var _a, _b;
                if (previousBody === ((_a = error.request) === null || _a === void 0 ? void 0 : _a.options.body) && is_1.default.nodeStream((_b = error.request) === null || _b === void 0 ? void 0 : _b.options.body)) {
                    onError(error);
                    return;
                }
                makeRequest(newRetryCount);
            });
            proxy_events_1.default(request, emitter, proxiedRequestEvents);
        };
        makeRequest(0);
    });
    promise.on = (event, fn) => {
        emitter.on(event, fn);
        return promise;
    };
    const shortcut = (responseType) => {
        const newPromise = (async () => {
            // Wait until downloading has ended
            await promise;
            const { options } = globalResponse.request;
            return parse_body_1.default(globalResponse, responseType, options.parseJson, options.encoding);
        })();
        Object.defineProperties(newPromise, Object.getOwnPropertyDescriptors(promise));
        return newPromise;
    };
    promise.json = () => {
        const { headers } = globalRequest.options;
        if (!globalRequest.writableFinished && headers.accept === undefined) {
            headers.accept = 'application/json';
        }
        return shortcut('json');
    };
    promise.buffer = () => shortcut('buffer');
    promise.text = () => shortcut('text');
    return promise;
}
exports.default = asPromise;
__exportStar(__webpack_require__(36), exports);


/***/ }),

/***/ 594:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.retryAfterStatusCodes = void 0;
exports.retryAfterStatusCodes = new Set([413, 429, 503]);
const calculateRetryDelay = ({ attemptCount, retryOptions, error, retryAfter }) => {
    if (attemptCount > retryOptions.limit) {
        return 0;
    }
    const hasMethod = retryOptions.methods.includes(error.options.method);
    const hasErrorCode = retryOptions.errorCodes.includes(error.code);
    const hasStatusCode = error.response && retryOptions.statusCodes.includes(error.response.statusCode);
    if (!hasMethod || (!hasErrorCode && !hasStatusCode)) {
        return 0;
    }
    if (error.response) {
        if (retryAfter) {
            if (retryOptions.maxRetryAfter === undefined || retryAfter > retryOptions.maxRetryAfter) {
                return 0;
            }
            return retryAfter;
        }
        if (error.response.statusCode === 413) {
            return 0;
        }
    }
    const noise = Math.random() * 100;
    return ((2 ** (attemptCount - 1)) * 1000) + noise;
};
exports.default = calculateRetryDelay;


/***/ }),

/***/ 605:
/***/ (function(module) {

module.exports = require("http");

/***/ }),

/***/ 614:
/***/ (function(module) {

module.exports = require("events");

/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 628:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function default_1(from, to, events) {
    const fns = {};
    for (const event of events) {
        fns[event] = (...args) => {
            to.emit(event, ...args);
        };
        from.on(event, fns[event]);
    }
    return () => {
        for (const event of events) {
            from.off(event, fns[event]);
        }
    };
}
exports.default = default_1;


/***/ }),

/***/ 631:
/***/ (function(module) {

module.exports = require("net");

/***/ }),

/***/ 669:
/***/ (function(module) {

module.exports = require("util");

/***/ }),

/***/ 676:
/***/ (function(module, __unusedexports, __webpack_require__) {

const auth = __webpack_require__(151);
const secrets = __webpack_require__(461);

module.exports = {
    auth,
    secrets
};

/***/ }),

/***/ 699:
/***/ (function(module) {

"use strict";

/* istanbul ignore file: https://github.com/nodejs/node/blob/master/lib/internal/errors.js */

const makeError = (Base, key, getMessage) => {
	module.exports[key] = class NodeError extends Base {
		constructor(...args) {
			super(typeof getMessage === 'string' ? getMessage : getMessage(args));
			this.name = `${super.name} [${key}]`;
			this.code = key;
		}
	};
};

makeError(TypeError, 'ERR_INVALID_ARG_TYPE', args => {
	const type = args[0].includes('.') ? 'property' : 'argument';

	let valid = args[1];
	const isManyTypes = Array.isArray(valid);

	if (isManyTypes) {
		valid = `${valid.slice(0, -1).join(', ')} or ${valid.slice(-1)}`;
	}

	return `The "${args[0]}" ${type} must be ${isManyTypes ? 'one of' : 'of'} type ${valid}. Received ${typeof args[2]}`;
});

makeError(TypeError, 'ERR_INVALID_PROTOCOL', args => {
	return `Protocol "${args[0]}" not supported. Expected "${args[1]}"`;
});

makeError(Error, 'ERR_HTTP_HEADERS_SENT', args => {
	return `Cannot ${args[0]} headers after they are sent to the client`;
});

makeError(TypeError, 'ERR_INVALID_HTTP_TOKEN', args => {
	return `${args[0]} must be a valid HTTP token [${args[1]}]`;
});

makeError(TypeError, 'ERR_HTTP_INVALID_HEADER_VALUE', args => {
	return `Invalid value "${args[0]} for header "${args[1]}"`;
});

makeError(TypeError, 'ERR_INVALID_CHAR', args => {
	return `Invalid character in ${args[0]} [${args[1]}]`;
});


/***/ }),

/***/ 723:
/***/ (function(module) {

"use strict";


module.exports = header => {
	switch (header) {
		case ':method':
		case ':scheme':
		case ':authority':
		case ':path':
			return true;
		default:
			return false;
	}
};


/***/ }),

/***/ 738:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.dnsLookupIpVersionToFamily = exports.isDnsLookupIpVersion = void 0;
const conversionTable = {
    auto: 0,
    ipv4: 4,
    ipv6: 6
};
exports.isDnsLookupIpVersion = (value) => {
    return value in conversionTable;
};
exports.dnsLookupIpVersionToFamily = (dnsLookupIpVersion) => {
    if (exports.isDnsLookupIpVersion(dnsLookupIpVersion)) {
        return conversionTable[dnsLookupIpVersion];
    }
    throw new Error('Invalid DNS lookup IP version');
};


/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ }),

/***/ 750:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {Readable} = __webpack_require__(413);

class IncomingMessage extends Readable {
	constructor(socket, highWaterMark) {
		super({
			highWaterMark,
			autoDestroy: false
		});

		this.statusCode = null;
		this.statusMessage = '';
		this.httpVersion = '2.0';
		this.httpVersionMajor = 2;
		this.httpVersionMinor = 0;
		this.headers = {};
		this.trailers = {};
		this.req = null;

		this.aborted = false;
		this.complete = false;
		this.upgrade = null;

		this.rawHeaders = [];
		this.rawTrailers = [];

		this.socket = socket;
		this.connection = socket;

		this._dumped = false;
	}

	_destroy(error) {
		this.req._request.destroy(error);
	}

	setTimeout(ms, callback) {
		this.req.setTimeout(ms, callback);
		return this;
	}

	_dump() {
		if (!this._dumped) {
			this._dumped = true;

			this.removeAllListeners('data');
			this.resume();
		}
	}

	_read() {
		if (this.req) {
			this.req._request.resume();
		}
	}
}

module.exports = IncomingMessage;


/***/ }),

/***/ 751:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const net = __webpack_require__(631);
/* istanbul ignore file: https://github.com/nodejs/node/blob/v13.0.1/lib/_http_agent.js */

module.exports = options => {
	let servername = options.host;
	const hostHeader = options.headers && options.headers.host;

	if (hostHeader) {
		if (hostHeader.startsWith('[')) {
			const index = hostHeader.indexOf(']');
			if (index === -1) {
				servername = hostHeader;
			} else {
				servername = hostHeader.slice(1, -1);
			}
		} else {
			servername = hostHeader.split(':', 1)[0];
		}
	}

	if (net.isIP(servername)) {
		return '';
	}

	return servername;
};


/***/ }),

/***/ 761:
/***/ (function(module) {

module.exports = require("zlib");

/***/ }),

/***/ 784:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// When attaching listeners, it's very easy to forget about them.
// Especially if you do error handling and set timeouts.
// So instead of checking if it's proper to throw an error on every timeout ever,
// use this simple tool which will remove all listeners you have attached.
exports.default = () => {
    const handlers = [];
    return {
        once(origin, event, fn) {
            origin.once(event, fn);
            handlers.push({ origin, event, fn });
        },
        unhandleAll() {
            for (const handler of handlers) {
                const { origin, event, fn } = handler;
                origin.removeListener(event, fn);
            }
            handlers.length = 0;
        }
    };
};


/***/ }),

/***/ 786:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __webpack_require__(747);
const util_1 = __webpack_require__(669);
const is_1 = __webpack_require__(534);
const is_form_data_1 = __webpack_require__(460);
const statAsync = util_1.promisify(fs_1.stat);
exports.default = async (body, headers) => {
    if (headers && 'content-length' in headers) {
        return Number(headers['content-length']);
    }
    if (!body) {
        return 0;
    }
    if (is_1.default.string(body)) {
        return Buffer.byteLength(body);
    }
    if (is_1.default.buffer(body)) {
        return body.length;
    }
    if (is_form_data_1.default(body)) {
        return util_1.promisify(body.getLength.bind(body))();
    }
    if (body instanceof fs_1.ReadStream) {
        const { size } = await statAsync(body.path);
        if (size === 0) {
            return undefined;
        }
        return size;
    }
    return undefined;
};


/***/ }),

/***/ 790:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tls_1 = __webpack_require__(16);
const deferToConnect = (socket, fn) => {
    let listeners;
    if (typeof fn === 'function') {
        const connect = fn;
        listeners = { connect };
    }
    else {
        listeners = fn;
    }
    const hasConnectListener = typeof listeners.connect === 'function';
    const hasSecureConnectListener = typeof listeners.secureConnect === 'function';
    const hasCloseListener = typeof listeners.close === 'function';
    const onConnect = () => {
        if (hasConnectListener) {
            listeners.connect();
        }
        if (socket instanceof tls_1.TLSSocket && hasSecureConnectListener) {
            if (socket.authorized) {
                listeners.secureConnect();
            }
            else if (!socket.authorizationError) {
                socket.once('secureConnect', listeners.secureConnect);
            }
        }
        if (hasCloseListener) {
            socket.once('close', listeners.close);
        }
    };
    if (socket.writable && !socket.connecting) {
        onConnect();
    }
    else if (socket.connecting) {
        socket.once('connect', onConnect);
    }
    else if (socket.destroyed && hasCloseListener) {
        listeners.close(socket._hadError);
    }
};
exports.default = deferToConnect;
// For CommonJS default export support
module.exports = deferToConnect;
module.exports.default = deferToConnect;


/***/ }),

/***/ 811:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeoutError = void 0;
const net = __webpack_require__(631);
const unhandle_1 = __webpack_require__(784);
const reentry = Symbol('reentry');
const noop = () => { };
class TimeoutError extends Error {
    constructor(threshold, event) {
        super(`Timeout awaiting '${event}' for ${threshold}ms`);
        this.event = event;
        this.name = 'TimeoutError';
        this.code = 'ETIMEDOUT';
    }
}
exports.TimeoutError = TimeoutError;
exports.default = (request, delays, options) => {
    if (reentry in request) {
        return noop;
    }
    request[reentry] = true;
    const cancelers = [];
    const { once, unhandleAll } = unhandle_1.default();
    const addTimeout = (delay, callback, event) => {
        var _a;
        const timeout = setTimeout(callback, delay, delay, event);
        (_a = timeout.unref) === null || _a === void 0 ? void 0 : _a.call(timeout);
        const cancel = () => {
            clearTimeout(timeout);
        };
        cancelers.push(cancel);
        return cancel;
    };
    const { host, hostname } = options;
    const timeoutHandler = (delay, event) => {
        request.destroy(new TimeoutError(delay, event));
    };
    const cancelTimeouts = () => {
        for (const cancel of cancelers) {
            cancel();
        }
        unhandleAll();
    };
    request.once('error', error => {
        cancelTimeouts();
        // Save original behavior
        /* istanbul ignore next */
        if (request.listenerCount('error') === 0) {
            throw error;
        }
    });
    request.once('close', cancelTimeouts);
    once(request, 'response', (response) => {
        once(response, 'end', cancelTimeouts);
    });
    if (typeof delays.request !== 'undefined') {
        addTimeout(delays.request, timeoutHandler, 'request');
    }
    if (typeof delays.socket !== 'undefined') {
        const socketTimeoutHandler = () => {
            timeoutHandler(delays.socket, 'socket');
        };
        request.setTimeout(delays.socket, socketTimeoutHandler);
        // `request.setTimeout(0)` causes a memory leak.
        // We can just remove the listener and forget about the timer - it's unreffed.
        // See https://github.com/sindresorhus/got/issues/690
        cancelers.push(() => {
            request.removeListener('timeout', socketTimeoutHandler);
        });
    }
    once(request, 'socket', (socket) => {
        var _a;
        const { socketPath } = request;
        /* istanbul ignore next: hard to test */
        if (socket.connecting) {
            const hasPath = Boolean(socketPath !== null && socketPath !== void 0 ? socketPath : net.isIP((_a = hostname !== null && hostname !== void 0 ? hostname : host) !== null && _a !== void 0 ? _a : '') !== 0);
            if (typeof delays.lookup !== 'undefined' && !hasPath && typeof socket.address().address === 'undefined') {
                const cancelTimeout = addTimeout(delays.lookup, timeoutHandler, 'lookup');
                once(socket, 'lookup', cancelTimeout);
            }
            if (typeof delays.connect !== 'undefined') {
                const timeConnect = () => addTimeout(delays.connect, timeoutHandler, 'connect');
                if (hasPath) {
                    once(socket, 'connect', timeConnect());
                }
                else {
                    once(socket, 'lookup', (error) => {
                        if (error === null) {
                            once(socket, 'connect', timeConnect());
                        }
                    });
                }
            }
            if (typeof delays.secureConnect !== 'undefined' && options.protocol === 'https:') {
                once(socket, 'connect', () => {
                    const cancelTimeout = addTimeout(delays.secureConnect, timeoutHandler, 'secureConnect');
                    once(socket, 'secureConnect', cancelTimeout);
                });
            }
        }
        if (typeof delays.send !== 'undefined') {
            const timeRequest = () => addTimeout(delays.send, timeoutHandler, 'send');
            /* istanbul ignore next: hard to test */
            if (socket.connecting) {
                once(socket, 'connect', () => {
                    once(request, 'upload-complete', timeRequest());
                });
            }
            else {
                once(request, 'upload-complete', timeRequest());
            }
        }
    });
    if (typeof delays.response !== 'undefined') {
        once(request, 'upload-complete', () => {
            const cancelTimeout = addTimeout(delays.response, timeoutHandler, 'response');
            once(request, 'response', cancelTimeout);
        });
    }
    return cancelTimeouts;
};


/***/ }),

/***/ 835:
/***/ (function(module) {

module.exports = require("url");

/***/ }),

/***/ 839:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),

/***/ 861:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {Transform, PassThrough} = __webpack_require__(413);
const zlib = __webpack_require__(761);
const mimicResponse = __webpack_require__(537);

module.exports = response => {
	const contentEncoding = (response.headers['content-encoding'] || '').toLowerCase();

	if (!['gzip', 'deflate', 'br'].includes(contentEncoding)) {
		return response;
	}

	// TODO: Remove this when targeting Node.js 12.
	const isBrotli = contentEncoding === 'br';
	if (isBrotli && typeof zlib.createBrotliDecompress !== 'function') {
		response.destroy(new Error('Brotli is not supported on Node.js < 12'));
		return response;
	}

	let isEmpty = true;

	const checker = new Transform({
		transform(data, _encoding, callback) {
			isEmpty = false;

			callback(null, data);
		},

		flush(callback) {
			callback();
		}
	});

	const finalStream = new PassThrough({
		autoDestroy: false,
		destroy(error, callback) {
			response.destroy();

			callback(error);
		}
	});

	const decompressStream = isBrotli ? zlib.createBrotliDecompress() : zlib.createUnzip();

	decompressStream.once('error', error => {
		if (isEmpty && !response.readable) {
			finalStream.end();
			return;
		}

		finalStream.destroy(error);
	});

	mimicResponse(response, finalStream);
	response.pipe(checker).pipe(decompressStream).pipe(finalStream);

	return finalStream;
};


/***/ }),

/***/ 881:
/***/ (function(module) {

module.exports = require("dns");

/***/ }),

/***/ 899:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const EventEmitter = __webpack_require__(614);
const tls = __webpack_require__(16);
const http2 = __webpack_require__(565);
const QuickLRU = __webpack_require__(904);

const kCurrentStreamsCount = Symbol('currentStreamsCount');
const kRequest = Symbol('request');
const kOriginSet = Symbol('cachedOriginSet');
const kGracefullyClosing = Symbol('gracefullyClosing');

const nameKeys = [
	// `http2.connect()` options
	'maxDeflateDynamicTableSize',
	'maxSessionMemory',
	'maxHeaderListPairs',
	'maxOutstandingPings',
	'maxReservedRemoteStreams',
	'maxSendHeaderBlockLength',
	'paddingStrategy',

	// `tls.connect()` options
	'localAddress',
	'path',
	'rejectUnauthorized',
	'minDHSize',

	// `tls.createSecureContext()` options
	'ca',
	'cert',
	'clientCertEngine',
	'ciphers',
	'key',
	'pfx',
	'servername',
	'minVersion',
	'maxVersion',
	'secureProtocol',
	'crl',
	'honorCipherOrder',
	'ecdhCurve',
	'dhparam',
	'secureOptions',
	'sessionIdContext'
];

const getSortedIndex = (array, value, compare) => {
	let low = 0;
	let high = array.length;

	while (low < high) {
		const mid = (low + high) >>> 1;

		/* istanbul ignore next */
		if (compare(array[mid], value)) {
			// This never gets called because we use descending sort. Better to have this anyway.
			low = mid + 1;
		} else {
			high = mid;
		}
	}

	return low;
};

const compareSessions = (a, b) => {
	return a.remoteSettings.maxConcurrentStreams > b.remoteSettings.maxConcurrentStreams;
};

// See https://tools.ietf.org/html/rfc8336
const closeCoveredSessions = (where, session) => {
	// Clients SHOULD NOT emit new requests on any connection whose Origin
	// Set is a proper subset of another connection's Origin Set, and they
	// SHOULD close it once all outstanding requests are satisfied.
	for (const coveredSession of where) {
		if (
			// The set is a proper subset when its length is less than the other set.
			coveredSession[kOriginSet].length < session[kOriginSet].length &&

			// And the other set includes all elements of the subset.
			coveredSession[kOriginSet].every(origin => session[kOriginSet].includes(origin)) &&

			// Makes sure that the session can handle all requests from the covered session.
			coveredSession[kCurrentStreamsCount] + session[kCurrentStreamsCount] <= session.remoteSettings.maxConcurrentStreams
		) {
			// This allows pending requests to finish and prevents making new requests.
			gracefullyClose(coveredSession);
		}
	}
};

// This is basically inverted `closeCoveredSessions(...)`.
const closeSessionIfCovered = (where, coveredSession) => {
	for (const session of where) {
		if (
			coveredSession[kOriginSet].length < session[kOriginSet].length &&
			coveredSession[kOriginSet].every(origin => session[kOriginSet].includes(origin)) &&
			coveredSession[kCurrentStreamsCount] + session[kCurrentStreamsCount] <= session.remoteSettings.maxConcurrentStreams
		) {
			gracefullyClose(coveredSession);
		}
	}
};

const getSessions = ({agent, isFree}) => {
	const result = {};

	// eslint-disable-next-line guard-for-in
	for (const normalizedOptions in agent.sessions) {
		const sessions = agent.sessions[normalizedOptions];

		const filtered = sessions.filter(session => {
			const result = session[Agent.kCurrentStreamsCount] < session.remoteSettings.maxConcurrentStreams;

			return isFree ? result : !result;
		});

		if (filtered.length !== 0) {
			result[normalizedOptions] = filtered;
		}
	}

	return result;
};

const gracefullyClose = session => {
	session[kGracefullyClosing] = true;

	if (session[kCurrentStreamsCount] === 0) {
		session.close();
	}
};

class Agent extends EventEmitter {
	constructor({timeout = 60000, maxSessions = Infinity, maxFreeSessions = 10, maxCachedTlsSessions = 100} = {}) {
		super();

		// A session is considered busy when its current streams count
		// is equal to or greater than the `maxConcurrentStreams` value.

		// A session is considered free when its current streams count
		// is less than the `maxConcurrentStreams` value.

		// SESSIONS[NORMALIZED_OPTIONS] = [];
		this.sessions = {};

		// The queue for creating new sessions. It looks like this:
		// QUEUE[NORMALIZED_OPTIONS][NORMALIZED_ORIGIN] = ENTRY_FUNCTION
		//
		// The entry function has `listeners`, `completed` and `destroyed` properties.
		// `listeners` is an array of objects containing `resolve` and `reject` functions.
		// `completed` is a boolean. It's set to true after ENTRY_FUNCTION is executed.
		// `destroyed` is a boolean. If it's set to true, the session will be destroyed if hasn't connected yet.
		this.queue = {};

		// Each session will use this timeout value.
		this.timeout = timeout;

		// Max sessions in total
		this.maxSessions = maxSessions;

		// Max free sessions in total
		// TODO: decreasing `maxFreeSessions` should close some sessions
		this.maxFreeSessions = maxFreeSessions;

		this._freeSessionsCount = 0;
		this._sessionsCount = 0;

		// We don't support push streams by default.
		this.settings = {
			enablePush: false
		};

		// Reusing TLS sessions increases performance.
		this.tlsSessionCache = new QuickLRU({maxSize: maxCachedTlsSessions});
	}

	static normalizeOrigin(url, servername) {
		if (typeof url === 'string') {
			url = new URL(url);
		}

		if (servername && url.hostname !== servername) {
			url.hostname = servername;
		}

		return url.origin;
	}

	normalizeOptions(options) {
		let normalized = '';

		if (options) {
			for (const key of nameKeys) {
				if (options[key]) {
					normalized += `:${options[key]}`;
				}
			}
		}

		return normalized;
	}

	_tryToCreateNewSession(normalizedOptions, normalizedOrigin) {
		if (!(normalizedOptions in this.queue) || !(normalizedOrigin in this.queue[normalizedOptions])) {
			return;
		}

		const item = this.queue[normalizedOptions][normalizedOrigin];

		// The entry function can be run only once.
		// BUG: The session may be never created when:
		// - the first condition is false AND
		// - this function is never called with the same arguments in the future.
		if (this._sessionsCount < this.maxSessions && !item.completed) {
			item.completed = true;

			item();
		}
	}

	getSession(origin, options, listeners) {
		return new Promise((resolve, reject) => {
			if (Array.isArray(listeners)) {
				listeners = [...listeners];

				// Resolve the current promise ASAP, we're just moving the listeners.
				// They will be executed at a different time.
				resolve();
			} else {
				listeners = [{resolve, reject}];
			}

			const normalizedOptions = this.normalizeOptions(options);
			const normalizedOrigin = Agent.normalizeOrigin(origin, options && options.servername);

			if (normalizedOrigin === undefined) {
				for (const {reject} of listeners) {
					reject(new TypeError('The `origin` argument needs to be a string or an URL object'));
				}

				return;
			}

			if (normalizedOptions in this.sessions) {
				const sessions = this.sessions[normalizedOptions];

				let maxConcurrentStreams = -1;
				let currentStreamsCount = -1;
				let optimalSession;

				// We could just do this.sessions[normalizedOptions].find(...) but that isn't optimal.
				// Additionally, we are looking for session which has biggest current pending streams count.
				for (const session of sessions) {
					const sessionMaxConcurrentStreams = session.remoteSettings.maxConcurrentStreams;

					if (sessionMaxConcurrentStreams < maxConcurrentStreams) {
						break;
					}

					if (session[kOriginSet].includes(normalizedOrigin)) {
						const sessionCurrentStreamsCount = session[kCurrentStreamsCount];

						if (
							sessionCurrentStreamsCount >= sessionMaxConcurrentStreams ||
							session[kGracefullyClosing] ||
							// Unfortunately the `close` event isn't called immediately,
							// so `session.destroyed` is `true`, but `session.closed` is `false`.
							session.destroyed
						) {
							continue;
						}

						// We only need set this once.
						if (!optimalSession) {
							maxConcurrentStreams = sessionMaxConcurrentStreams;
						}

						// We're looking for the session which has biggest current pending stream count,
						// in order to minimalize the amount of active sessions.
						if (sessionCurrentStreamsCount > currentStreamsCount) {
							optimalSession = session;
							currentStreamsCount = sessionCurrentStreamsCount;
						}
					}
				}

				if (optimalSession) {
					/* istanbul ignore next: safety check */
					if (listeners.length !== 1) {
						for (const {reject} of listeners) {
							const error = new Error(
								`Expected the length of listeners to be 1, got ${listeners.length}.\n` +
								'Please report this to https://github.com/szmarczak/http2-wrapper/'
							);

							reject(error);
						}

						return;
					}

					listeners[0].resolve(optimalSession);
					return;
				}
			}

			if (normalizedOptions in this.queue) {
				if (normalizedOrigin in this.queue[normalizedOptions]) {
					// There's already an item in the queue, just attach ourselves to it.
					this.queue[normalizedOptions][normalizedOrigin].listeners.push(...listeners);

					// This shouldn't be executed here.
					// See the comment inside _tryToCreateNewSession.
					this._tryToCreateNewSession(normalizedOptions, normalizedOrigin);
					return;
				}
			} else {
				this.queue[normalizedOptions] = {};
			}

			// The entry must be removed from the queue IMMEDIATELY when:
			// 1. the session connects successfully,
			// 2. an error occurs.
			const removeFromQueue = () => {
				// Our entry can be replaced. We cannot remove the new one.
				if (normalizedOptions in this.queue && this.queue[normalizedOptions][normalizedOrigin] === entry) {
					delete this.queue[normalizedOptions][normalizedOrigin];

					if (Object.keys(this.queue[normalizedOptions]).length === 0) {
						delete this.queue[normalizedOptions];
					}
				}
			};

			// The main logic is here
			const entry = () => {
				const name = `${normalizedOrigin}:${normalizedOptions}`;
				let receivedSettings = false;

				try {
					const session = http2.connect(origin, {
						createConnection: this.createConnection,
						settings: this.settings,
						session: this.tlsSessionCache.get(name),
						...options
					});
					session[kCurrentStreamsCount] = 0;
					session[kGracefullyClosing] = false;

					const isFree = () => session[kCurrentStreamsCount] < session.remoteSettings.maxConcurrentStreams;
					let wasFree = true;

					session.socket.once('session', tlsSession => {
						this.tlsSessionCache.set(name, tlsSession);
					});

					session.once('error', error => {
						// Listeners are empty when the session successfully connected.
						for (const {reject} of listeners) {
							reject(error);
						}

						// The connection got broken, purge the cache.
						this.tlsSessionCache.delete(name);
					});

					session.setTimeout(this.timeout, () => {
						// Terminates all streams owned by this session.
						// TODO: Maybe the streams should have a "Session timed out" error?
						session.destroy();
					});

					session.once('close', () => {
						if (receivedSettings) {
							// 1. If it wasn't free then no need to decrease because
							//    it has been decreased already in session.request().
							// 2. `stream.once('close')` won't increment the count
							//    because the session is already closed.
							if (wasFree) {
								this._freeSessionsCount--;
							}

							this._sessionsCount--;

							// This cannot be moved to the stream logic,
							// because there may be a session that hadn't made a single request.
							const where = this.sessions[normalizedOptions];
							where.splice(where.indexOf(session), 1);

							if (where.length === 0) {
								delete this.sessions[normalizedOptions];
							}
						} else {
							// Broken connection
							const error = new Error('Session closed without receiving a SETTINGS frame');
							error.code = 'HTTP2WRAPPER_NOSETTINGS';

							for (const {reject} of listeners) {
								reject(error);
							}

							removeFromQueue();
						}

						// There may be another session awaiting.
						this._tryToCreateNewSession(normalizedOptions, normalizedOrigin);
					});

					// Iterates over the queue and processes listeners.
					const processListeners = () => {
						if (!(normalizedOptions in this.queue) || !isFree()) {
							return;
						}

						for (const origin of session[kOriginSet]) {
							if (origin in this.queue[normalizedOptions]) {
								const {listeners} = this.queue[normalizedOptions][origin];

								// Prevents session overloading.
								while (listeners.length !== 0 && isFree()) {
									// We assume `resolve(...)` calls `request(...)` *directly*,
									// otherwise the session will get overloaded.
									listeners.shift().resolve(session);
								}

								const where = this.queue[normalizedOptions];
								if (where[origin].listeners.length === 0) {
									delete where[origin];

									if (Object.keys(where).length === 0) {
										delete this.queue[normalizedOptions];
										break;
									}
								}

								// We're no longer free, no point in continuing.
								if (!isFree()) {
									break;
								}
							}
						}
					};

					// The Origin Set cannot shrink. No need to check if it suddenly became covered by another one.
					session.on('origin', () => {
						session[kOriginSet] = session.originSet;

						if (!isFree()) {
							// The session is full.
							return;
						}

						processListeners();

						// Close covered sessions (if possible).
						closeCoveredSessions(this.sessions[normalizedOptions], session);
					});

					session.once('remoteSettings', () => {
						// Fix Node.js bug preventing the process from exiting
						session.ref();
						session.unref();

						this._sessionsCount++;

						// The Agent could have been destroyed already.
						if (entry.destroyed) {
							const error = new Error('Agent has been destroyed');

							for (const listener of listeners) {
								listener.reject(error);
							}

							session.destroy();
							return;
						}

						session[kOriginSet] = session.originSet;

						{
							const where = this.sessions;

							if (normalizedOptions in where) {
								const sessions = where[normalizedOptions];
								sessions.splice(getSortedIndex(sessions, session, compareSessions), 0, session);
							} else {
								where[normalizedOptions] = [session];
							}
						}

						this._freeSessionsCount += 1;
						receivedSettings = true;

						this.emit('session', session);

						processListeners();
						removeFromQueue();

						// TODO: Close last recently used (or least used?) session
						if (session[kCurrentStreamsCount] === 0 && this._freeSessionsCount > this.maxFreeSessions) {
							session.close();
						}

						// Check if we haven't managed to execute all listeners.
						if (listeners.length !== 0) {
							// Request for a new session with predefined listeners.
							this.getSession(normalizedOrigin, options, listeners);
							listeners.length = 0;
						}

						// `session.remoteSettings.maxConcurrentStreams` might get increased
						session.on('remoteSettings', () => {
							processListeners();

							// In case the Origin Set changes
							closeCoveredSessions(this.sessions[normalizedOptions], session);
						});
					});

					// Shim `session.request()` in order to catch all streams
					session[kRequest] = session.request;
					session.request = (headers, streamOptions) => {
						if (session[kGracefullyClosing]) {
							throw new Error('The session is gracefully closing. No new streams are allowed.');
						}

						const stream = session[kRequest](headers, streamOptions);

						// The process won't exit until the session is closed or all requests are gone.
						session.ref();

						++session[kCurrentStreamsCount];

						if (session[kCurrentStreamsCount] === session.remoteSettings.maxConcurrentStreams) {
							this._freeSessionsCount--;
						}

						stream.once('close', () => {
							wasFree = isFree();

							--session[kCurrentStreamsCount];

							if (!session.destroyed && !session.closed) {
								closeSessionIfCovered(this.sessions[normalizedOptions], session);

								if (isFree() && !session.closed) {
									if (!wasFree) {
										this._freeSessionsCount++;

										wasFree = true;
									}

									const isEmpty = session[kCurrentStreamsCount] === 0;

									if (isEmpty) {
										session.unref();
									}

									if (
										isEmpty &&
										(
											this._freeSessionsCount > this.maxFreeSessions ||
											session[kGracefullyClosing]
										)
									) {
										session.close();
									} else {
										closeCoveredSessions(this.sessions[normalizedOptions], session);
										processListeners();
									}
								}
							}
						});

						return stream;
					};
				} catch (error) {
					for (const listener of listeners) {
						listener.reject(error);
					}

					removeFromQueue();
				}
			};

			entry.listeners = listeners;
			entry.completed = false;
			entry.destroyed = false;

			this.queue[normalizedOptions][normalizedOrigin] = entry;
			this._tryToCreateNewSession(normalizedOptions, normalizedOrigin);
		});
	}

	request(origin, options, headers, streamOptions) {
		return new Promise((resolve, reject) => {
			this.getSession(origin, options, [{
				reject,
				resolve: session => {
					try {
						resolve(session.request(headers, streamOptions));
					} catch (error) {
						reject(error);
					}
				}
			}]);
		});
	}

	createConnection(origin, options) {
		return Agent.connect(origin, options);
	}

	static connect(origin, options) {
		options.ALPNProtocols = ['h2'];

		const port = origin.port || 443;
		const host = origin.hostname || origin.host;

		if (typeof options.servername === 'undefined') {
			options.servername = host;
		}

		return tls.connect(port, host, options);
	}

	closeFreeSessions() {
		for (const sessions of Object.values(this.sessions)) {
			for (const session of sessions) {
				if (session[kCurrentStreamsCount] === 0) {
					session.close();
				}
			}
		}
	}

	destroy(reason) {
		for (const sessions of Object.values(this.sessions)) {
			for (const session of sessions) {
				session.destroy(reason);
			}
		}

		for (const entriesOfAuthority of Object.values(this.queue)) {
			for (const entry of Object.values(entriesOfAuthority)) {
				entry.destroyed = true;
			}
		}

		// New requests should NOT attach to destroyed sessions
		this.queue = {};
	}

	get freeSessions() {
		return getSessions({agent: this, isFree: true});
	}

	get busySessions() {
		return getSessions({agent: this, isFree: false});
	}
}

Agent.kCurrentStreamsCount = kCurrentStreamsCount;
Agent.kGracefullyClosing = kGracefullyClosing;

module.exports = {
	Agent,
	globalAgent: new Agent()
};


/***/ }),

/***/ 904:
/***/ (function(module) {

"use strict";


class QuickLRU {
	constructor(options = {}) {
		if (!(options.maxSize && options.maxSize > 0)) {
			throw new TypeError('`maxSize` must be a number greater than 0');
		}

		this.maxSize = options.maxSize;
		this.onEviction = options.onEviction;
		this.cache = new Map();
		this.oldCache = new Map();
		this._size = 0;
	}

	_set(key, value) {
		this.cache.set(key, value);
		this._size++;

		if (this._size >= this.maxSize) {
			this._size = 0;

			if (typeof this.onEviction === 'function') {
				for (const [key, value] of this.oldCache.entries()) {
					this.onEviction(key, value);
				}
			}

			this.oldCache = this.cache;
			this.cache = new Map();
		}
	}

	get(key) {
		if (this.cache.has(key)) {
			return this.cache.get(key);
		}

		if (this.oldCache.has(key)) {
			const value = this.oldCache.get(key);
			this.oldCache.delete(key);
			this._set(key, value);
			return value;
		}
	}

	set(key, value) {
		if (this.cache.has(key)) {
			this.cache.set(key, value);
		} else {
			this._set(key, value);
		}

		return this;
	}

	has(key) {
		return this.cache.has(key) || this.oldCache.has(key);
	}

	peek(key) {
		if (this.cache.has(key)) {
			return this.cache.get(key);
		}

		if (this.oldCache.has(key)) {
			return this.oldCache.get(key);
		}
	}

	delete(key) {
		const deleted = this.cache.delete(key);
		if (deleted) {
			this._size--;
		}

		return this.oldCache.delete(key) || deleted;
	}

	clear() {
		this.cache.clear();
		this.oldCache.clear();
		this._size = 0;
	}

	* keys() {
		for (const [key] of this) {
			yield key;
		}
	}

	* values() {
		for (const [, value] of this) {
			yield value;
		}
	}

	* [Symbol.iterator]() {
		for (const item of this.cache) {
			yield item;
		}

		for (const item of this.oldCache) {
			const [key] = item;
			if (!this.cache.has(key)) {
				yield item;
			}
		}
	}

	get size() {
		let oldCacheSize = 0;
		for (const key of this.oldCache.keys()) {
			if (!this.cache.has(key)) {
				oldCacheSize++;
			}
		}

		return Math.min(this._size + oldCacheSize, this.maxSize);
	}
}

module.exports = QuickLRU;


/***/ }),

/***/ 907:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore file: deprecated */
const url_1 = __webpack_require__(835);
const keys = [
    'protocol',
    'host',
    'hostname',
    'port',
    'pathname',
    'search'
];
exports.default = (origin, options) => {
    var _a, _b;
    if (options.path) {
        if (options.pathname) {
            throw new TypeError('Parameters `path` and `pathname` are mutually exclusive.');
        }
        if (options.search) {
            throw new TypeError('Parameters `path` and `search` are mutually exclusive.');
        }
        if (options.searchParams) {
            throw new TypeError('Parameters `path` and `searchParams` are mutually exclusive.');
        }
    }
    if (options.search && options.searchParams) {
        throw new TypeError('Parameters `search` and `searchParams` are mutually exclusive.');
    }
    if (!origin) {
        if (!options.protocol) {
            throw new TypeError('No URL protocol specified');
        }
        origin = `${options.protocol}//${(_b = (_a = options.hostname) !== null && _a !== void 0 ? _a : options.host) !== null && _b !== void 0 ? _b : ''}`;
    }
    const url = new url_1.URL(origin);
    if (options.path) {
        const searchIndex = options.path.indexOf('?');
        if (searchIndex === -1) {
            options.pathname = options.path;
        }
        else {
            options.pathname = options.path.slice(0, searchIndex);
            options.search = options.path.slice(searchIndex + 1);
        }
        delete options.path;
    }
    for (const key of keys) {
        if (options[key]) {
            url[key] = options[key].toString();
        }
    }
    return url;
};


/***/ }),

/***/ 910:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = __webpack_require__(36);
function createRejection(error, ...beforeErrorGroups) {
    const promise = (async () => {
        if (error instanceof types_1.RequestError) {
            try {
                for (const hooks of beforeErrorGroups) {
                    if (hooks) {
                        for (const hook of hooks) {
                            // eslint-disable-next-line no-await-in-loop
                            error = await hook(error);
                        }
                    }
                }
            }
            catch (error_) {
                error = error_;
            }
        }
        throw error;
    })();
    const returnPromise = () => promise;
    promise.json = returnPromise;
    promise.text = returnPromise;
    promise.buffer = returnPromise;
    promise.on = returnPromise;
    return promise;
}
exports.default = createRejection;


/***/ }),

/***/ 928:
/***/ (function(module, __unusedexports, __webpack_require__) {

// @ts-check
const core = __webpack_require__(470);
const command = __webpack_require__(431);
const got = __webpack_require__(77).default;
const jsonata = __webpack_require__(350);
const { auth: { retrieveToken }, secrets: { getSecrets } } = __webpack_require__(676);

const AUTH_METHODS = ['approle', 'token', 'github'];

async function exportSecrets() {
    const vaultUrl = core.getInput('url', { required: true });
    const vaultNamespace = core.getInput('namespace', { required: false });
    const extraHeaders = parseHeadersInput('extraHeaders', { required: false });
    const exportEnv = core.getInput('exportEnv', { required: false }) != 'false';
    const exportToken = (core.getInput('exportToken', { required: false }) || 'false').toLowerCase() != 'false';

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
        defaultOptions.https.rejectUnauthorized = false;
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

    if (exportToken === true) {
        command.issue('add-mask', vaultToken);
        core.exportVariable('VAULT_TOKEN', `${vaultToken}`);
    }

    const requests = secretRequests.map(request => {
        const { path, selector } = request;
        return request;
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

        const [path, selectorQuoted] = pathParts;

        /** @type {any} */
        const selectorAst = jsonata(selectorQuoted).ast();
        const selector = selectorQuoted.replace(new RegExp('"', 'g'), '');

        if ((selectorAst.type !== "path" || selectorAst.steps[0].stages) && selectorAst.type !== "string" && !outputVarName) {
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
        .replace('.', '__').replace(new RegExp('-', 'g'), '').replace(/[^\p{L}\p{N}_-]/gu, '');
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

/***/ 946:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.UnsupportedProtocolError = exports.ReadError = exports.TimeoutError = exports.UploadError = exports.CacheError = exports.HTTPError = exports.MaxRedirectsError = exports.RequestError = exports.setNonEnumerableProperties = exports.knownHookEvents = exports.withoutBody = exports.kIsNormalizedAlready = void 0;
const util_1 = __webpack_require__(669);
const stream_1 = __webpack_require__(413);
const fs_1 = __webpack_require__(747);
const url_1 = __webpack_require__(835);
const http = __webpack_require__(605);
const http_1 = __webpack_require__(605);
const https = __webpack_require__(211);
const http_timer_1 = __webpack_require__(490);
const cacheable_lookup_1 = __webpack_require__(570);
const CacheableRequest = __webpack_require__(390);
const decompressResponse = __webpack_require__(861);
// @ts-expect-error Missing types
const http2wrapper = __webpack_require__(157);
const lowercaseKeys = __webpack_require__(474);
const is_1 = __webpack_require__(534);
const get_body_size_1 = __webpack_require__(786);
const is_form_data_1 = __webpack_require__(460);
const proxy_events_1 = __webpack_require__(628);
const timed_out_1 = __webpack_require__(811);
const url_to_options_1 = __webpack_require__(10);
const options_to_url_1 = __webpack_require__(907);
const weakable_map_1 = __webpack_require__(48);
const get_buffer_1 = __webpack_require__(452);
const dns_ip_version_1 = __webpack_require__(738);
const is_response_ok_1 = __webpack_require__(422);
const deprecation_warning_1 = __webpack_require__(189);
const normalize_arguments_1 = __webpack_require__(992);
const calculate_retry_delay_1 = __webpack_require__(594);
const globalDnsCache = new cacheable_lookup_1.default();
const kRequest = Symbol('request');
const kResponse = Symbol('response');
const kResponseSize = Symbol('responseSize');
const kDownloadedSize = Symbol('downloadedSize');
const kBodySize = Symbol('bodySize');
const kUploadedSize = Symbol('uploadedSize');
const kServerResponsesPiped = Symbol('serverResponsesPiped');
const kUnproxyEvents = Symbol('unproxyEvents');
const kIsFromCache = Symbol('isFromCache');
const kCancelTimeouts = Symbol('cancelTimeouts');
const kStartedReading = Symbol('startedReading');
const kStopReading = Symbol('stopReading');
const kTriggerRead = Symbol('triggerRead');
const kBody = Symbol('body');
const kJobs = Symbol('jobs');
const kOriginalResponse = Symbol('originalResponse');
const kRetryTimeout = Symbol('retryTimeout');
exports.kIsNormalizedAlready = Symbol('isNormalizedAlready');
const supportsBrotli = is_1.default.string(process.versions.brotli);
exports.withoutBody = new Set(['GET', 'HEAD']);
exports.knownHookEvents = [
    'init',
    'beforeRequest',
    'beforeRedirect',
    'beforeError',
    'beforeRetry',
    // Promise-Only
    'afterResponse'
];
function validateSearchParameters(searchParameters) {
    // eslint-disable-next-line guard-for-in
    for (const key in searchParameters) {
        const value = searchParameters[key];
        if (!is_1.default.string(value) && !is_1.default.number(value) && !is_1.default.boolean(value) && !is_1.default.null_(value) && !is_1.default.undefined(value)) {
            throw new TypeError(`The \`searchParams\` value '${String(value)}' must be a string, number, boolean or null`);
        }
    }
}
function isClientRequest(clientRequest) {
    return is_1.default.object(clientRequest) && !('statusCode' in clientRequest);
}
const cacheableStore = new weakable_map_1.default();
const waitForOpenFile = async (file) => new Promise((resolve, reject) => {
    const onError = (error) => {
        reject(error);
    };
    // Node.js 12 has incomplete types
    if (!file.pending) {
        resolve();
    }
    file.once('error', onError);
    file.once('ready', () => {
        file.off('error', onError);
        resolve();
    });
});
const redirectCodes = new Set([300, 301, 302, 303, 304, 307, 308]);
const nonEnumerableProperties = [
    'context',
    'body',
    'json',
    'form'
];
exports.setNonEnumerableProperties = (sources, to) => {
    // Non enumerable properties shall not be merged
    const properties = {};
    for (const source of sources) {
        if (!source) {
            continue;
        }
        for (const name of nonEnumerableProperties) {
            if (!(name in source)) {
                continue;
            }
            properties[name] = {
                writable: true,
                configurable: true,
                enumerable: false,
                // @ts-expect-error TS doesn't see the check above
                value: source[name]
            };
        }
    }
    Object.defineProperties(to, properties);
};
/**
An error to be thrown when a request fails.
Contains a `code` property with error class code, like `ECONNREFUSED`.
*/
class RequestError extends Error {
    constructor(message, error, self) {
        var _a;
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = 'RequestError';
        this.code = error.code;
        if (self instanceof Request) {
            Object.defineProperty(this, 'request', {
                enumerable: false,
                value: self
            });
            Object.defineProperty(this, 'response', {
                enumerable: false,
                value: self[kResponse]
            });
            Object.defineProperty(this, 'options', {
                // This fails because of TS 3.7.2 useDefineForClassFields
                // Ref: https://github.com/microsoft/TypeScript/issues/34972
                enumerable: false,
                value: self.options
            });
        }
        else {
            Object.defineProperty(this, 'options', {
                // This fails because of TS 3.7.2 useDefineForClassFields
                // Ref: https://github.com/microsoft/TypeScript/issues/34972
                enumerable: false,
                value: self
            });
        }
        this.timings = (_a = this.request) === null || _a === void 0 ? void 0 : _a.timings;
        // Recover the original stacktrace
        if (is_1.default.string(error.stack) && is_1.default.string(this.stack)) {
            const indexOfMessage = this.stack.indexOf(this.message) + this.message.length;
            const thisStackTrace = this.stack.slice(indexOfMessage).split('\n').reverse();
            const errorStackTrace = error.stack.slice(error.stack.indexOf(error.message) + error.message.length).split('\n').reverse();
            // Remove duplicated traces
            while (errorStackTrace.length !== 0 && errorStackTrace[0] === thisStackTrace[0]) {
                thisStackTrace.shift();
            }
            this.stack = `${this.stack.slice(0, indexOfMessage)}${thisStackTrace.reverse().join('\n')}${errorStackTrace.reverse().join('\n')}`;
        }
    }
}
exports.RequestError = RequestError;
/**
An error to be thrown when the server redirects you more than ten times.
Includes a `response` property.
*/
class MaxRedirectsError extends RequestError {
    constructor(request) {
        super(`Redirected ${request.options.maxRedirects} times. Aborting.`, {}, request);
        this.name = 'MaxRedirectsError';
    }
}
exports.MaxRedirectsError = MaxRedirectsError;
/**
An error to be thrown when the server response code is not 2xx nor 3xx if `options.followRedirect` is `true`, but always except for 304.
Includes a `response` property.
*/
class HTTPError extends RequestError {
    constructor(response) {
        super(`Response code ${response.statusCode} (${response.statusMessage})`, {}, response.request);
        this.name = 'HTTPError';
    }
}
exports.HTTPError = HTTPError;
/**
An error to be thrown when a cache method fails.
For example, if the database goes down or there's a filesystem error.
*/
class CacheError extends RequestError {
    constructor(error, request) {
        super(error.message, error, request);
        this.name = 'CacheError';
    }
}
exports.CacheError = CacheError;
/**
An error to be thrown when the request body is a stream and an error occurs while reading from that stream.
*/
class UploadError extends RequestError {
    constructor(error, request) {
        super(error.message, error, request);
        this.name = 'UploadError';
    }
}
exports.UploadError = UploadError;
/**
An error to be thrown when the request is aborted due to a timeout.
Includes an `event` and `timings` property.
*/
class TimeoutError extends RequestError {
    constructor(error, timings, request) {
        super(error.message, error, request);
        this.name = 'TimeoutError';
        this.event = error.event;
        this.timings = timings;
    }
}
exports.TimeoutError = TimeoutError;
/**
An error to be thrown when reading from response stream fails.
*/
class ReadError extends RequestError {
    constructor(error, request) {
        super(error.message, error, request);
        this.name = 'ReadError';
    }
}
exports.ReadError = ReadError;
/**
An error to be thrown when given an unsupported protocol.
*/
class UnsupportedProtocolError extends RequestError {
    constructor(options) {
        super(`Unsupported protocol "${options.url.protocol}"`, {}, options);
        this.name = 'UnsupportedProtocolError';
    }
}
exports.UnsupportedProtocolError = UnsupportedProtocolError;
const proxiedRequestEvents = [
    'socket',
    'connect',
    'continue',
    'information',
    'upgrade',
    'timeout'
];
class Request extends stream_1.Duplex {
    constructor(url, options = {}, defaults) {
        super({
            // This must be false, to enable throwing after destroy
            // It is used for retry logic in Promise API
            autoDestroy: false,
            // It needs to be zero because we're just proxying the data to another stream
            highWaterMark: 0
        });
        this[kDownloadedSize] = 0;
        this[kUploadedSize] = 0;
        this.requestInitialized = false;
        this[kServerResponsesPiped] = new Set();
        this.redirects = [];
        this[kStopReading] = false;
        this[kTriggerRead] = false;
        this[kJobs] = [];
        this.retryCount = 0;
        // TODO: Remove this when targeting Node.js >= 12
        this._progressCallbacks = [];
        const unlockWrite = () => this._unlockWrite();
        const lockWrite = () => this._lockWrite();
        this.on('pipe', (source) => {
            source.prependListener('data', unlockWrite);
            source.on('data', lockWrite);
            source.prependListener('end', unlockWrite);
            source.on('end', lockWrite);
        });
        this.on('unpipe', (source) => {
            source.off('data', unlockWrite);
            source.off('data', lockWrite);
            source.off('end', unlockWrite);
            source.off('end', lockWrite);
        });
        this.on('pipe', source => {
            if (source instanceof http_1.IncomingMessage) {
                this.options.headers = {
                    ...source.headers,
                    ...this.options.headers
                };
            }
        });
        const { json, body, form } = options;
        if (json || body || form) {
            this._lockWrite();
        }
        if (exports.kIsNormalizedAlready in options) {
            this.options = options;
        }
        else {
            try {
                // @ts-expect-error Common TypeScript bug saying that `this.constructor` is not accessible
                this.options = this.constructor.normalizeArguments(url, options, defaults);
            }
            catch (error) {
                // TODO: Move this to `_destroy()`
                if (is_1.default.nodeStream(options.body)) {
                    options.body.destroy();
                }
                this.destroy(error);
                return;
            }
        }
        (async () => {
            var _a;
            try {
                if (this.options.body instanceof fs_1.ReadStream) {
                    await waitForOpenFile(this.options.body);
                }
                const { url: normalizedURL } = this.options;
                if (!normalizedURL) {
                    throw new TypeError('Missing `url` property');
                }
                this.requestUrl = normalizedURL.toString();
                decodeURI(this.requestUrl);
                await this._finalizeBody();
                await this._makeRequest();
                if (this.destroyed) {
                    (_a = this[kRequest]) === null || _a === void 0 ? void 0 : _a.destroy();
                    return;
                }
                // Queued writes etc.
                for (const job of this[kJobs]) {
                    job();
                }
                // Prevent memory leak
                this[kJobs].length = 0;
                this.requestInitialized = true;
            }
            catch (error) {
                if (error instanceof RequestError) {
                    this._beforeError(error);
                    return;
                }
                // This is a workaround for https://github.com/nodejs/node/issues/33335
                if (!this.destroyed) {
                    this.destroy(error);
                }
            }
        })();
    }
    static normalizeArguments(url, options, defaults) {
        var _a, _b, _c, _d, _e;
        const rawOptions = options;
        if (is_1.default.object(url) && !is_1.default.urlInstance(url)) {
            options = { ...defaults, ...url, ...options };
        }
        else {
            if (url && options && options.url !== undefined) {
                throw new TypeError('The `url` option is mutually exclusive with the `input` argument');
            }
            options = { ...defaults, ...options };
            if (url !== undefined) {
                options.url = url;
            }
            if (is_1.default.urlInstance(options.url)) {
                options.url = new url_1.URL(options.url.toString());
            }
        }
        // TODO: Deprecate URL options in Got 12.
        // Support extend-specific options
        if (options.cache === false) {
            options.cache = undefined;
        }
        if (options.dnsCache === false) {
            options.dnsCache = undefined;
        }
        // Nice type assertions
        is_1.assert.any([is_1.default.string, is_1.default.undefined], options.method);
        is_1.assert.any([is_1.default.object, is_1.default.undefined], options.headers);
        is_1.assert.any([is_1.default.string, is_1.default.urlInstance, is_1.default.undefined], options.prefixUrl);
        is_1.assert.any([is_1.default.object, is_1.default.undefined], options.cookieJar);
        is_1.assert.any([is_1.default.object, is_1.default.string, is_1.default.undefined], options.searchParams);
        is_1.assert.any([is_1.default.object, is_1.default.string, is_1.default.undefined], options.cache);
        is_1.assert.any([is_1.default.object, is_1.default.number, is_1.default.undefined], options.timeout);
        is_1.assert.any([is_1.default.object, is_1.default.undefined], options.context);
        is_1.assert.any([is_1.default.object, is_1.default.undefined], options.hooks);
        is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.decompress);
        is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.ignoreInvalidCookies);
        is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.followRedirect);
        is_1.assert.any([is_1.default.number, is_1.default.undefined], options.maxRedirects);
        is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.throwHttpErrors);
        is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.http2);
        is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.allowGetBody);
        is_1.assert.any([is_1.default.string, is_1.default.undefined], options.localAddress);
        is_1.assert.any([dns_ip_version_1.isDnsLookupIpVersion, is_1.default.undefined], options.dnsLookupIpVersion);
        is_1.assert.any([is_1.default.object, is_1.default.undefined], options.https);
        is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.rejectUnauthorized);
        if (options.https) {
            is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.https.rejectUnauthorized);
            is_1.assert.any([is_1.default.function_, is_1.default.undefined], options.https.checkServerIdentity);
            is_1.assert.any([is_1.default.string, is_1.default.object, is_1.default.array, is_1.default.undefined], options.https.certificateAuthority);
            is_1.assert.any([is_1.default.string, is_1.default.object, is_1.default.array, is_1.default.undefined], options.https.key);
            is_1.assert.any([is_1.default.string, is_1.default.object, is_1.default.array, is_1.default.undefined], options.https.certificate);
            is_1.assert.any([is_1.default.string, is_1.default.undefined], options.https.passphrase);
            is_1.assert.any([is_1.default.string, is_1.default.buffer, is_1.default.array, is_1.default.undefined], options.https.pfx);
        }
        is_1.assert.any([is_1.default.object, is_1.default.undefined], options.cacheOptions);
        // `options.method`
        if (is_1.default.string(options.method)) {
            options.method = options.method.toUpperCase();
        }
        else {
            options.method = 'GET';
        }
        // `options.headers`
        if (options.headers === (defaults === null || defaults === void 0 ? void 0 : defaults.headers)) {
            options.headers = { ...options.headers };
        }
        else {
            options.headers = lowercaseKeys({ ...(defaults === null || defaults === void 0 ? void 0 : defaults.headers), ...options.headers });
        }
        // Disallow legacy `url.Url`
        if ('slashes' in options) {
            throw new TypeError('The legacy `url.Url` has been deprecated. Use `URL` instead.');
        }
        // `options.auth`
        if ('auth' in options) {
            throw new TypeError('Parameter `auth` is deprecated. Use `username` / `password` instead.');
        }
        // `options.searchParams`
        if ('searchParams' in options) {
            if (options.searchParams && options.searchParams !== (defaults === null || defaults === void 0 ? void 0 : defaults.searchParams)) {
                let searchParameters;
                if (is_1.default.string(options.searchParams) || (options.searchParams instanceof url_1.URLSearchParams)) {
                    searchParameters = new url_1.URLSearchParams(options.searchParams);
                }
                else {
                    validateSearchParameters(options.searchParams);
                    searchParameters = new url_1.URLSearchParams();
                    // eslint-disable-next-line guard-for-in
                    for (const key in options.searchParams) {
                        const value = options.searchParams[key];
                        if (value === null) {
                            searchParameters.append(key, '');
                        }
                        else if (value !== undefined) {
                            searchParameters.append(key, value);
                        }
                    }
                }
                // `normalizeArguments()` is also used to merge options
                (_a = defaults === null || defaults === void 0 ? void 0 : defaults.searchParams) === null || _a === void 0 ? void 0 : _a.forEach((value, key) => {
                    // Only use default if one isn't already defined
                    if (!searchParameters.has(key)) {
                        searchParameters.append(key, value);
                    }
                });
                options.searchParams = searchParameters;
            }
        }
        // `options.username` & `options.password`
        options.username = (_b = options.username) !== null && _b !== void 0 ? _b : '';
        options.password = (_c = options.password) !== null && _c !== void 0 ? _c : '';
        // `options.prefixUrl` & `options.url`
        if (is_1.default.undefined(options.prefixUrl)) {
            options.prefixUrl = (_d = defaults === null || defaults === void 0 ? void 0 : defaults.prefixUrl) !== null && _d !== void 0 ? _d : '';
        }
        else {
            options.prefixUrl = options.prefixUrl.toString();
            if (options.prefixUrl !== '' && !options.prefixUrl.endsWith('/')) {
                options.prefixUrl += '/';
            }
        }
        if (is_1.default.string(options.url)) {
            if (options.url.startsWith('/')) {
                throw new Error('`input` must not start with a slash when using `prefixUrl`');
            }
            options.url = options_to_url_1.default(options.prefixUrl + options.url, options);
        }
        else if ((is_1.default.undefined(options.url) && options.prefixUrl !== '') || options.protocol) {
            options.url = options_to_url_1.default(options.prefixUrl, options);
        }
        if (options.url) {
            if ('port' in options) {
                delete options.port;
            }
            // Make it possible to change `options.prefixUrl`
            let { prefixUrl } = options;
            Object.defineProperty(options, 'prefixUrl', {
                set: (value) => {
                    const url = options.url;
                    if (!url.href.startsWith(value)) {
                        throw new Error(`Cannot change \`prefixUrl\` from ${prefixUrl} to ${value}: ${url.href}`);
                    }
                    options.url = new url_1.URL(value + url.href.slice(prefixUrl.length));
                    prefixUrl = value;
                },
                get: () => prefixUrl
            });
            // Support UNIX sockets
            let { protocol } = options.url;
            if (protocol === 'unix:') {
                protocol = 'http:';
                options.url = new url_1.URL(`http://unix${options.url.pathname}${options.url.search}`);
            }
            // Set search params
            if (options.searchParams) {
                // eslint-disable-next-line @typescript-eslint/no-base-to-string
                options.url.search = options.searchParams.toString();
            }
            // Protocol check
            if (protocol !== 'http:' && protocol !== 'https:') {
                throw new UnsupportedProtocolError(options);
            }
            // Update `username`
            if (options.username === '') {
                options.username = options.url.username;
            }
            else {
                options.url.username = options.username;
            }
            // Update `password`
            if (options.password === '') {
                options.password = options.url.password;
            }
            else {
                options.url.password = options.password;
            }
        }
        // `options.cookieJar`
        const { cookieJar } = options;
        if (cookieJar) {
            let { setCookie, getCookieString } = cookieJar;
            is_1.assert.function_(setCookie);
            is_1.assert.function_(getCookieString);
            /* istanbul ignore next: Horrible `tough-cookie` v3 check */
            if (setCookie.length === 4 && getCookieString.length === 0) {
                setCookie = util_1.promisify(setCookie.bind(options.cookieJar));
                getCookieString = util_1.promisify(getCookieString.bind(options.cookieJar));
                options.cookieJar = {
                    setCookie,
                    getCookieString: getCookieString
                };
            }
        }
        // `options.cache`
        const { cache } = options;
        if (cache) {
            if (!cacheableStore.has(cache)) {
                cacheableStore.set(cache, new CacheableRequest(((requestOptions, handler) => {
                    const result = requestOptions[kRequest](requestOptions, handler);
                    // TODO: remove this when `cacheable-request` supports async request functions.
                    if (is_1.default.promise(result)) {
                        // @ts-expect-error
                        // We only need to implement the error handler in order to support HTTP2 caching.
                        // The result will be a promise anyway.
                        result.once = (event, handler) => {
                            if (event === 'error') {
                                result.catch(handler);
                            }
                            else if (event === 'abort') {
                                // The empty catch is needed here in case when
                                // it rejects before it's `await`ed in `_makeRequest`.
                                (async () => {
                                    try {
                                        const request = (await result);
                                        request.once('abort', handler);
                                    }
                                    catch (_a) { }
                                })();
                            }
                            else {
                                /* istanbul ignore next: safety check */
                                throw new Error(`Unknown HTTP2 promise event: ${event}`);
                            }
                            return result;
                        };
                    }
                    return result;
                }), cache));
            }
        }
        // `options.cacheOptions`
        options.cacheOptions = { ...options.cacheOptions };
        // `options.dnsCache`
        if (options.dnsCache === true) {
            options.dnsCache = globalDnsCache;
        }
        else if (!is_1.default.undefined(options.dnsCache) && !options.dnsCache.lookup) {
            throw new TypeError(`Parameter \`dnsCache\` must be a CacheableLookup instance or a boolean, got ${is_1.default(options.dnsCache)}`);
        }
        // `options.timeout`
        if (is_1.default.number(options.timeout)) {
            options.timeout = { request: options.timeout };
        }
        else if (defaults && options.timeout !== defaults.timeout) {
            options.timeout = {
                ...defaults.timeout,
                ...options.timeout
            };
        }
        else {
            options.timeout = { ...options.timeout };
        }
        // `options.context`
        if (!options.context) {
            options.context = {};
        }
        // `options.hooks`
        const areHooksDefault = options.hooks === (defaults === null || defaults === void 0 ? void 0 : defaults.hooks);
        options.hooks = { ...options.hooks };
        for (const event of exports.knownHookEvents) {
            if (event in options.hooks) {
                if (is_1.default.array(options.hooks[event])) {
                    // See https://github.com/microsoft/TypeScript/issues/31445#issuecomment-576929044
                    options.hooks[event] = [...options.hooks[event]];
                }
                else {
                    throw new TypeError(`Parameter \`${event}\` must be an Array, got ${is_1.default(options.hooks[event])}`);
                }
            }
            else {
                options.hooks[event] = [];
            }
        }
        if (defaults && !areHooksDefault) {
            for (const event of exports.knownHookEvents) {
                const defaultHooks = defaults.hooks[event];
                if (defaultHooks.length > 0) {
                    // See https://github.com/microsoft/TypeScript/issues/31445#issuecomment-576929044
                    options.hooks[event] = [
                        ...defaults.hooks[event],
                        ...options.hooks[event]
                    ];
                }
            }
        }
        // DNS options
        if ('family' in options) {
            deprecation_warning_1.default('"options.family" was never documented, please use "options.dnsLookupIpVersion"');
        }
        // HTTPS options
        if (defaults === null || defaults === void 0 ? void 0 : defaults.https) {
            options.https = { ...defaults.https, ...options.https };
        }
        if ('rejectUnauthorized' in options) {
            deprecation_warning_1.default('"options.rejectUnauthorized" is now deprecated, please use "options.https.rejectUnauthorized"');
        }
        if ('checkServerIdentity' in options) {
            deprecation_warning_1.default('"options.checkServerIdentity" was never documented, please use "options.https.checkServerIdentity"');
        }
        if ('ca' in options) {
            deprecation_warning_1.default('"options.ca" was never documented, please use "options.https.certificateAuthority"');
        }
        if ('key' in options) {
            deprecation_warning_1.default('"options.key" was never documented, please use "options.https.key"');
        }
        if ('cert' in options) {
            deprecation_warning_1.default('"options.cert" was never documented, please use "options.https.certificate"');
        }
        if ('passphrase' in options) {
            deprecation_warning_1.default('"options.passphrase" was never documented, please use "options.https.passphrase"');
        }
        if ('pfx' in options) {
            deprecation_warning_1.default('"options.pfx" was never documented, please use "options.https.pfx"');
        }
        // Other options
        if ('followRedirects' in options) {
            throw new TypeError('The `followRedirects` option does not exist. Use `followRedirect` instead.');
        }
        if (options.agent) {
            for (const key in options.agent) {
                if (key !== 'http' && key !== 'https' && key !== 'http2') {
                    throw new TypeError(`Expected the \`options.agent\` properties to be \`http\`, \`https\` or \`http2\`, got \`${key}\``);
                }
            }
        }
        options.maxRedirects = (_e = options.maxRedirects) !== null && _e !== void 0 ? _e : 0;
        // Set non-enumerable properties
        exports.setNonEnumerableProperties([defaults, rawOptions], options);
        return normalize_arguments_1.default(options, defaults);
    }
    _lockWrite() {
        const onLockedWrite = () => {
            throw new TypeError('The payload has been already provided');
        };
        this.write = onLockedWrite;
        this.end = onLockedWrite;
    }
    _unlockWrite() {
        this.write = super.write;
        this.end = super.end;
    }
    async _finalizeBody() {
        const { options } = this;
        const { headers } = options;
        const isForm = !is_1.default.undefined(options.form);
        const isJSON = !is_1.default.undefined(options.json);
        const isBody = !is_1.default.undefined(options.body);
        const hasPayload = isForm || isJSON || isBody;
        const cannotHaveBody = exports.withoutBody.has(options.method) && !(options.method === 'GET' && options.allowGetBody);
        this._cannotHaveBody = cannotHaveBody;
        if (hasPayload) {
            if (cannotHaveBody) {
                throw new TypeError(`The \`${options.method}\` method cannot be used with a body`);
            }
            if ([isBody, isForm, isJSON].filter(isTrue => isTrue).length > 1) {
                throw new TypeError('The `body`, `json` and `form` options are mutually exclusive');
            }
            if (isBody &&
                !(options.body instanceof stream_1.Readable) &&
                !is_1.default.string(options.body) &&
                !is_1.default.buffer(options.body) &&
                !is_form_data_1.default(options.body)) {
                throw new TypeError('The `body` option must be a stream.Readable, string or Buffer');
            }
            if (isForm && !is_1.default.object(options.form)) {
                throw new TypeError('The `form` option must be an Object');
            }
            {
                // Serialize body
                const noContentType = !is_1.default.string(headers['content-type']);
                if (isBody) {
                    // Special case for https://github.com/form-data/form-data
                    if (is_form_data_1.default(options.body) && noContentType) {
                        headers['content-type'] = `multipart/form-data; boundary=${options.body.getBoundary()}`;
                    }
                    this[kBody] = options.body;
                }
                else if (isForm) {
                    if (noContentType) {
                        headers['content-type'] = 'application/x-www-form-urlencoded';
                    }
                    this[kBody] = (new url_1.URLSearchParams(options.form)).toString();
                }
                else {
                    if (noContentType) {
                        headers['content-type'] = 'application/json';
                    }
                    this[kBody] = options.stringifyJson(options.json);
                }
                const uploadBodySize = await get_body_size_1.default(this[kBody], options.headers);
                // See https://tools.ietf.org/html/rfc7230#section-3.3.2
                // A user agent SHOULD send a Content-Length in a request message when
                // no Transfer-Encoding is sent and the request method defines a meaning
                // for an enclosed payload body.  For example, a Content-Length header
                // field is normally sent in a POST request even when the value is 0
                // (indicating an empty payload body).  A user agent SHOULD NOT send a
                // Content-Length header field when the request message does not contain
                // a payload body and the method semantics do not anticipate such a
                // body.
                if (is_1.default.undefined(headers['content-length']) && is_1.default.undefined(headers['transfer-encoding'])) {
                    if (!cannotHaveBody && !is_1.default.undefined(uploadBodySize)) {
                        headers['content-length'] = String(uploadBodySize);
                    }
                }
            }
        }
        else if (cannotHaveBody) {
            this._lockWrite();
        }
        else {
            this._unlockWrite();
        }
        this[kBodySize] = Number(headers['content-length']) || undefined;
    }
    async _onResponseBase(response) {
        const { options } = this;
        const { url } = options;
        this[kOriginalResponse] = response;
        if (options.decompress) {
            response = decompressResponse(response);
        }
        const statusCode = response.statusCode;
        const typedResponse = response;
        typedResponse.statusMessage = typedResponse.statusMessage ? typedResponse.statusMessage : http.STATUS_CODES[statusCode];
        typedResponse.url = options.url.toString();
        typedResponse.requestUrl = this.requestUrl;
        typedResponse.redirectUrls = this.redirects;
        typedResponse.request = this;
        typedResponse.isFromCache = response.fromCache || false;
        typedResponse.ip = this.ip;
        typedResponse.retryCount = this.retryCount;
        this[kIsFromCache] = typedResponse.isFromCache;
        this[kResponseSize] = Number(response.headers['content-length']) || undefined;
        this[kResponse] = response;
        response.once('end', () => {
            this[kResponseSize] = this[kDownloadedSize];
            this.emit('downloadProgress', this.downloadProgress);
        });
        response.once('error', (error) => {
            // Force clean-up, because some packages don't do this.
            // TODO: Fix decompress-response
            response.destroy();
            this._beforeError(new ReadError(error, this));
        });
        response.once('aborted', () => {
            this._beforeError(new ReadError({
                name: 'Error',
                message: 'The server aborted pending request',
                code: 'ECONNRESET'
            }, this));
        });
        this.emit('downloadProgress', this.downloadProgress);
        const rawCookies = response.headers['set-cookie'];
        if (is_1.default.object(options.cookieJar) && rawCookies) {
            let promises = rawCookies.map(async (rawCookie) => options.cookieJar.setCookie(rawCookie, url.toString()));
            if (options.ignoreInvalidCookies) {
                promises = promises.map(async (p) => p.catch(() => { }));
            }
            try {
                await Promise.all(promises);
            }
            catch (error) {
                this._beforeError(error);
                return;
            }
        }
        if (options.followRedirect && response.headers.location && redirectCodes.has(statusCode)) {
            // We're being redirected, we don't care about the response.
            // It'd be best to abort the request, but we can't because
            // we would have to sacrifice the TCP connection. We don't want that.
            response.resume();
            if (this[kRequest]) {
                this[kCancelTimeouts]();
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete this[kRequest];
                this[kUnproxyEvents]();
            }
            const shouldBeGet = statusCode === 303 && options.method !== 'GET' && options.method !== 'HEAD';
            if (shouldBeGet || !options.methodRewriting) {
                // Server responded with "see other", indicating that the resource exists at another location,
                // and the client should request it from that location via GET or HEAD.
                options.method = 'GET';
                if ('body' in options) {
                    delete options.body;
                }
                if ('json' in options) {
                    delete options.json;
                }
                if ('form' in options) {
                    delete options.form;
                }
                this[kBody] = undefined;
                delete options.headers['content-length'];
            }
            if (this.redirects.length >= options.maxRedirects) {
                this._beforeError(new MaxRedirectsError(this));
                return;
            }
            try {
                // Do not remove. See https://github.com/sindresorhus/got/pull/214
                const redirectBuffer = Buffer.from(response.headers.location, 'binary').toString();
                // Handles invalid URLs. See https://github.com/sindresorhus/got/issues/604
                const redirectUrl = new url_1.URL(redirectBuffer, url);
                const redirectString = redirectUrl.toString();
                decodeURI(redirectString);
                // Redirecting to a different site, clear sensitive data.
                if (redirectUrl.hostname !== url.hostname || redirectUrl.port !== url.port) {
                    if ('host' in options.headers) {
                        delete options.headers.host;
                    }
                    if ('cookie' in options.headers) {
                        delete options.headers.cookie;
                    }
                    if ('authorization' in options.headers) {
                        delete options.headers.authorization;
                    }
                    if (options.username || options.password) {
                        options.username = '';
                        options.password = '';
                    }
                }
                else {
                    redirectUrl.username = options.username;
                    redirectUrl.password = options.password;
                }
                this.redirects.push(redirectString);
                options.url = redirectUrl;
                for (const hook of options.hooks.beforeRedirect) {
                    // eslint-disable-next-line no-await-in-loop
                    await hook(options, typedResponse);
                }
                this.emit('redirect', typedResponse, options);
                await this._makeRequest();
            }
            catch (error) {
                this._beforeError(error);
                return;
            }
            return;
        }
        if (options.isStream && options.throwHttpErrors && !is_response_ok_1.isResponseOk(typedResponse)) {
            this._beforeError(new HTTPError(typedResponse));
            return;
        }
        response.on('readable', () => {
            if (this[kTriggerRead]) {
                this._read();
            }
        });
        this.on('resume', () => {
            response.resume();
        });
        this.on('pause', () => {
            response.pause();
        });
        response.once('end', () => {
            this.push(null);
        });
        this.emit('response', response);
        for (const destination of this[kServerResponsesPiped]) {
            if (destination.headersSent) {
                continue;
            }
            // eslint-disable-next-line guard-for-in
            for (const key in response.headers) {
                const isAllowed = options.decompress ? key !== 'content-encoding' : true;
                const value = response.headers[key];
                if (isAllowed) {
                    destination.setHeader(key, value);
                }
            }
            destination.statusCode = statusCode;
        }
    }
    async _onResponse(response) {
        try {
            await this._onResponseBase(response);
        }
        catch (error) {
            /* istanbul ignore next: better safe than sorry */
            this._beforeError(error);
        }
    }
    _onRequest(request) {
        const { options } = this;
        const { timeout, url } = options;
        http_timer_1.default(request);
        this[kCancelTimeouts] = timed_out_1.default(request, timeout, url);
        const responseEventName = options.cache ? 'cacheableResponse' : 'response';
        request.once(responseEventName, (response) => {
            void this._onResponse(response);
        });
        request.once('error', (error) => {
            var _a;
            // Force clean-up, because some packages (e.g. nock) don't do this.
            request.destroy();
            // Node.js <= 12.18.2 mistakenly emits the response `end` first.
            (_a = request.res) === null || _a === void 0 ? void 0 : _a.removeAllListeners('end');
            error = error instanceof timed_out_1.TimeoutError ? new TimeoutError(error, this.timings, this) : new RequestError(error.message, error, this);
            this._beforeError(error);
        });
        this[kUnproxyEvents] = proxy_events_1.default(request, this, proxiedRequestEvents);
        this[kRequest] = request;
        this.emit('uploadProgress', this.uploadProgress);
        // Send body
        const body = this[kBody];
        const currentRequest = this.redirects.length === 0 ? this : request;
        if (is_1.default.nodeStream(body)) {
            body.pipe(currentRequest);
            body.once('error', (error) => {
                this._beforeError(new UploadError(error, this));
            });
        }
        else {
            this._unlockWrite();
            if (!is_1.default.undefined(body)) {
                this._writeRequest(body, undefined, () => { });
                currentRequest.end();
                this._lockWrite();
            }
            else if (this._cannotHaveBody || this._noPipe) {
                currentRequest.end();
                this._lockWrite();
            }
        }
        this.emit('request', request);
    }
    async _createCacheableRequest(url, options) {
        return new Promise((resolve, reject) => {
            // TODO: Remove `utils/url-to-options.ts` when `cacheable-request` is fixed
            Object.assign(options, url_to_options_1.default(url));
            // `http-cache-semantics` checks this
            // TODO: Fix this ignore.
            // @ts-expect-error
            delete options.url;
            let request;
            // This is ugly
            const cacheRequest = cacheableStore.get(options.cache)(options, async (response) => {
                // TODO: Fix `cacheable-response`
                response._readableState.autoDestroy = false;
                if (request) {
                    (await request).emit('cacheableResponse', response);
                }
                resolve(response);
            });
            // Restore options
            options.url = url;
            cacheRequest.once('error', reject);
            cacheRequest.once('request', async (requestOrPromise) => {
                request = requestOrPromise;
                resolve(request);
            });
        });
    }
    async _makeRequest() {
        var _a, _b, _c, _d, _e;
        const { options } = this;
        const { headers } = options;
        for (const key in headers) {
            if (is_1.default.undefined(headers[key])) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete headers[key];
            }
            else if (is_1.default.null_(headers[key])) {
                throw new TypeError(`Use \`undefined\` instead of \`null\` to delete the \`${key}\` header`);
            }
        }
        if (options.decompress && is_1.default.undefined(headers['accept-encoding'])) {
            headers['accept-encoding'] = supportsBrotli ? 'gzip, deflate, br' : 'gzip, deflate';
        }
        // Set cookies
        if (options.cookieJar) {
            const cookieString = await options.cookieJar.getCookieString(options.url.toString());
            if (is_1.default.nonEmptyString(cookieString)) {
                options.headers.cookie = cookieString;
            }
        }
        for (const hook of options.hooks.beforeRequest) {
            // eslint-disable-next-line no-await-in-loop
            const result = await hook(options);
            if (!is_1.default.undefined(result)) {
                // @ts-expect-error Skip the type mismatch to support abstract responses
                options.request = () => result;
                break;
            }
        }
        if (options.body && this[kBody] !== options.body) {
            this[kBody] = options.body;
        }
        const { agent, request, timeout, url } = options;
        if (options.dnsCache && !('lookup' in options)) {
            options.lookup = options.dnsCache.lookup;
        }
        // UNIX sockets
        if (url.hostname === 'unix') {
            const matches = /(?<socketPath>.+?):(?<path>.+)/.exec(`${url.pathname}${url.search}`);
            if (matches === null || matches === void 0 ? void 0 : matches.groups) {
                const { socketPath, path } = matches.groups;
                Object.assign(options, {
                    socketPath,
                    path,
                    host: ''
                });
            }
        }
        const isHttps = url.protocol === 'https:';
        // Fallback function
        let fallbackFn;
        if (options.http2) {
            fallbackFn = http2wrapper.auto;
        }
        else {
            fallbackFn = isHttps ? https.request : http.request;
        }
        const realFn = (_a = options.request) !== null && _a !== void 0 ? _a : fallbackFn;
        // Cache support
        const fn = options.cache ? this._createCacheableRequest : realFn;
        // Pass an agent directly when HTTP2 is disabled
        if (agent && !options.http2) {
            options.agent = agent[isHttps ? 'https' : 'http'];
        }
        // Prepare plain HTTP request options
        options[kRequest] = realFn;
        delete options.request;
        // TODO: Fix this ignore.
        // @ts-expect-error
        delete options.timeout;
        const requestOptions = options;
        requestOptions.shared = (_b = options.cacheOptions) === null || _b === void 0 ? void 0 : _b.shared;
        requestOptions.cacheHeuristic = (_c = options.cacheOptions) === null || _c === void 0 ? void 0 : _c.cacheHeuristic;
        requestOptions.immutableMinTimeToLive = (_d = options.cacheOptions) === null || _d === void 0 ? void 0 : _d.immutableMinTimeToLive;
        requestOptions.ignoreCargoCult = (_e = options.cacheOptions) === null || _e === void 0 ? void 0 : _e.ignoreCargoCult;
        // If `dnsLookupIpVersion` is not present do not override `family`
        if (options.dnsLookupIpVersion !== undefined) {
            try {
                requestOptions.family = dns_ip_version_1.dnsLookupIpVersionToFamily(options.dnsLookupIpVersion);
            }
            catch (_f) {
                throw new Error('Invalid `dnsLookupIpVersion` option value');
            }
        }
        // HTTPS options remapping
        if (options.https) {
            if ('rejectUnauthorized' in options.https) {
                requestOptions.rejectUnauthorized = options.https.rejectUnauthorized;
            }
            if (options.https.checkServerIdentity) {
                requestOptions.checkServerIdentity = options.https.checkServerIdentity;
            }
            if (options.https.certificateAuthority) {
                requestOptions.ca = options.https.certificateAuthority;
            }
            if (options.https.certificate) {
                requestOptions.cert = options.https.certificate;
            }
            if (options.https.key) {
                requestOptions.key = options.https.key;
            }
            if (options.https.passphrase) {
                requestOptions.passphrase = options.https.passphrase;
            }
            if (options.https.pfx) {
                requestOptions.pfx = options.https.pfx;
            }
        }
        try {
            let requestOrResponse = await fn(url, requestOptions);
            if (is_1.default.undefined(requestOrResponse)) {
                requestOrResponse = fallbackFn(url, requestOptions);
            }
            // Restore options
            options.request = request;
            options.timeout = timeout;
            options.agent = agent;
            // HTTPS options restore
            if (options.https) {
                if ('rejectUnauthorized' in options.https) {
                    delete requestOptions.rejectUnauthorized;
                }
                if (options.https.checkServerIdentity) {
                    // @ts-expect-error - This one will be removed when we remove the alias.
                    delete requestOptions.checkServerIdentity;
                }
                if (options.https.certificateAuthority) {
                    delete requestOptions.ca;
                }
                if (options.https.certificate) {
                    delete requestOptions.cert;
                }
                if (options.https.key) {
                    delete requestOptions.key;
                }
                if (options.https.passphrase) {
                    delete requestOptions.passphrase;
                }
                if (options.https.pfx) {
                    delete requestOptions.pfx;
                }
            }
            if (isClientRequest(requestOrResponse)) {
                this._onRequest(requestOrResponse);
                // Emit the response after the stream has been ended
            }
            else if (this.writable) {
                this.once('finish', () => {
                    void this._onResponse(requestOrResponse);
                });
                this._unlockWrite();
                this.end();
                this._lockWrite();
            }
            else {
                void this._onResponse(requestOrResponse);
            }
        }
        catch (error) {
            if (error instanceof CacheableRequest.CacheError) {
                throw new CacheError(error, this);
            }
            throw new RequestError(error.message, error, this);
        }
    }
    async _error(error) {
        try {
            for (const hook of this.options.hooks.beforeError) {
                // eslint-disable-next-line no-await-in-loop
                error = await hook(error);
            }
        }
        catch (error_) {
            error = new RequestError(error_.message, error_, this);
        }
        this.destroy(error);
    }
    _beforeError(error) {
        if (this[kStopReading]) {
            return;
        }
        const { options } = this;
        const retryCount = this.retryCount + 1;
        this[kStopReading] = true;
        if (!(error instanceof RequestError)) {
            error = new RequestError(error.message, error, this);
        }
        const typedError = error;
        const { response } = typedError;
        void (async () => {
            if (response && !response.body) {
                response.setEncoding(this._readableState.encoding);
                try {
                    response.rawBody = await get_buffer_1.default(response);
                    response.body = response.rawBody.toString();
                }
                catch (_a) { }
            }
            if (this.listenerCount('retry') !== 0) {
                let backoff;
                try {
                    let retryAfter;
                    if (response && 'retry-after' in response.headers) {
                        retryAfter = Number(response.headers['retry-after']);
                        if (Number.isNaN(retryAfter)) {
                            retryAfter = Date.parse(response.headers['retry-after']) - Date.now();
                            if (retryAfter <= 0) {
                                retryAfter = 1;
                            }
                        }
                        else {
                            retryAfter *= 1000;
                        }
                    }
                    backoff = await options.retry.calculateDelay({
                        attemptCount: retryCount,
                        retryOptions: options.retry,
                        error: typedError,
                        retryAfter,
                        computedValue: calculate_retry_delay_1.default({
                            attemptCount: retryCount,
                            retryOptions: options.retry,
                            error: typedError,
                            retryAfter,
                            computedValue: 0
                        })
                    });
                }
                catch (error_) {
                    void this._error(new RequestError(error_.message, error_, this));
                    return;
                }
                if (backoff) {
                    const retry = async () => {
                        try {
                            for (const hook of this.options.hooks.beforeRetry) {
                                // eslint-disable-next-line no-await-in-loop
                                await hook(this.options, typedError, retryCount);
                            }
                        }
                        catch (error_) {
                            void this._error(new RequestError(error_.message, error, this));
                            return;
                        }
                        // Something forced us to abort the retry
                        if (this.destroyed) {
                            return;
                        }
                        this.destroy();
                        this.emit('retry', retryCount, error);
                    };
                    this[kRetryTimeout] = setTimeout(retry, backoff);
                    return;
                }
            }
            void this._error(typedError);
        })();
    }
    _read() {
        this[kTriggerRead] = true;
        const response = this[kResponse];
        if (response && !this[kStopReading]) {
            // We cannot put this in the `if` above
            // because `.read()` also triggers the `end` event
            if (response.readableLength) {
                this[kTriggerRead] = false;
            }
            let data;
            while ((data = response.read()) !== null) {
                this[kDownloadedSize] += data.length;
                this[kStartedReading] = true;
                const progress = this.downloadProgress;
                if (progress.percent < 1) {
                    this.emit('downloadProgress', progress);
                }
                this.push(data);
            }
        }
    }
    // Node.js 12 has incorrect types, so the encoding must be a string
    _write(chunk, encoding, callback) {
        const write = () => {
            this._writeRequest(chunk, encoding, callback);
        };
        if (this.requestInitialized) {
            write();
        }
        else {
            this[kJobs].push(write);
        }
    }
    _writeRequest(chunk, encoding, callback) {
        if (this[kRequest].destroyed) {
            // Probably the `ClientRequest` instance will throw
            return;
        }
        this._progressCallbacks.push(() => {
            this[kUploadedSize] += Buffer.byteLength(chunk, encoding);
            const progress = this.uploadProgress;
            if (progress.percent < 1) {
                this.emit('uploadProgress', progress);
            }
        });
        // TODO: What happens if it's from cache? Then this[kRequest] won't be defined.
        this[kRequest].write(chunk, encoding, (error) => {
            if (!error && this._progressCallbacks.length > 0) {
                this._progressCallbacks.shift()();
            }
            callback(error);
        });
    }
    _final(callback) {
        const endRequest = () => {
            // FIX: Node.js 10 calls the write callback AFTER the end callback!
            while (this._progressCallbacks.length !== 0) {
                this._progressCallbacks.shift()();
            }
            // We need to check if `this[kRequest]` is present,
            // because it isn't when we use cache.
            if (!(kRequest in this)) {
                callback();
                return;
            }
            if (this[kRequest].destroyed) {
                callback();
                return;
            }
            this[kRequest].end((error) => {
                if (!error) {
                    this[kBodySize] = this[kUploadedSize];
                    this.emit('uploadProgress', this.uploadProgress);
                    this[kRequest].emit('upload-complete');
                }
                callback(error);
            });
        };
        if (this.requestInitialized) {
            endRequest();
        }
        else {
            this[kJobs].push(endRequest);
        }
    }
    _destroy(error, callback) {
        var _a;
        this[kStopReading] = true;
        // Prevent further retries
        clearTimeout(this[kRetryTimeout]);
        if (kRequest in this) {
            this[kCancelTimeouts]();
            // TODO: Remove the next `if` when these get fixed:
            // - https://github.com/nodejs/node/issues/32851
            if (!((_a = this[kResponse]) === null || _a === void 0 ? void 0 : _a.complete)) {
                this[kRequest].destroy();
            }
        }
        if (error !== null && !is_1.default.undefined(error) && !(error instanceof RequestError)) {
            error = new RequestError(error.message, error, this);
        }
        callback(error);
    }
    get _isAboutToError() {
        return this[kStopReading];
    }
    /**
    The remote IP address.
    */
    get ip() {
        var _a;
        return (_a = this.socket) === null || _a === void 0 ? void 0 : _a.remoteAddress;
    }
    /**
    Indicates whether the request has been aborted or not.
    */
    get aborted() {
        var _a, _b, _c;
        return ((_b = (_a = this[kRequest]) === null || _a === void 0 ? void 0 : _a.destroyed) !== null && _b !== void 0 ? _b : this.destroyed) && !((_c = this[kOriginalResponse]) === null || _c === void 0 ? void 0 : _c.complete);
    }
    get socket() {
        var _a, _b;
        return (_b = (_a = this[kRequest]) === null || _a === void 0 ? void 0 : _a.socket) !== null && _b !== void 0 ? _b : undefined;
    }
    /**
    Progress event for downloading (receiving a response).
    */
    get downloadProgress() {
        let percent;
        if (this[kResponseSize]) {
            percent = this[kDownloadedSize] / this[kResponseSize];
        }
        else if (this[kResponseSize] === this[kDownloadedSize]) {
            percent = 1;
        }
        else {
            percent = 0;
        }
        return {
            percent,
            transferred: this[kDownloadedSize],
            total: this[kResponseSize]
        };
    }
    /**
    Progress event for uploading (sending a request).
    */
    get uploadProgress() {
        let percent;
        if (this[kBodySize]) {
            percent = this[kUploadedSize] / this[kBodySize];
        }
        else if (this[kBodySize] === this[kUploadedSize]) {
            percent = 1;
        }
        else {
            percent = 0;
        }
        return {
            percent,
            transferred: this[kUploadedSize],
            total: this[kBodySize]
        };
    }
    /**
    The object contains the following properties:

    - `start` - Time when the request started.
    - `socket` - Time when a socket was assigned to the request.
    - `lookup` - Time when the DNS lookup finished.
    - `connect` - Time when the socket successfully connected.
    - `secureConnect` - Time when the socket securely connected.
    - `upload` - Time when the request finished uploading.
    - `response` - Time when the request fired `response` event.
    - `end` - Time when the response fired `end` event.
    - `error` - Time when the request fired `error` event.
    - `abort` - Time when the request fired `abort` event.
    - `phases`
        - `wait` - `timings.socket - timings.start`
        - `dns` - `timings.lookup - timings.socket`
        - `tcp` - `timings.connect - timings.lookup`
        - `tls` - `timings.secureConnect - timings.connect`
        - `request` - `timings.upload - (timings.secureConnect || timings.connect)`
        - `firstByte` - `timings.response - timings.upload`
        - `download` - `timings.end - timings.response`
        - `total` - `(timings.end || timings.error || timings.abort) - timings.start`

    If something has not been measured yet, it will be `undefined`.

    __Note__: The time is a `number` representing the milliseconds elapsed since the UNIX epoch.
    */
    get timings() {
        var _a;
        return (_a = this[kRequest]) === null || _a === void 0 ? void 0 : _a.timings;
    }
    /**
    Whether the response was retrieved from the cache.
    */
    get isFromCache() {
        return this[kIsFromCache];
    }
    pipe(destination, options) {
        if (this[kStartedReading]) {
            throw new Error('Failed to pipe. The response has been emitted already.');
        }
        if (destination instanceof http_1.ServerResponse) {
            this[kServerResponsesPiped].add(destination);
        }
        return super.pipe(destination, options);
    }
    unpipe(destination) {
        if (destination instanceof http_1.ServerResponse) {
            this[kServerResponsesPiped].delete(destination);
        }
        super.unpipe(destination);
        return this;
    }
}
exports.default = Request;


/***/ }),

/***/ 988:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const http = __webpack_require__(605);
const https = __webpack_require__(211);
const resolveALPN = __webpack_require__(524);
const QuickLRU = __webpack_require__(904);
const Http2ClientRequest = __webpack_require__(181);
const calculateServerName = __webpack_require__(751);
const urlToOptions = __webpack_require__(507);

const cache = new QuickLRU({maxSize: 100});
const queue = new Map();

const installSocket = (agent, socket, options) => {
	socket._httpMessage = {shouldKeepAlive: true};

	const onFree = () => {
		agent.emit('free', socket, options);
	};

	socket.on('free', onFree);

	const onClose = () => {
		agent.removeSocket(socket, options);
	};

	socket.on('close', onClose);

	const onRemove = () => {
		agent.removeSocket(socket, options);
		socket.off('close', onClose);
		socket.off('free', onFree);
		socket.off('agentRemove', onRemove);
	};

	socket.on('agentRemove', onRemove);

	agent.emit('free', socket, options);
};

const resolveProtocol = async options => {
	const name = `${options.host}:${options.port}:${options.ALPNProtocols.sort()}`;

	if (!cache.has(name)) {
		if (queue.has(name)) {
			const result = await queue.get(name);
			return result.alpnProtocol;
		}

		const {path, agent} = options;
		options.path = options.socketPath;

		const resultPromise = resolveALPN(options);
		queue.set(name, resultPromise);

		try {
			const {socket, alpnProtocol} = await resultPromise;
			cache.set(name, alpnProtocol);

			options.path = path;

			if (alpnProtocol === 'h2') {
				// https://github.com/nodejs/node/issues/33343
				socket.destroy();
			} else {
				const {globalAgent} = https;
				const defaultCreateConnection = https.Agent.prototype.createConnection;

				if (agent) {
					if (agent.createConnection === defaultCreateConnection) {
						installSocket(agent, socket, options);
					} else {
						socket.destroy();
					}
				} else if (globalAgent.createConnection === defaultCreateConnection) {
					installSocket(globalAgent, socket, options);
				} else {
					socket.destroy();
				}
			}

			queue.delete(name);

			return alpnProtocol;
		} catch (error) {
			queue.delete(name);

			throw error;
		}
	}

	return cache.get(name);
};

module.exports = async (input, options, callback) => {
	if (typeof input === 'string' || input instanceof URL) {
		input = urlToOptions(new URL(input));
	}

	if (typeof options === 'function') {
		callback = options;
		options = undefined;
	}

	options = {
		ALPNProtocols: ['h2', 'http/1.1'],
		...input,
		...options,
		resolveSocket: true
	};

	if (!Array.isArray(options.ALPNProtocols) || options.ALPNProtocols.length === 0) {
		throw new Error('The `ALPNProtocols` option must be an Array with at least one entry');
	}

	options.protocol = options.protocol || 'https:';
	const isHttps = options.protocol === 'https:';

	options.host = options.hostname || options.host || 'localhost';
	options.session = options.tlsSession;
	options.servername = options.servername || calculateServerName(options);
	options.port = options.port || (isHttps ? 443 : 80);
	options._defaultAgent = isHttps ? https.globalAgent : http.globalAgent;

	const agents = options.agent;

	if (agents) {
		if (agents.addRequest) {
			throw new Error('The `options.agent` object can contain only `http`, `https` or `http2` properties');
		}

		options.agent = agents[isHttps ? 'https' : 'http'];
	}

	if (isHttps) {
		const protocol = await resolveProtocol(options);

		if (protocol === 'h2') {
			if (agents) {
				options.agent = agents.http2;
			}

			return new Http2ClientRequest(options, callback);
		}
	}

	return http.request(options, callback);
};

module.exports.protocolCache = cache;


/***/ }),

/***/ 992:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = __webpack_require__(534);
const normalizeArguments = (options, defaults) => {
    if (is_1.default.null_(options.encoding)) {
        throw new TypeError('To get a Buffer, set `options.responseType` to `buffer` instead');
    }
    is_1.assert.any([is_1.default.string, is_1.default.undefined], options.encoding);
    is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.resolveBodyOnly);
    is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.methodRewriting);
    is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.isStream);
    is_1.assert.any([is_1.default.string, is_1.default.undefined], options.responseType);
    // `options.responseType`
    if (options.responseType === undefined) {
        options.responseType = 'text';
    }
    // `options.retry`
    const { retry } = options;
    if (defaults) {
        options.retry = { ...defaults.retry };
    }
    else {
        options.retry = {
            calculateDelay: retryObject => retryObject.computedValue,
            limit: 0,
            methods: [],
            statusCodes: [],
            errorCodes: [],
            maxRetryAfter: undefined
        };
    }
    if (is_1.default.object(retry)) {
        options.retry = {
            ...options.retry,
            ...retry
        };
        options.retry.methods = [...new Set(options.retry.methods.map(method => method.toUpperCase()))];
        options.retry.statusCodes = [...new Set(options.retry.statusCodes)];
        options.retry.errorCodes = [...new Set(options.retry.errorCodes)];
    }
    else if (is_1.default.number(retry)) {
        options.retry.limit = retry;
    }
    if (is_1.default.undefined(options.retry.maxRetryAfter)) {
        options.retry.maxRetryAfter = Math.min(
        // TypeScript is not smart enough to handle `.filter(x => is.number(x))`.
        // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
        ...[options.timeout.request, options.timeout.connect].filter(is_1.default.number));
    }
    // `options.pagination`
    if (is_1.default.object(options.pagination)) {
        if (defaults) {
            options.pagination = {
                ...defaults.pagination,
                ...options.pagination
            };
        }
        const { pagination } = options;
        if (!is_1.default.function_(pagination.transform)) {
            throw new Error('`options.pagination.transform` must be implemented');
        }
        if (!is_1.default.function_(pagination.shouldContinue)) {
            throw new Error('`options.pagination.shouldContinue` must be implemented');
        }
        if (!is_1.default.function_(pagination.filter)) {
            throw new TypeError('`options.pagination.filter` must be implemented');
        }
        if (!is_1.default.function_(pagination.paginate)) {
            throw new Error('`options.pagination.paginate` must be implemented');
        }
    }
    // JSON mode
    if (options.responseType === 'json' && options.headers.accept === undefined) {
        options.headers.accept = 'application/json';
    }
    return options;
};
exports.default = normalizeArguments;


/***/ }),

/***/ 997:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {constants: BufferConstants} = __webpack_require__(293);
const pump = __webpack_require__(453);
const bufferStream = __webpack_require__(375);

class MaxBufferError extends Error {
	constructor() {
		super('maxBuffer exceeded');
		this.name = 'MaxBufferError';
	}
}

async function getStream(inputStream, options) {
	if (!inputStream) {
		return Promise.reject(new Error('Expected a stream'));
	}

	options = {
		maxBuffer: Infinity,
		...options
	};

	const {maxBuffer} = options;

	let stream;
	await new Promise((resolve, reject) => {
		const rejectPromise = error => {
			// Don't retrieve an oversized buffer.
			if (error && stream.getBufferedLength() <= BufferConstants.MAX_LENGTH) {
				error.bufferedData = stream.getBufferedValue();
			}

			reject(error);
		};

		stream = pump(inputStream, bufferStream(options), error => {
			if (error) {
				rejectPromise(error);
				return;
			}

			resolve();
		});

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				rejectPromise(new MaxBufferError());
			}
		});
	});

	return stream.getBufferedValue();
}

module.exports = getStream;
// TODO: Remove this for the next major release
module.exports.default = getStream;
module.exports.buffer = (stream, options) => getStream(stream, {...options, encoding: 'buffer'});
module.exports.array = (stream, options) => getStream(stream, {...options, array: true});
module.exports.MaxBufferError = MaxBufferError;


/***/ })

/******/ });