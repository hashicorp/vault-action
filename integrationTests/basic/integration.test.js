jest.mock('@actions/core');
jest.mock('@actions/core/lib/command');
const core = require('@actions/core');

const got = require('got');
const { when } = require('jest-when');

const { exportSecrets } = require('../../action');

const vaultUrl = `http://${process.env.VAULT_HOST || 'localhost'}:${process.env.VAULT_PORT || '8200'}`;

describe('integration', () => {
    beforeAll(async () => {
        // Verify Connection
        await got(`${vaultUrl}/v1/secret/config`, {
            headers: {
                'X-Vault-Token': 'testtoken',
            },
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

        await got(`${vaultUrl}/v1/secret/data/nested/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': 'testtoken',
            },
            json: {
                data: {
                    otherSecret: 'OTHERSUPERSECRET',
                },
            }
        });

        // Enable custom secret engine
        try {
            await got(`${vaultUrl}/v1/sys/mounts/my-secret`, {
                method: 'POST',
                headers: {
                    'X-Vault-Token': 'testtoken',
                },
                json: {
                    type: 'kv'
                }
            });
        } catch (error) {
            const {response} = error;
            if (response.statusCode === 400 && response.body.includes("path is already in use")) {
                // Engine might already be enabled from previous test runs
            } else {
                throw error;
            }
        }

        await got(`${vaultUrl}/v1/my-secret/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': 'testtoken',
            },
            json: {
                secret: 'CUSTOMSECRET',
            }
        });

        await got(`${vaultUrl}/v1/my-secret/nested/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': 'testtoken',
            },
            json: {
                otherSecret: 'OTHERCUSTOMSECRET',
            },
        });
    });

    beforeEach(() => {
        jest.resetAllMocks();

        when(core.getInput)
            .calledWith('url')
            .mockReturnValueOnce(`${vaultUrl}`);

        when(core.getInput)
            .calledWith('token')
            .mockReturnValueOnce('testtoken');
    });

    function mockInput(secrets) {
        when(core.getInput)
            .calledWith('secrets')
            .mockReturnValueOnce(secrets);
    }

    function mockEngineName(name) {
        when(core.getInput)
            .calledWith('engine-name')
            .mockReturnValueOnce(name);
    }

    function mockVersion(version) {
        when(core.getInput)
            .calledWith('kv-version')
            .mockReturnValueOnce(version);
    }

    it('get simple secret', async () => {
        mockInput('test secret');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('SECRET', 'SUPERSECRET');
    });

    it('re-map secret', async () => {
        mockInput('test secret | TEST_KEY');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('TEST_KEY', 'SUPERSECRET');
    });

    it('get nested secret', async () => {
        mockInput('nested/test otherSecret');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('OTHERSECRET', 'OTHERSUPERSECRET');
    });

    it('get multiple secrets', async () => {
        mockInput(`
        test secret ;
        test secret | NAMED_SECRET ;
        nested/test otherSecret ;`);

        await exportSecrets();

        expect(core.exportVariable).toBeCalledTimes(3);

        expect(core.exportVariable).toBeCalledWith('SECRET', 'SUPERSECRET');
        expect(core.exportVariable).toBeCalledWith('NAMED_SECRET', 'SUPERSECRET');
        expect(core.exportVariable).toBeCalledWith('OTHERSECRET', 'OTHERSUPERSECRET');
    });

    it('get secret from K/V v1', async () => {
        mockInput('test secret');
        mockEngineName('my-secret');
        mockVersion('1');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('SECRET', 'CUSTOMSECRET');
    });

    it('get nested secret from K/V v1', async () => {
        mockInput('nested/test otherSecret');
        mockEngineName('my-secret');
        mockVersion('1');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('OTHERSECRET', 'OTHERCUSTOMSECRET');
    });
});
