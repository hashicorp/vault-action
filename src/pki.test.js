/**
 * Copyright IBM Corp. 2019, 2026
 * SPDX-License-Identifier: MIT
 */

jest.mock('@actions/core');

const { getCertificates } = require('./pki');

describe('getCertificates', () => {
    const pkiRequest = {
        path: 'pki/issue/Test',
        parameters: { common_name: 'test', ttl: '1h' },
        envVarName: 'TEST',
        outputVarName: 'test',
    };

    it('omits ca_chain output when Vault does not return one', async () => {
        const client = {
            post: jest.fn().mockResolvedValue({
                body: JSON.stringify({
                    data: {
                        certificate: 'cert',
                        private_key: 'key',
                        issuing_ca: 'ca',
                        serial_number: '01:02',
                    },
                }),
            }),
        };

        const results = await getCertificates([pkiRequest], client);

        expect(results).toEqual([
            expect.objectContaining({
                request: expect.objectContaining({
                    envVarName: 'TEST_CERT',
                    outputVarName: 'test_cert',
                }),
                value: 'cert',
            }),
            expect.objectContaining({
                request: expect.objectContaining({
                    envVarName: 'TEST_KEY',
                    outputVarName: 'test_key',
                }),
                value: 'key',
            }),
            expect.objectContaining({
                request: expect.objectContaining({
                    envVarName: 'TEST_CA',
                    outputVarName: 'test_ca',
                }),
                value: 'ca',
            }),
        ]);
    });

    it('joins ca_chain output when Vault returns one', async () => {
        const client = {
            post: jest.fn().mockResolvedValue({
                body: JSON.stringify({
                    data: {
                        certificate: 'cert',
                        private_key: 'key',
                        issuing_ca: 'ca',
                        ca_chain: ['root', 'intermediate'],
                        serial_number: '01:02',
                    },
                }),
            }),
        };

        const results = await getCertificates([pkiRequest], client);

        expect(results).toHaveLength(4);
        expect(results[3]).toEqual(expect.objectContaining({
            request: expect.objectContaining({
                envVarName: 'TEST_CA_CHAIN',
                outputVarName: 'test_ca_chain',
            }),
            value: 'root\nintermediate',
        }));
    });
});
