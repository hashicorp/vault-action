jest.mock('got');
jest.mock('@actions/core');
jest.mock('@actions/core/lib/command');

const core = require('@actions/core');
const got = require('got');
const {
    exportSecrets,
    parseKeysInput,
} = require('./action');

const { when } = require('jest-when');

describe('parseKeysInput', () => {
    it('parses simple key', () => {
        const output = parseKeysInput('test key');
        expect(output.has('test')).toBeTruthy();
        expect(output.get('test')).toMatchObject({
            outputName: 'KEY',
            dataKey: 'key'
        });
    });

    it('parses mapped key', () => {
        const output = parseKeysInput('test key|testName');
        expect(output.get('test')).toMatchObject({
            outputName: 'testName'
        });
    });

    it('fails on invalid mapped name', () => {
        expect(() => parseKeysInput('test key|'))
            .toThrowError(`You must provide a value when mapping a secret to a name. Input: "test key|"`)
    });

    it('fails on invalid path for mapped', () => {
        expect(() => parseKeysInput('|testName'))
            .toThrowError(`You must provide a valid path and key. Input: "|testName"`)
    });

    it('parses multiple keys', () => {
        const output = parseKeysInput('first a;second b;');

        expect(output.size).toBe(2);
        expect(output.has('first')).toBeTruthy();
        expect(output.has('second')).toBeTruthy();
    });

    it('parses multiple complex keys', () => {
        const output = parseKeysInput('first a;second b|secondName');

        expect(output.size).toBe(2);
        expect(output.get('first')).toMatchObject({
            dataKey: 'a'
        });
        expect(output.get('second')).toMatchObject({
            outputName: 'secondName'
        });
    });

    it('parses multiline input', () => {
        const output = parseKeysInput('\nfirst a;\nsecond b;\n');

        expect(output.size).toBe(2);
        expect(output.has('first')).toBeTruthy();
        expect(output.has('second')).toBeTruthy();
    })
});


describe('exportSecrets', () => {
    beforeEach(() => {
        jest.resetAllMocks();

        when(core.getInput)
            .calledWith('vaultUrl')
            .mockReturnValue('http://vault:8200');

        when(core.getInput)
            .calledWith('vaultToken')
            .mockReturnValue('EXAMPLE');
    });

    function mockInput(key) {
        when(core.getInput)
            .calledWith('keys')
            .mockReturnValue(key);
    }

    function mockVaultData(data) {
        got.mockResolvedValue({
            body: JSON.stringify({
                data: {
                    data
                }
            })
        });
    }

    it('simple key retrieval', async () => {
        mockInput('test key');
        mockVaultData({
            key: 1
        });

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('KEY', '1');
    });

    it('mapped key retrieval', async () => {
        mockInput('test key|TEST_NAME');
        mockVaultData({
            key: 1
        });

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('TEST_NAME', '1');
    });
});