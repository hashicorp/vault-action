const got = require('./got');

(async () => {
    try {
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
                    secret: 'SUPERSECRET',
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
                    otherSecret: 'OTHERSUPERSECRET',
                },
            },
            json: true,
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})();
