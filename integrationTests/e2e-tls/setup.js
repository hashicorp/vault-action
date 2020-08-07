const got = require('got');
const core = require('@actions/core');

const vaultUrl = `${process.env.VAULT_HOST}:${process.env.VAULT_PORT}`;
const caCertificateRaw = `${process.env.VAULTCA}`;
const clientCertificateRaw = `${process.env.VAULT_CLIENT_CERT}`;
const clientKeyRaw = `${process.env.VAULT_CLIENT_KEY}`;

(async () => {
    try {
        var caCertificate = Buffer.from(caCertificateRaw, 'base64').toString();
        if (caCertificate == null) {
            throw Error("VAULTCA env not set.")
        }

        var clientCertificate = Buffer.from(clientCertificateRaw, 'base64').toString();
        if (clientCertificate == null) {
            throw Error("VAULT_CLIENT_CERT env not set.")
        }

        var clientKey = Buffer.from(clientKeyRaw, 'base64').toString();
        if (clientKey == null) {
            throw Error("VAULT_CLIENT_KEY env not set.")
        }

        // Init
        const {body} = await got(`https://${vaultUrl}/v1/sys/init`, {
            method: 'POST',
            json: {
                secret_shares: 1,
                secret_threshold: 1,
            },
            responseType: 'json',
            https: {
                certificateAuthority: caCertificate,
                certificate: clientCertificate,
                key: clientKey,
            }
        });

        if (body.keys_base64.length != 1) {
            throw Error("No unseal key found after init.")
        }
        var unseal = body.keys_base64[0];

        if (body.root_token == "") {
            throw Error("No root token found after init.")
        }
        var rootToken = body.root_token;

        core.exportVariable('VAULT_TOKEN', rootToken);
        core.setSecret(rootToken)

        // Unseal 
        await got(`https://${vaultUrl}/v1/sys/unseal`, {
            method: 'POST',
            json: {
                key: unseal,
            },
            https: {
                certificateAuthority: caCertificate,
                certificate: clientCertificate,
                key: clientKey,
            }
        });

        await got(`https://${vaultUrl}/v1/sys/mounts/secret`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': rootToken,
            },
            https: {
                certificateAuthority: caCertificate,
                certificate: clientCertificate,
                key: clientKey,
            },
            json: {
                type: 'kv-v2'
            }
        });

        await got(`https://${vaultUrl}/v1/secret/data/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': rootToken,
            },
            https: {
                certificateAuthority: caCertificate,
                certificate: clientCertificate,
                key: clientKey,
            },
            json: {
                data: {
                    secret: 'SUPERSECRET',
                },
            },
        });

        await got(`https://${vaultUrl}/v1/secret/data/nested/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': rootToken,
            },
            https: {
                certificateAuthority: caCertificate,
                certificate: clientCertificate,
                key: clientKey,
            },
            json: {
                data: {
                    otherSecret: 'OTHERSUPERSECRET',
                },
            }
        });

        await got(`https://${vaultUrl}/v1/secret/data/tlsSkipVerify`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': rootToken,
            },
            https: {
                certificateAuthority: caCertificate,
                certificate: clientCertificate,
                key: clientKey,
            },
            json: {
                data: {
                    skip: 'true',
                },
            }
        });

        await got(`https://${vaultUrl}/v1/sys/mounts/my-secret`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': rootToken,
            },
            https: {
                certificateAuthority: caCertificate,
                certificate: clientCertificate,
                key: clientKey,
            },
            json: {
                type: 'kv'
            }
        });

        await got(`https://${vaultUrl}/v1/my-secret/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': rootToken,
            },
            https: {
                certificateAuthority: caCertificate,
                certificate: clientCertificate,
                key: clientKey,
            },
            json: {
                altSecret: 'CUSTOMSECRET',
            }
        });

        await got(`https://${vaultUrl}/v1/my-secret/nested/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': rootToken,
            },
            https: {
                certificateAuthority: caCertificate,
                certificate: clientCertificate,
                key: clientKey,
            },
            json: {
                otherAltSecret: 'OTHERCUSTOMSECRET',
            },
        });

        await got(`https://${vaultUrl}/v1/cubbyhole/test`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': rootToken,
            },
            https: {
                certificateAuthority: caCertificate,
                certificate: clientCertificate,
                key: clientKey,
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
