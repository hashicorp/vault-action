jest.mock('@actions/core');
jest.mock('@actions/core/lib/command');
const core = require('@actions/core');

const got = require('got');
const { when } = require('jest-when');

const { exportSecrets } = require('../../src/action');

const vaultUrl = `http://${process.env.VAULT_HOST || 'localhost'}:${process.env.VAULT_PORT || '8201'}`;

describe('integration', () => {
    beforeAll(async () => {
        try {
            // Verify Connection
            await got(`${vaultUrl}/v1/secret/config`, {
                headers: {
                    'X-Vault-Token': 'testtoken',
                },
            });

            // Create namespace
            await enableNamespace('ns1');

            // Enable K/V v2 secret engine at 'secret/'
            await enableEngine('secret', 'ns1', 2);

            await writeSecret('secret', 'test', 'ns1', 2, {secret: 'SUPERSECRET_IN_NAMESPACE'})
            await writeSecret('secret', 'nested/test', 'ns1', 2, {otherSecret: 'OTHERSUPERSECRET_IN_NAMESPACE'})

            // Enable K/V v1 secret engine at 'my-secret/'
            await enableEngine('my-secret', 'ns1', 1);

            await writeSecret('my-secret', 'test', 'ns1', 1, {secret: 'CUSTOMSECRET_IN_NAMESPACE'})
            await writeSecret('my-secret', 'nested/test', 'ns1', 1, {otherSecret: 'OTHERCUSTOMSECRET_IN_NAMESPACE'})
        } catch (e) {
            console.error('Failed to setup test', e);
            throw e;
        }
    });

    beforeEach(() => {
        jest.resetAllMocks();

        when(core.getInput)
            .calledWith('url', expect.anything())
            .mockReturnValueOnce(`${vaultUrl}`);

        when(core.getInput)
            .calledWith('token', expect.anything())
            .mockReturnValueOnce('testtoken');

        when(core.getInput)
            .calledWith('namespace', expect.anything())
            .mockReturnValueOnce('ns1');
    });

    it('get simple secret', async () => {
        mockInput('secret/data/test secret');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('SECRET', 'SUPERSECRET_IN_NAMESPACE');
    });

    it('re-map secret', async () => {
        mockInput('secret/data/test secret | TEST_KEY');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('TEST_KEY', 'SUPERSECRET_IN_NAMESPACE');
    });

    it('get nested secret', async () => {
        mockInput('secret/data/nested/test otherSecret');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('OTHERSECRET', 'OTHERSUPERSECRET_IN_NAMESPACE');
    });

    it('get multiple secrets', async () => {
        mockInput(`
        secret/data/test secret ;
        secret/data/test secret | NAMED_SECRET ;
        secret/data/nested/test otherSecret ;`);

        await exportSecrets();

        expect(core.exportVariable).toBeCalledTimes(3);

        expect(core.exportVariable).toBeCalledWith('SECRET', 'SUPERSECRET_IN_NAMESPACE');
        expect(core.exportVariable).toBeCalledWith('NAMED_SECRET', 'SUPERSECRET_IN_NAMESPACE');
        expect(core.exportVariable).toBeCalledWith('OTHERSECRET', 'OTHERSUPERSECRET_IN_NAMESPACE');
    });

    it('get secret from K/V v1', async () => {
        mockInput('my-secret/test secret');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('SECRET', 'CUSTOMSECRET_IN_NAMESPACE');
    });

    it('get nested secret from K/V v1', async () => {
        mockInput('my-secret/nested/test otherSecret');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('OTHERSECRET', 'OTHERCUSTOMSECRET_IN_NAMESPACE');
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
            await enableNamespace("ns2");

            // Enable K/V v2 secret engine at 'secret/'
            await enableEngine("secret", "ns2", 2);

            // Add secret
            await writeSecret('secret', 'test', 'ns2', 2, {secret: 'SUPERSECRET_WITH_APPROLE'})

            // Enable approle
            try {
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
                responseType: 'json',
            });
            roleId = roldIdResponse.body.data.role_id;

            // Get secret-id
            const secretIdResponse = await got(`${vaultUrl}/v1/auth/approle/role/my-role/secret-id`, {
                method: 'POST',
                headers: {
                    'X-Vault-Token': 'testtoken',
                    'X-Vault-Namespace': 'ns2',
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
        when(core.getInput)
            .calledWith('namespace', expect.anything())
            .mockReturnValueOnce('ns2');
    });

    it('authenticate with approle', async() => {
        mockInput('secret/data/test secret');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('SECRET', 'SUPERSECRET_WITH_APPROLE');
    })
});

async function enableNamespace(name) {
    try {
        await got(`${vaultUrl}/v1/sys/namespaces/${name}`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': 'testtoken',
            }
        });
    } catch (error) {
        const {response} = error;
        if (response.statusCode === 400 && response.body.includes("already exists")) {
            // Namespace might already be enabled from previous test runs
        } else {
            throw error;
        }
    }
}

async function enableEngine(path, namespace, version) {
    try {
        await got(`${vaultUrl}/v1/sys/mounts/${path}`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': 'testtoken',
                'X-Vault-Namespace': namespace,
            },
            json: { type: 'kv', config: {}, options: { version }, generate_signing_key: true },
        });
    } catch (error) {
        const {response} = error;
        if (response.statusCode === 400 && response.body.includes("path is already in use")) {
            // Engine might already be enabled from previous test runs
        } else {
            throw error;
        }
    }
}

async function writeSecret(engine, path, namespace, version, data) {
    const secretPath = (version == 1) ? (`${engine}/${path}`) : (`${engine}/data/${path}`);
    const secretPayload = (version == 1) ? (data) : ({data});
    await got(`${vaultUrl}/v1/${secretPath}`, {
        method: 'POST',
        headers: {
            'X-Vault-Token': 'testtoken',
            'X-Vault-Namespace': namespace,
        },
        json: secretPayload
    });
}

function mockInput(secrets) {
    when(core.getInput)
        .calledWith('secrets', expect.anything())
        .mockReturnValueOnce(secrets);
}
