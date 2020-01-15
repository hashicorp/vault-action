const got = require('got');

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
            json: {
                data: {
                    secret: 'SUPERSECRET',
                },
            },
        });

        await got(`http://${process.env.VAULT_HOST}:${process.env.VAULT_PORT}/v1/secret/data/nested/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': 'testtoken',
            },
            json: {
                data: {
                    otherSecret: 'OTHERSUPERSECRET',
                },
            },
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})();
