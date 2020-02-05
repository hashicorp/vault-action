const got = require('got');

const vaultUrl = `${process.env.VAULT_HOST}:${process.env.VAULT_PORT}`;

(async () => {
    try {
        // Verify Connection
        await got(`http://${vaultUrl}/v1/secret/config`, {
            headers: {
                'X-Vault-Token': 'testtoken',
            },
        });

        await got(`http://${vaultUrl}/v1/secret/data/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': 'testtoken',
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
                'X-Vault-Token': 'testtoken',
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
                'X-Vault-Token': 'testtoken',
            },
            json: {
                type: 'kv'
            }
        });

        await got(`http://${vaultUrl}/v1/my-secret/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': 'testtoken',
            },
            json: {
                altSecret: 'CUSTOMSECRET',
            }
        });

        await got(`http://${vaultUrl}/v1/my-secret/nested/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': 'testtoken',
            },
            json: {
                otherAltSecret: 'OTHERCUSTOMSECRET',
            },
        });

        await got(`http://${vaultUrl}/v1/cubbyhole/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': 'testtoken',
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
