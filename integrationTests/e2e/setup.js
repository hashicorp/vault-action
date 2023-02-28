const got = require('got');

const vaultUrl = `${process.env.VAULT_HOST}:${process.env.VAULT_PORT}`;
const vaultToken = `${process.env.VAULT_TOKEN || 'testtoken'}`

(async () => {
    try {
        // Verify Connection
        await got(`http://${vaultUrl}/v1/secret/config`, {
            headers: {
                'X-Vault-Token': vaultToken,
            },
        });

        await got(`http://${vaultUrl}/v1/secret/data/test`, {
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

        await got(`http://${vaultUrl}/v1/secret/data/nested/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': vaultToken,
            },
            json: {
                data: {
                    otherSecret: 'OTHERSUPERSECRET',
                },
            }
        });

        await got(`http://${vaultUrl}/v1/sys/mounts/my-secret`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': vaultToken,
            },
            json: {
                type: 'kv'
            }
        });

        await got(`http://${vaultUrl}/v1/my-secret/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': vaultToken,
            },
            json: {
                altSecret: 'CUSTOMSECRET',
            }
        });

        await got(`http://${vaultUrl}/v1/my-secret/nested/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': vaultToken,
            },
            json: {
                otherAltSecret: 'OTHERCUSTOMSECRET',
            },
        });

        await got(`http://${vaultUrl}/v1/cubbyhole/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': vaultToken,
            },
            json: {
                foo: 'bar',
                zip: 'zap',
            },
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})();
