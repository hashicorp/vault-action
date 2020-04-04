const core = require('@actions/core');

/***
 * Authentication with Vault and retrieve a vault token
 * @param {string} method
 * @param {import('got')} client
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
 * Authentication with Vault and retrieve a vault token
 * @param {import('got')} client
 * @param {string} method
 * @param {any} payload
 */
async function getClientToken(client, method, payload) {
    /** @type {any} */
    var options = {
        json: payload,
        responseType: 'json'
    };

    core.debug(`Retrieving Vault Token from v1/auth/${method}/login endpoint`);
    const response = await client.post(`v1/auth/${method}/login`, options);
    if (response && response.body && response.body.auth && response.body.auth.client_token) {
        core.debug('✔ Vault Token successfully retrieved');
        return response.body.auth.client_token;
    } else {
        throw Error(`Unable to retrieve token from ${method}'s login endpoint.`);
    }
}

module.exports = {
    retrieveToken
}
