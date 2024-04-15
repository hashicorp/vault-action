jest.mock('@actions/core');
jest.mock('@actions/core/lib/command');
const core = require('@actions/core');

const got = require('got');
const { when } = require('jest-when');

const { exportSecrets } = require('../../src/action');

const vaultUrl = `http://${process.env.VAULT_HOST || 'localhost'}:${process.env.VAULT_PORT || '8200'}`;
const vaultToken = `${process.env.VAULT_TOKEN || 'testtoken'}`

describe('authenticate with userpass', () => {
    const username = `testUsername`;
    const password = `testPassword`;
    beforeAll(async () => {
        try {
            // Verify Connection
            await got(`${vaultUrl}/v1/secret/config`, {
                headers: {
                    'X-Vault-Token': vaultToken,
                },
            });

            await got(`${vaultUrl}/v1/secret/data/userpass-test`, {
                method: 'POST',
                headers: {
                    'X-Vault-Token': vaultToken,
                },
                json: {
                    data: {
                        secret: 'SUPERSECRET_WITH_USERPASS',
                    },
                },
            });

            // Enable userpass
            try {
                await got(`${vaultUrl}/v1/sys/auth/userpass`, {
                    method: 'POST',
                    headers: {
                        'X-Vault-Token': vaultToken
                    },
                    json: {
                        type: 'userpass'
                    },
                });
            } catch (error) {
                const {response} = error;
                if (response.statusCode === 400 && response.body.includes("path is already in use")) {
                    // Userpass might already be enabled from previous test runs
                } else {
                    throw error;
                }
            }

            // Create policies
            await got(`${vaultUrl}/v1/sys/policies/acl/userpass-test`, {
                method: 'POST',
                headers: {
                    'X-Vault-Token': vaultToken
                },
                json: {
                    "name":"userpass-test",
                    "policy":`path \"auth/userpass/*\" {\n    capabilities = [\"read\", \"list\"]\n}\npath \"auth/userpass/users/${username}\"\n{\n    capabilities = [\"create\", \"read\", \"update\", \"delete\", \"list\"]\n}\n\npath \"secret/data/*\" {\n    capabilities = [\"list\"]\n}\npath \"secret/metadata/*\" {\n    capabilities = [\"list\"]\n}\n\npath \"secret/data/userpass-test\" {\n    capabilities = [\"read\", \"list\"]\n}\npath \"secret/metadata/userpass-test\" {\n    capabilities = [\"read\", \"list\"]\n}\n`
                },
            });

            // Create user
            await got(`${vaultUrl}/v1/auth/userpass/users/${username}`, {
                method: 'POST',
                headers: {
                    'X-Vault-Token': vaultToken
                },
                json: {
                    password: `${password}`,
                    policies: 'userpass-test'
                },
            });
        } catch(err) {
            console.warn('Create user in userpass', err.response.body);
            throw err;
        }
    });

    beforeEach(() => {
        jest.resetAllMocks();

        when(core.getInput)
            .calledWith('method', expect.anything())
            .mockReturnValueOnce('userpass');
        when(core.getInput)
            .calledWith('username', expect.anything())
            .mockReturnValueOnce(username);
        when(core.getInput)
            .calledWith('password', expect.anything())
            .mockReturnValueOnce(password);
        when(core.getInput)
            .calledWith('url', expect.anything())
            .mockReturnValueOnce(`${vaultUrl}`);
    });

    function mockInput(secrets) {
        when(core.getInput)
            .calledWith('secrets', expect.anything())
            .mockReturnValueOnce(secrets);
    }

    it('authenticate with userpass', async() => {
        mockInput('secret/data/userpass-test secret');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('SECRET', 'SUPERSECRET_WITH_USERPASS');
    })
});
