jest.mock('@actions/core');
jest.mock('@actions/core/lib/command');
const core = require('@actions/core');

const got = require('got');
const { when } = require('jest-when');

const { exportSecrets } = require('../../action');

const vaultUrl = `http://${process.env.VAULT_HOST || 'localhost'}:${process.env.VAULT_PORT || '8201'}`;

describe('integration', () => {
    beforeAll(async () => {
        // Verify Connection
        await got(`${vaultUrl}/v1/secret/config`, {
            headers: {
                'X-Vault-Token': 'testtoken',
            },
        });

        // Create namespace
        await got(`${vaultUrl}/v1/sys/namespaces/ns1`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': 'testtoken',
            },
            json: true,
        });

        // Enable secret engine
        await got(`${vaultUrl}/v1/sys/mounts/secret`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': 'testtoken',
                'X-Vault-Namespace': 'ns1',
            },
            json: { path: 'secret', type: 'kv', config: {}, options: { version: 2 }, generate_signing_key: true },
        });

        await got(`${vaultUrl}/v1/secret/data/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': 'testtoken',
                'X-Vault-Namespace': 'ns1',
            },
            json: {
                data: {
                    secret: 'SUPERSECRET_IN_NAMESPACE',
                },
            },
        });

        await got(`${vaultUrl}/v1/secret/data/nested/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': 'testtoken',
                'X-Vault-Namespace': 'ns1',
            },
            json: {
                data: {
                    otherSecret: 'OTHERSUPERSECRET_IN_NAMESPACE',
                },
            },
        });
    });

    beforeEach(() => {
        jest.resetAllMocks();

        when(core.getInput)
            .calledWith('url')
            .mockReturnValue(`${vaultUrl}`);

        when(core.getInput)
            .calledWith('token')
            .mockReturnValue('testtoken');

        when(core.getInput)
            .calledWith('namespace')
            .mockReturnValue('ns1');
    });

    function mockInput(secrets) {
        when(core.getInput)
            .calledWith('secrets')
            .mockReturnValue(secrets);
    }

    it('get simple secret', async () => {
        mockInput('test secret');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('SECRET', 'SUPERSECRET_IN_NAMESPACE');
    });

    it('re-map secret', async () => {
        mockInput('test secret | TEST_KEY');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('TEST_KEY', 'SUPERSECRET_IN_NAMESPACE');
    });

    it('get nested secret', async () => {
        mockInput('nested/test otherSecret');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('OTHERSECRET', 'OTHERSUPERSECRET_IN_NAMESPACE');
    });

    it('get multiple secrets', async () => {
        mockInput(`
        test secret ;
        test secret | NAMED_SECRET ;
        nested/test otherSecret ;`);

        await exportSecrets();

        expect(core.exportVariable).toBeCalledTimes(3);

        expect(core.exportVariable).toBeCalledWith('SECRET', 'SUPERSECRET_IN_NAMESPACE');
        expect(core.exportVariable).toBeCalledWith('NAMED_SECRET', 'SUPERSECRET_IN_NAMESPACE');
        expect(core.exportVariable).toBeCalledWith('OTHERSECRET', 'OTHERSUPERSECRET_IN_NAMESPACE');
    });
});

