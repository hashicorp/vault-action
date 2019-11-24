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
            body: {
                data: {
                    secret: 'SUPERSECRET',
                },
            },
            json: true,
        });

        await got(`${vaultUrl}/v1/secret/data/nested/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': 'testtoken',
            },
            body: {
                data: {
                    otherSecret: 'OTHERSUPERSECRET',
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
    });

    function mockInput(secrets) {
        when(core.getInput)
            .calledWith('secrets')
            .mockReturnValue(secrets);
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
});
