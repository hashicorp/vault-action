const got = require('got');

(async () => {
    const result = await got(`https://${process.env.VAULT_HOST}:${process.env.VAULT_PORT}/v1/secret/config`, {
        method: 'POST',
        headers: {
            'X-Vault-Token': 'testtoken'
        }
    });
    
    console.log(result.body);
})();