describe('authenticate with approle', () => {
    let roleId;
    let secretId;
    beforeAll(async () => {
        try {
            // Verify Connection
            await got(`${vaultUrl}/v1/secret/config`, {
                headers: {
                    'X-Vault-Token': 'testtoken',
                },
            });

            // Create namespace
            await got(`${vaultUrl}/v1/sys/namespaces/ns2`, {
                method: 'POST',
                headers: {
                    'X-Vault-Token': 'testtoken',
                },
                json: true,
            });

            // Enable secret engine
            await got(`${vaultUrl}/v1/sys/mounts/secret`, {
                method: 'POST',
                headers: {
                    'X-Vault-Token': 'testtoken',
                    'X-Vault-Namespace': 'ns2',
                },
                json: { path: 'secret', type: 'kv', config: {}, options: { version: 2 }, generate_signing_key: true },
            });

            // Add secret
            await got(`${vaultUrl}/v1/secret/data/test`, {
                method: 'POST',
                headers: {
                    'X-Vault-Token': 'testtoken',
                    'X-Vault-Namespace': 'ns2',
                },
                json: {
                    data: {
                        secret: 'SUPERSECRET_WITH_APPROLE',
                    },
                },
            });

            // Enable approle
            await got(`${vaultUrl}/v1/sys/auth/approle`, {
                method: 'POST',
                headers: {
                    'X-Vault-Token': 'testtoken',
                    'X-Vault-Namespace': 'ns2',
                },
                json: {
                    type: 'approle'
                },
            });

            // Create policies
            await got(`${vaultUrl}/v1/sys/policies/acl/test`, {
                method: 'POST',
                headers: {
                    'X-Vault-Token': 'testtoken',
                    'X-Vault-Namespace': 'ns2',
                },
                json: {
                    "name":"test",
                    "policy":"path \"auth/approle/*\" {\n    capabilities = [\"read\", \"list\"]\n}\npath \"auth/approle/role/my-role/role-id\"\n{\n    capabilities = [\"create\", \"read\", \"update\", \"delete\", \"list\"]\n}\npath \"auth/approle/role/my-role/secret-id\"\n{\n    capabilities = [\"create\", \"read\", \"update\", \"delete\", \"list\"]\n}\n\npath \"secret/data/*\" {\n    capabilities = [\"list\"]\n}\npath \"secret/metadata/*\" {\n    capabilities = [\"list\"]\n}\n\npath \"secret/data/test\" {\n    capabilities = [\"read\", \"list\"]\n}\npath \"secret/metadata/test\" {\n    capabilities = [\"read\", \"list\"]\n}\npath \"secret/data/test/*\" {\n    capabilities = [\"read\", \"list\"]\n}\npath \"secret/metadata/test/*\" {\n    capabilities = [\"read\", \"list\"]\n}\n"
                },
            });

            // Create approle
            await got(`${vaultUrl}/v1/auth/approle/role/my-role`, {
                method: 'POST',
                headers: {
                    'X-Vault-Token': 'testtoken',
                    'X-Vault-Namespace': 'ns2',
                },
                json: {
                    policies: 'test'
                },
            });

            // Get role-id
            const roldIdResponse = await got(`${vaultUrl}/v1/auth/approle/role/my-role/role-id`, {
                headers: {
                    'X-Vault-Token': 'testtoken',
                    'X-Vault-Namespace': 'ns2',
                },
                json: true,
            });
            roleId = roldIdResponse.body.data.role_id;

            // Get secret-id
            const secretIdResponse = await got(`${vaultUrl}/v1/auth/approle/role/my-role/secret-id`, {
                method: 'POST',
                headers: {
                    'X-Vault-Token': 'testtoken',
                    'X-Vault-Namespace': 'ns2',
                },
                json: true,
            });
            secretId = secretIdResponse.body.data.secret_id;
        } catch(err) {
            console.warn('Create approle',err);
            throw err
        }
    });

    beforeEach(() => {
        jest.resetAllMocks();

        when(core.getInput)
            .calledWith('method')
            .mockReturnValue('approle');
        when(core.getInput)
            .calledWith('roleId')
            .mockReturnValue(roleId);
        when(core.getInput)
            .calledWith('secretId')
            .mockReturnValue(secretId);
        when(core.getInput)
            .calledWith('url')
            .mockReturnValue(`${vaultUrl}`);
        when(core.getInput)
            .calledWith('namespace')
            .mockReturnValue('ns2');
    });

    function mockInput(secrets) {
        when(core.getInput)
            .calledWith('secrets')
            .mockReturnValue(secrets);
    }

    it('authenticate with approle', async()=> {
        mockInput('test secret');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('SECRET', 'SUPERSECRET_WITH_APPROLE');
    })
});