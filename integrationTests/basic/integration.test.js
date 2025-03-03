jest.mock('@actions/core');
jest.mock('@actions/core/lib/command');
const core = require('@actions/core');

const got = require('got');
const { when } = require('jest-when');

const { exportSecrets } = require('../../src/action');

const vaultUrl = `http://${process.env.VAULT_HOST || 'localhost'}:${process.env.VAULT_PORT || '8200'}`;
const vaultToken = `${process.env.VAULT_TOKEN || 'testtoken'}`

describe('integration', () => {
    beforeAll(async () => {
        // Verify Connection
        await got(`${vaultUrl}/v1/secret/config`, {
            headers: {
                'X-Vault-Token': vaultToken,
            },
        });

        await got(`${vaultUrl}/v1/secret/data/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': vaultToken,
            },
            json: {
                data: {
                    secret: 'SUPERSECRET',
                },
            },
        });

        await got(`${vaultUrl}/v1/secret/data/test-with-dot-char`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': vaultToken,
            },
            body: `{"data":{"secret.foo":"SUPERSECRET"}}`
        });

        await got(`${vaultUrl}/v1/secret/data/nested/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': vaultToken,
            },
            json: {
                data: {
                    "other-Secret-dash": 'OTHERSUPERSECRET',
                },
            }
        });

        await got(`${vaultUrl}/v1/secret/data/foobar`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': vaultToken,
            },
            json: {
                data: {
                    fookv2: 'bar',
                },
            }
        });

        // Enable custom secret engine
        try {
            await got(`${vaultUrl}/v1/sys/mounts/secret-kv1`, {
                method: 'POST',
                headers: {
                    'X-Vault-Token': vaultToken,
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

        await got(`${vaultUrl}/v1/secret-kv1/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': vaultToken,
            },
            json: {
                secret: 'CUSTOMSECRET',
            }
        });

        await got(`${vaultUrl}/v1/secret-kv1/foobar`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': vaultToken,
            },
            json: {
                fookv1: 'bar',
            }
        });

        await got(`${vaultUrl}/v1/secret-kv1/nested/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': vaultToken,
            },
            json: {
                "other-Secret-dash": 'OTHERCUSTOMSECRET',
            },
        });

        // Enable pki engine
        try {
            await got(`${vaultUrl}/v1/sys/mounts/pki`, {
                method: 'POST',
                headers: {
                    'X-Vault-Token': vaultToken,
                },
                json: {
                    type: 'pki'
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

        // Configure Root CA
        try {
            await got(`${vaultUrl}/v1/pki/root/generate/internal`, {
                method: 'POST',
                headers: {
                    'X-Vault-Token': vaultToken,
                },
                json: {
                    common_name: 'test',
                    ttl: '24h',
                },
            });
        } catch (error) {
            const {response} = error;
            if (response.statusCode === 400 && response.body.includes("already exists")) {
                // Root CA might already be configured from previous test runs
            } else {
                throw error;
            }
        }

        // Configure PKI Role
        try {
            await got(`${vaultUrl}/v1/pki/roles/Test`, {
                method: 'POST',
                headers: {
                    'X-Vault-Token': vaultToken,
                },
                json: {
                    allowed_domains: ['test'],
                    allow_bare_domains: true,
                    max_ttl: '1h',
                },
            });
        } catch (error) {
            const {response} = error;
            if (response.statusCode === 400 && response.body.includes("already exists")) {
                // Role might already be configured from previous test runs
            } else {
                throw error;
            }
        }
    });

    beforeEach(() => {
        jest.resetAllMocks();

        when(core.getInput)
            .calledWith('url', expect.anything())
            .mockReturnValueOnce(`${vaultUrl}`);

        when(core.getInput)
            .calledWith('token', expect.anything())
            .mockReturnValueOnce(vaultToken);
    });

    function mockInput(secrets) {
        when(core.getInput)
            .calledWith('secrets', expect.anything())
            .mockReturnValueOnce(secrets);
    }

    function mockPkiInput(pki) {
        when(core.getInput)
            .calledWith('pki', expect.anything())
            .mockReturnValueOnce(pki);
    }

    function mockIgnoreNotFound(shouldIgnore) {
        when(core.getInput)
            .calledWith('ignoreNotFound', expect.anything())
            .mockReturnValueOnce(shouldIgnore);
    }


    it('prints a nice error message when secret not found', async () => {
        mockInput(`secret/data/test secret ;
        secret/data/test secret | NAMED_SECRET ;
        secret/data/notFound kehe | NO_SIR ;`);

        await expect(exportSecrets()).rejects.toEqual(Error(`Unable to retrieve result for "secret/data/notFound" because it was not found: {"errors":[]}`));
    })

    it('does not error when secret not found and ignoreNotFound is true', async () => {
        mockInput(`secret/data/test secret ;
        secret/data/test secret | NAMED_SECRET ;
        secret/data/notFound kehe | NO_SIR ;`);

        mockIgnoreNotFound("true");

        await exportSecrets();

        expect(core.exportVariable).toBeCalledTimes(2);

        expect(core.exportVariable).toBeCalledWith('SECRET', 'SUPERSECRET');
        expect(core.exportVariable).toBeCalledWith('NAMED_SECRET', 'SUPERSECRET');
    })

    it('gets a pki certificate', async () => {
        mockPkiInput('pki/issue/Test {"common_name":"test","ttl":"1h"}');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledTimes(4);

        expect(core.exportVariable).toBeCalledWith('TEST_KEY', expect.anything());
        expect(core.exportVariable).toBeCalledWith('TEST_CERT', expect.anything());
        expect(core.exportVariable).toBeCalledWith('TEST_CA', expect.anything());
        expect(core.exportVariable).toBeCalledWith('TEST_CA_CHAIN', expect.anything());
    });

    it('get simple secret', async () => {
        mockInput('secret/data/test secret');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('SECRET', 'SUPERSECRET');
    });

    it('re-map secret', async () => {
        mockInput('secret/data/test secret | TEST_KEY');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('TEST_KEY', 'SUPERSECRET');
    });

    it('get nested secret', async () => {
        mockInput(`secret/data/nested/test "other-Secret-dash"`);

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('OTHERSECRETDASH', 'OTHERSUPERSECRET');
    });

    it('get multiple secrets', async () => {
        mockInput(`
        secret/data/test secret ;
        secret/data/test secret | NAMED_SECRET ;
        secret/data/nested/test "other-Secret-dash" ;`);

        await exportSecrets();

        expect(core.exportVariable).toBeCalledTimes(3);

        expect(core.exportVariable).toBeCalledWith('SECRET', 'SUPERSECRET');
        expect(core.exportVariable).toBeCalledWith('NAMED_SECRET', 'SUPERSECRET');
        expect(core.exportVariable).toBeCalledWith('OTHERSECRETDASH', 'OTHERSUPERSECRET');
    });

    it('get wildcard secrets with dot char', async () => {
        mockInput(`secret/data/test-with-dot-char * ;`);

        await exportSecrets();

        expect(core.exportVariable).toBeCalledTimes(1);

        expect(core.exportVariable).toBeCalledWith('SECRET__FOO', 'SUPERSECRET');
    });

    it('get wildcard secrets', async () => {
        mockInput(`secret/data/test * ;`);

        await exportSecrets();

        expect(core.exportVariable).toBeCalledTimes(1);

        expect(core.exportVariable).toBeCalledWith('SECRET', 'SUPERSECRET');
    });

    it('get wildcard secrets with name prefix', async () => {
        mockInput(`secret/data/test * | GROUP_ ;`);

        await exportSecrets();

        expect(core.exportVariable).toBeCalledTimes(1);

        expect(core.exportVariable).toBeCalledWith('GROUP_SECRET', 'SUPERSECRET');
    });

    it('leading slash kvv2', async () => {
        mockInput('/secret/data/foobar fookv2');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('FOOKV2', 'bar');
    });

    it('get secret from K/V v1', async () => {
        mockInput('secret-kv1/test secret');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('SECRET', 'CUSTOMSECRET');
    });

    it('get nested secret from K/V v1', async () => {
        mockInput('secret-kv1/nested/test "other-Secret-dash"');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('OTHERSECRETDASH', 'OTHERCUSTOMSECRET');
    });

    it('get K/V v1 wildcard secrets', async () => {
        mockInput(`secret-kv1/test * ;`);

        await exportSecrets();

        expect(core.exportVariable).toBeCalledTimes(1);

        expect(core.exportVariable).toBeCalledWith('SECRET', 'CUSTOMSECRET');
    });

    it('get K/V v1 wildcard secrets with name prefix', async () => {
        mockInput(`secret-kv1/test * | GROUP_ ;`);

        await exportSecrets();

        expect(core.exportVariable).toBeCalledTimes(1);

        expect(core.exportVariable).toBeCalledWith('GROUP_SECRET', 'CUSTOMSECRET');
    });

    it('get wildcard nested secret from K/V v1', async () => {
        mockInput('secret-kv1/nested/test *');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('OTHERSECRETDASH', 'OTHERCUSTOMSECRET');
    });

    it('leading slash kvv1', async () => {
        mockInput('/secret-kv1/foobar fookv1');

        await exportSecrets();

        expect(core.exportVariable).toBeCalledWith('FOOKV1', 'bar');
    });

    describe('generic engines', () => {
        beforeAll(async () => {
            await got(`${vaultUrl}/v1/cubbyhole/test`, {
                method: 'POST',
                headers: {
                    'X-Vault-Token': vaultToken,
                },
                json: {
                    foo: "bar",
                    zip: "zap"
                },
            });
        });

        it('supports cubbyhole', async () => {            
            mockInput('/cubbyhole/test foo');

            await exportSecrets();

            expect(core.exportVariable).toBeCalledWith('FOO', 'bar');
        });

        it('wildcard supports cubbyhole with uppercase transform', async () => {
            mockInput('/cubbyhole/test *');

            await exportSecrets();
            
            expect(core.exportVariable).toBeCalledTimes(2);

            expect(core.exportVariable).toBeCalledWith('FOO', 'bar');
            expect(core.exportVariable).toBeCalledWith('ZIP', 'zap');
        });

        it('wildcard supports cubbyhole with no change in case', async () => {
            mockInput('/cubbyhole/test **');

            await exportSecrets();

            expect(core.exportVariable).toBeCalledTimes(2);

            expect(core.exportVariable).toBeCalledWith('foo', 'bar');
            expect(core.exportVariable).toBeCalledWith('zip', 'zap');
        });

        it('wildcard supports cubbyhole with mixed case change', async () => {
            mockInput(`
            /cubbyhole/test * ;
            /cubbyhole/test **`);

            await exportSecrets();

            expect(core.exportVariable).toBeCalledTimes(4);

            expect(core.exportVariable).toBeCalledWith('FOO', 'bar');
            expect(core.exportVariable).toBeCalledWith('ZIP', 'zap');
            expect(core.exportVariable).toBeCalledWith('foo', 'bar');
            expect(core.exportVariable).toBeCalledWith('zip', 'zap');
        });
        
        it('caches responses', async () => {            
            mockInput(`
            /cubbyhole/test foo ;
            /cubbyhole/test zip`);

            await exportSecrets();

            expect(core.debug).toBeCalledWith('ℹ using cached response');

            expect(core.exportVariable).toBeCalledWith('FOO', 'bar');
            expect(core.exportVariable).toBeCalledWith('ZIP', 'zap');
        });
    })
});
