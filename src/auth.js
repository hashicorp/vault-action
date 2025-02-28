// @ts-check
const core = require('@actions/core');
const rsasign = require('jsrsasign');
const fs = require('fs');
const { default: got } = require('got');

const defaultKubernetesTokenPath = '/var/run/secrets/kubernetes.io/serviceaccount/token'
const retries = 5
const retries_delay = 3000
/***
 * Authenticate with Vault and retrieve a Vault token that can be used for requests.
 * @param {string} method
 * @param {import('got').Got} client
 */
async function retrieveToken(method, client) {
    let path = core.getInput('path', { required: false }) || method;
    path = `v1/auth/${path}/login`

    switch (method) {
        case 'approle': {
            const vaultRoleId = core.getInput('roleId', { required: true });
            const vaultSecretId = core.getInput('secretId', { required: false });
            return await getClientToken(client, method, path, { role_id: vaultRoleId, secret_id: vaultSecretId });
        }
        case 'github': {
            const githubToken = core.getInput('githubToken', { required: true });
            return await getClientToken(client, method, path, { token: githubToken });
        }
        case 'jwt': {
            /** @type {string} */
            let jwt;
            const role = core.getInput('role', { required: false });
            const privateKeyRaw = core.getInput('jwtPrivateKey', { required: false });
            const privateKey = Buffer.from(privateKeyRaw, 'base64').toString();
            const keyPassword = core.getInput('jwtKeyPassword', { required: false });
            const tokenTtl = core.getInput('jwtTtl', { required: false }) || '3600'; // 1 hour
            const githubAudience = core.getInput('jwtGithubAudience', { required: false });

            if (!privateKey) {
                jwt = await retryAsyncFunction(retries, retries_delay, core.getIDToken, githubAudience)
                  .then((result) => {
                    return result;
                });
            } else {
                jwt = generateJwt(privateKey, keyPassword, Number(tokenTtl));
            }

            return await getClientToken(client, method, path, { jwt: jwt, role: role });
        }
        case 'kubernetes': {
            const role = core.getInput('role', { required: true })
            const tokenPath = core.getInput('kubernetesTokenPath', { required: false }) || defaultKubernetesTokenPath
            const data = fs.readFileSync(tokenPath, 'utf8')
            if (!(role && data) && data != "") {
                throw new Error("Role Name must be set and a kubernetes token must set")
            }
            return await getClientToken(client, method, path, { jwt: data, role: role })
        }
        case 'userpass': 
        case 'ldap': {
            const username = core.getInput('username', { required: true });
            const password = core.getInput('password', { required: true });
            path = path + `/${username}`
            return await getClientToken(client, method, path, { password: password })
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
                return await getClientToken(client, method, path, JSON.parse(payload.trim()));
            }
        }
    }
}

/***
 * Generates signed Json Web Token with specified private key and ttl
 * @param {string} privateKey
 * @param {string} keyPassword
 * @param {number} ttl
 */
function generateJwt(privateKey, keyPassword, ttl) {
    const alg = 'RS256';
    const header = { alg: alg, typ: 'JWT' };
    const now = rsasign.KJUR.jws.IntDate.getNow();
    const payload = {
        iss: 'vault-action',
        iat: now,
        nbf: now,
        exp: now + ttl,
        event: process.env.GITHUB_EVENT_NAME,
        workflow: process.env.GITHUB_WORKFLOW,
        sha: process.env.GITHUB_SHA,
        actor: process.env.GITHUB_ACTOR,
        repository: process.env.GITHUB_REPOSITORY,
        ref: process.env.GITHUB_REF
    };
    const decryptedKey = rsasign.KEYUTIL.getKey(privateKey, keyPassword);
    return rsasign.KJUR.jws.JWS.sign(alg, JSON.stringify(header), JSON.stringify(payload), decryptedKey);
}

/***
 * Call the appropriate login endpoint and parse out the token in the response.
 * @param {import('got').Got} client
 * @param {string} method
 * @param {string} path
 * @param {any} payload
 */
async function getClientToken(client, method, path, payload) {
    /** @type {'json'} */
    const responseType = 'json';
    var options = {
        json: payload,
        responseType,
    };

    core.debug(`Retrieving Vault Token from ${path} endpoint`);

    /** @type {import('got').Response<VaultLoginResponse>} */
    let response;
    try {
        response = await client.post(`${path}`, options);
    } catch (err) {
        if (err instanceof got.HTTPError) {
            throw Error(`failed to retrieve vault token. code: ${err.code}, message: ${err.message}, vaultResponse: ${JSON.stringify(err.response.body)}`)
        } else {
            throw err
        }
    }
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
 * Generic function for retrying an async function
 * @param {number} retries
 * @param {number} delay
 * @param {Function} func
 * @param {any[]} args
 */
async function retryAsyncFunction(retries, delay, func, ...args) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const result = await func(...args);
      return result;
    } catch (error) {
      attempt++;
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
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
