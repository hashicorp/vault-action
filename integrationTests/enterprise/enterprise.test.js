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
            body: { path: 'secret', type: 'kv', config: {}, options: { version: 2 }, generate_signing_key: true },
            json: true,
        });

        await got(`${vaultUrl}/v1/secret/data/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': 'testtoken',
                'X-Vault-Namespace': 'ns1',
            },
            body: {
                data: {
                    secret: 'SUPERSECRET_IN_NAMESPACE',
                },
            },
            json: true,
        });

        await got(`${vaultUrl}/v1/secret/data/nested/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': 'testtoken',
                'X-Vault-Namespace': 'ns1',
            },
            body: {
                data: {
                    otherSecret: 'OTHERSUPERSECRET_IN_NAMESPACE',
                },
            },
            json: true,
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
