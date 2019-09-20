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
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})();