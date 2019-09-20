const got = require('got');

(async () => {
    const result = await got(`localhost:8200/v1/secret/config`, {
        method: 'POST',
        headers: {
            'X-Vault-Token': 'testtoken'
        }
    });
    
    console.log(result.body);
})();