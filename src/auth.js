// @ts-check
const core = require('@actions/core');

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
