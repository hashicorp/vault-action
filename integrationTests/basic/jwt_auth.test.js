jest.mock('@actions/core');
jest.mock('@actions/core/lib/command');
const core = require('@actions/core');
const {
    privateRsaKeyBase64,
    publicRsaKey
} = require('./rsa_keys');

const got = require('got');
const { when } = require('jest-when');

const { exportSecrets } = require('../../src/action');

const vaultUrl = `http://${process.env.VAULT_HOST || 'localhost'}:${process.env.VAULT_PORT || '8200'}`;

describe('jwt auth', () => {
    beforeAll(async () => {
        // Verify Connection
        await got(`${vaultUrl}/v1/secret/config`, {
            headers: {
                'X-Vault-Token': 'testtoken',
            },
        });

        try {
            await got(`${vaultUrl}/v1/sys/auth/jwt`, {
                method: 'POST',
                headers: {
                    'X-Vault-Token': 'testtoken',
                },
                json: {
                    type: 'jwt'
                }
            });
        } catch (error) {
            const {response} = error;
            if (response.statusCode === 400 && response.body.includes("path is already in use")) {
                // Auth method might already be enabled from previous test runs
            } else {
                throw error;
            }
        }

        await got(`${vaultUrl}/v1/sys/policy/reader`, {
            method: 'PUT',
            headers: {
                'X-Vault-Token': 'testtoken',
            },
            json: {
                policy: `
                path "*" {
                    capabilities = ["read"]
                }
                `
            }
        });

        await got(`${vaultUrl}/v1/auth/jwt/config`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': 'testtoken',
            },
            json: {
                jwt_validation_pubkeys: publicRsaKey
            }
        });

        await got(`${vaultUrl}/v1/auth/jwt/role/default`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': 'testtoken',
            },
            json: {
                role_type: 'jwt',
                bound_audiences: null,
                bound_claims: {
                    iss: 'vault-action'
                },
                user_claim: 'iss',
                policies: ['reader']
            }
        });

        await got(`${vaultUrl}/v1/secret/data/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': 'testtoken',
            },
            json: {
                data: {
                    secret: 'SUPERSECRET',
                },
            },
        });
    });

    beforeEach(() => {
        jest.resetAllMocks();

        when(core.getInput)
            .calledWith('url')
            .mockReturnValueOnce(`${vaultUrl}`);

        when(core.getInput)
            .calledWith('method')
            .mockReturnValueOnce('jwt');

        when(core.getInput)
            .calledWith('jwtPrivateKey')
            .mockReturnValueOnce(privateRsaKeyBase64);

        when(core.getInput)
            .calledWith('role')
            .mockReturnValueOnce('default');

        when(core.getInput)
            .calledWith('secrets')
            .mockReturnValueOnce('secret/data/test secret');
    });

    it('successfully authenticates', async () => {
        await exportSecrets();
        expect(core.exportVariable).toBeCalledWith('SECRET', 'SUPERSECRET');
    });

});
