// @ts-check
const core = require('@actions/core');
const rsasign = require('jsrsasign');
const fs = require('fs');
const got = require('got').default;

const defaultKubernetesTokenPath = '/var/run/secrets/kubernetes.io/serviceaccount/token'
/***
 * Authenticate with Vault and retrieve a Vault token that can be used for requests.
 * @param {string} method
 * @param {import('got').Got} client
 */
async function retrieveToken(method, client) {
    const path = core.getInput('path', { required: false }) || method;

    switch (method) {
        case 'approle': {
            const vaultRoleId = core.getInput('roleId', { required: true });
            const vaultSecretId = core.getInput('secretId', { required: true });
            return await getClientToken(client, method, path, { role_id: vaultRoleId, secret_id: vaultSecretId });
        }
        case 'github': {
            const githubToken = core.getInput('githubToken', { required: true });
            return await getClientToken(client, method, path, { token: githubToken });
        }
        case 'jwt': {
            /** @type {string} */
            let jwt;
            const actionsIDTokenRequestToken = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
            const actionsIDTokenRequestURL = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];

            const role = core.getInput('role', { required: true });
            const privateKeyRaw = core.getInput('jwtPrivateKey', { required: (!(actionsIDTokenRequestToken && actionsIDTokenRequestURL)) });
            const privateKey = Buffer.from(privateKeyRaw, 'base64').toString();
            const keyPassword = core.getInput('jwtKeyPassword', { required: false });
            const tokenTtl = core.getInput('jwtTtl', { required: false }) || '3600'; // 1 hour

            if (!privateKeyRaw && actionsIDTokenRequestToken && actionsIDTokenRequestURL) {
                jwt = await getJwt(actionsIDTokenRequestToken, `${actionsIDTokenRequestURL}&audience=sigstore`);
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
 * Call the appropriate endpoint and retrieves job's JWT
 * @param {string} actionsIDTokenRequestToken
 * @param {string} actionsIDTokenRequestURL
 */
async function getJwt(actionsIDTokenRequestToken, actionsIDTokenRequestURL) {
    /** @type {'json'} */
    const responseType = 'json';
    const options = {
        headers: {
            Authorization: `Bearer ${actionsIDTokenRequestToken}`,
        },
        responseType,
    };
    const client = got.extend(options)

    core.debug(`Retrieving Vault JWT from ${actionsIDTokenRequestURL} endpoint`);
    /** @type {import('got').Response<GithubActionsIdTokenResponse>} */
    const response = await client.get(actionsIDTokenRequestURL, options);

    if (response && response.body && response.body.value) {
        core.debug('✔ Github Actions ID Token successfully retrieved');
        return response.body.value;
    } else {
        throw Error(`Unable to retrieve token from ${actionsIDTokenRequestURL}'s endpoint.`);
    }
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

    core.debug(`Retrieving Vault Token from v1/auth/${path}/login endpoint`);

    /** @type {import('got').Response<VaultLoginResponse>} */
    const response = await client.post(`v1/auth/${path}/login`, options);
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

/***
 * @typedef {Object} GithubActionsIdTokenResponse
 * @property {string} value
 * @property {string} count
 */

module.exports = {
    retrieveToken,
};
