jest.mock('@actions/core');
const core = require('@actions/core');

const got = require('got');
const { when } = require('jest-when');

const { exportSecrets } = require('../action');

describe('e2e', () => {

    beforeAll(async () => {
        console.debug(`Testing against: http://${process.env.VAULT_HOST}:${process.env.VAULT_PORT}/v1/secret`)

        // Verify Connection
        await got(`http://${process.env.VAULT_HOST}:${process.env.VAULT_PORT}/v1/secret/config`, {
            headers: {
                'X-Vault-Token': 'testtoken',
            },
        });

        await got(`http://${process.env.VAULT_HOST}:${process.env.VAULT_PORT}/v1/secret/data/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': 'testtoken',
            },
            body: {
                data: {
                    a: 1,
                    b: 2,
                    c: 3,
                },
            },
            json: true,
        });

        await got(`http://${process.env.VAULT_HOST}:${process.env.VAULT_PORT}/v1/secret/data/nested/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': 'testtoken',
            },
            body: {
                data: {
                    e: 4,
                    f: 5,
                    g: 6,
                },
            },
            json: true,
        });
    })

    beforeEach(() => {
        jest.resetAllMocks();

        when(core.getInput)
            .calledWith('vaultUrl')
            .mockReturnValue(`http://${process.env.VAULT_HOST}:${process.env.VAULT_PORT}`);

        when(core.getInput)
            .calledWith('vaultToken')
            .mockReturnValue('testtoken');
    });

    function mockInput(key) {
        when(core.getInput)
            .calledWith('keys')
            .mockReturnValue(key);
    }

    it('get simple secret', async () => {
        mockInput('test a')

        await exportSecrets();

        expect(core.exportSecret).toBeCalledWith('A', 1);
    });

    it('re-map secret', async () => {
        mockInput('test a | TEST_KEY')

        await exportSecrets();

        expect(core.exportSecret).toBeCalledWith('TEST_KEY', 1);
    });

    it('get nested secret', async () => {
        mockInput('nested/test e')

        await exportSecrets();

        expect(core.exportSecret).toBeCalledWith('E', 4);
    });
});