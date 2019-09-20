jest.mock('got');
jest.mock('@actions/core');

const core = require('@actions/core');
const got = require('got');
const {
    exportSecrets,
    parseKeysInput,
} = require('./action');

const { when } = require('jest-when');

describe('parseKeysInput', () => {
    it('parses simple key', () => {
        const output = parseKeysInput('test');
        expect(output.has('test')).toBeTruthy();
        expect(output.get('test')).toMatchObject({
            name: 'TEST',
            query: null
        });
    });

    it('parses mapped key', () => {
        const output = parseKeysInput('test|testName');
        expect(output.get('test')).toMatchObject({
            name: 'testName',
            query: null
        });
    });

    it('fails on invalid mapped name', () => {
        expect(() => parseKeysInput('test|'))
            .toThrowError(`You must provide a value when mapping a secret to a name. Input: "test|"`)
    });

    it('fails on invalid path for mapped', () => {
        expect(() => parseKeysInput('|testName'))
            .toThrowError(`You must provide a valid path. Input: "|testName"`)
    });

    it('parses queried key', () => {
        const output = parseKeysInput('test>$.test');
        expect(output.get('test')).toMatchObject({
            name: 'TEST',
            query: '$.test'
        });
    });

    it('fails on invalid query', () => {
        expect(() => parseKeysInput('test>#'))
            .toThrowError(`Invalid query expression provided "#" from "test>#".`)
    });

    it('parses queried and mapped key', () => {
        const output = parseKeysInput('test>$.test|testName');
        expect(output.get('test')).toMatchObject({
            name: 'testName',
            query: '$.test'
        });
    });

    it('parses multiple keys', () => {
        const output = parseKeysInput('first;second;');

        expect(output.size).toBe(2);
        expect(output.has('first')).toBeTruthy();
        expect(output.has('second')).toBeTruthy();
    });

    it('parses multiple complex keys', () => {
        const output = parseKeysInput('first;second|secondName;third>$.third');

        expect(output.size).toBe(3);
        expect(output.has('first')).toBeTruthy();
        expect(output.get('second')).toMatchObject({
            name: 'secondName'
        });
        expect(output.get('third')).toMatchObject({
            query: '$.third'
        });
    });

    it('parses multiline input', () => {
        const output = parseKeysInput('\nfirst;\nsecond;\n');

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
            .mockReturnValue('https://vault');

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
                data,
                meta: {}
            })
        });
    }

    it('simple key retrieval', async () => {
        mockInput('test');
        mockVaultData('1');

        await exportSecrets();

        expect(core.exportSecret).toBeCalledWith('TEST', '1');
    });

    it('mapped key retrieval', async () => {
        mockInput('test|TEST_NAME');
        mockVaultData('1');

        await exportSecrets();

        expect(core.exportSecret).toBeCalledWith('TEST_NAME', '1');
    });

    it('queried data retrieval', async () => {
        mockInput('test > $.key');
        mockVaultData({
            key: 'SECURE'
        });

        await exportSecrets();

        expect(core.exportSecret).toBeCalledWith('TEST', 'SECURE');
    });
});