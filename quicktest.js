const got = require('got');

(async () => {
    const result = await got(`http://${process.env.VAULT_HOST}:${process.env.VAULT_PORT}/v1/secret/config`, {
        headers: {
            'X-Vault-Token': 'testtoken'
        }
    });
    
    console.log(result.body);
})();