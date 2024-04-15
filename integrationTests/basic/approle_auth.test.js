jest.mock('@actions/core');
jest.mock('@actions/core/lib/command');
const core = require('@actions/core');

const got = require('got');
const { when } = require('jest-when');

const { exportSecrets } = require('../../src/action');

const vaultUrl = `http://${process.env.VAULT_HOST || 'localhost'}:${process.env.VAULT_PORT || '8200'}`;
const vaultToken = `${process.env.VAULT_TOKEN || 'testtoken'}`

describe('authenticate with approle', () => {
    let roleId;
    let secretId;
    beforeAll(async () => {
        try {
            // Verify Connection
            await got(`${vaultUrl}/v1/secret/config`, {
                headers: {
                    'X-Vault-Token': vaultToken,
                },
            });

            await got(`${vaultUrl}/v1/secret/data/approle-test`, {
                method: 'POST',
                headers: {
                    'X-Vault-Token': vaultToken,
                },
                json: {
                    data: {
                        secret: 'SUPERSECRET_WITH_APPROLE',
                    },
                },
            });

            // Enable approle
            try {
                await got(`${vaultUrl}/v1/sys/auth/approle`, {
                    method: 'POST',
                    headers: {
                        'X-Vault-Token': vaultToken
                    },
                    json: {
                        type: 'approle'
                    },
                });
            } catch (error) {
                const {response} = error;
                if (response.statusCode === 400 && response.body.includes("path is already in use")) {
                    // Approle might already be enabled from previous test runs
                } else {
                    throw error;
                }
            }

            // Create policies
            await got(`${vaultUrl}/v1/sys/policies/acl/test`, {
                method: 'POST',
                headers: {
                    'X-Vault-Token': vaultToken
                },
                json: {
                    "name":"test",
                    "policy":"path \"auth/approle/*\" {\n    capabilities = [\"read\", \"list\"]\n}\npath \"auth/approle/role/my-role/role-id\"\n{\n    capabilities = [\"create\", \"read\", \"update\", \"delete\", \"list\"]\n}\npath \"auth/approle/role/my-role/secret-id\"\n{\n    capabilities = [\"create\", \"read\", \"update\", \"delete\", \"list\"]\n}\n\npath \"secret/data/*\" {\n    capabilities = [\"list\"]\n}\npath \"secret/metadata/*\" {\n    capabilities = [\"list\"]\n}\n\npath \"secret/data/approle-test\" {\n    capabilities = [\"read\", \"list\"]\n}\npath \"secret/metadata/approle-test\" {\n    capabilities = [\"read\", \"list\"]\n}\n"
                },
            });

            // Create approle
            await got(`${vaultUrl}/v1/auth/approle/role/my-role`, {
                method: 'POST',
                headers: {
                    'X-Vault-Token': vaultToken
                },
                json: {
                    policies: 'test'
                },
            });

            // Get role-id
            const roldIdResponse = await got(`${vaultUrl}/v1/auth/approle/role/my-role/role-id`, {
                headers: {
                    'X-Vault-Token': vaultToken
                },
                responseType: 'json',
            });
            roleId = roldIdResponse.body.data.role_id;

            // Get secret-id
            const secretIdResponse = await got(`${vaultUrl}/v1/auth/approle/role/my-role/secret-id`, {
                method: 'POST',
                headers: {
                    'X-Vault-Token': vaultToken
                },
                responseType: 'json',
            });
            secretId = secretIdResponse.body.data.secret_id;
        } catch(err) {
            console.warn('Create approle', err.response.body);
            throw err;
        }
    });

    beforeEach(() => {
        jest.resetAllMocks();

        when(core.getInput)
            .calledWith('method', expect.anything())
            .mockReturnValueOnce('approle');
        when(core.getInput)
            .calledWith('roleId', expect.anything())
            .mockReturnValueOnce(roleId);
        when(core.getInput)
            .calledWith('secretId', expect.anything())
            .mockReturnValueOnce(secretId);
        when(core.getInput)
            .calledWith('url', expect.anything())
            .mockReturnValueOnce(`${vaultUrl}`);
    });

    function mockInput(secrets) {
        when(core.getInput)
            .calledWith('secrets', expect.anything())
            .mockReturnValueOnce(secrets);
    }

    it('authenticate with approle', async() => {
        mockInput('secret/data/approle-test secret');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('SECRET', 'SUPERSECRET_WITH_APPROLE');
    })
});
