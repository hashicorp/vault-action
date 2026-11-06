/**
 * Copyright IBM Corp. 2019, 2026
 * SPDX-License-Identifier: MIT
 */

const { getSecrets } = require('./secrets');

describe('getSecrets', () => {
    it('passes a KV v2 version query through to the Vault API', async () => {
        const client = {
            get: jest.fn().mockResolvedValue({
                body: JSON.stringify({
                    data: {
                        data: {
                            api_key: 'secret-value',
                        },
                    },
                }),
            }),
        };

        const results = await getSecrets([
            {
                path: 'secret/data/ci/aws?version=2',
                selector: 'api_key',
                outputVarName: 'api_key',
                envVarName: 'API_KEY',
            },
        ], client, false);

        expect(client.get).toHaveBeenCalledWith('v1/secret/data/ci/aws?version=2');
        expect(results[0].value).toBe('secret-value');
    });
});
