jest.mock('@actions/core');
jest.mock('@actions/core/lib/command');
const core = require('@actions/core');
const rsasign = require('jsrsasign');
const {
    privateRsaKey,
    privateRsaKeyBase64,
    publicRsaKey
} = require('./rsa_keys');

const got = require('got');
const { when } = require('jest-when');

const { exportSecrets } = require('../../src/action');

const vaultUrl = `http://${process.env.VAULT_HOST || 'localhost'}:${process.env.VAULT_PORT || '8200'}`;

/**
 * Returns Github OIDC response mock
 * @param {string} aud Audience claim
 * @returns {string}
 */
function mockGithubOIDCResponse(aud= "https://github.com/hashicorp/vault-action") {
    const alg = 'RS256';
    const header = { alg: alg, typ: 'JWT' };
    const now = rsasign.KJUR.jws.IntDate.getNow();
    const payload = {
        jti: "unique-id",
        sub: "repo:hashicorp/vault-action:ref:refs/heads/main",
        aud,
        ref: "refs/heads/main",
        sha: "commit-sha",
        repository: "hashicorp/vault-action",
        repository_owner: "hashicorp",
        run_id: "1",
        run_number: "1",
        run_attempt: "1",
        actor: "github-username",
        workflow: "Workflow Name",
        head_ref: "",
        base_ref: "",
        event_name: "push",
        ref_type: "branch",
        job_workflow_ref: "hashicorp/vault-action/.github/workflows/workflow.yml@refs/heads/main",
        iss: 'vault-action',
        iat: now,
        nbf: now,
        exp: now + 3600,
    };
    const decryptedKey = rsasign.KEYUTIL.getKey(privateRsaKey);
    return rsasign.KJUR.jws.JWS.sign(alg, JSON.stringify(header), JSON.stringify(payload), decryptedKey);
}

// The sign call inside this function takes a while to run, so cache the default JWT in a constant.
const defaultGithubJwt = mockGithubOIDCResponse();

describe('jwt auth', () => {
    beforeAll(async () => {
        // Verify Connection
        await got(`${vaultUrl}/v1/secret/config`, {
            headers: {
                'X-Vault-Token': 'testtoken',
            },
        });

        try {
            await got(`${vaultUrl}/v1/sys/auth/jwt`, {
                method: 'POST',
                headers: {
                    'X-Vault-Token': 'testtoken',
                },
                json: {
                    type: 'jwt'
                }
            });
        } catch (error) {
            const {response} = error;
            if (response.statusCode === 400 && response.body.includes("path is already in use")) {
                // Auth method might already be enabled from previous test runs
            } else {
                throw error;
            }
        }

        await got(`${vaultUrl}/v1/sys/policy/reader`, {
            method: 'PUT',
            headers: {
                'X-Vault-Token': 'testtoken',
            },
            json: {
                policy: `
                path "*" {
                    capabilities = ["read"]
                }
                `
            }
        });

        await got(`${vaultUrl}/v1/auth/jwt/config`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': 'testtoken',
            },
            json: {
                jwt_validation_pubkeys: publicRsaKey,
                default_role: "default"
            }
        });

        await got(`${vaultUrl}/v1/auth/jwt/role/default`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': 'testtoken',
            },
            json: {
                role_type: 'jwt',
                bound_audiences: null,
                bound_claims: {
                    iss: 'vault-action'
                },
                user_claim: 'iss',
                policies: ['reader']
            }
        });

        await got(`${vaultUrl}/v1/secret/data/test`, {
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
    });

    describe('authenticate with private key', () => {
        beforeEach(() => {
            jest.resetAllMocks();

            when(core.getInput)
                .calledWith('url', expect.anything())
                .mockReturnValueOnce(`${vaultUrl}`);

            when(core.getInput)
                .calledWith('method', expect.anything())
                .mockReturnValueOnce('jwt');

            when(core.getInput)
                .calledWith('jwtPrivateKey', expect.anything())
                .mockReturnValueOnce(privateRsaKeyBase64);

            when(core.getInput)
                .calledWith('role', expect.anything())
                .mockReturnValueOnce('default');

            when(core.getInput)
                .calledWith('secrets', expect.anything())
                .mockReturnValueOnce('secret/data/test secret');
        });

        it('successfully authenticates', async () => {
            await exportSecrets();
            expect(core.exportVariable).toBeCalledWith('SECRET', 'SUPERSECRET');
        });
    });

    describe('authenticate with Github OIDC', () => {
        beforeAll(async () => {
            await got(`${vaultUrl}/v1/auth/jwt/role/default-sigstore`, {
                method: 'POST',
                headers: {
                    'X-Vault-Token': 'testtoken',
                },
                json: {
                    role_type: 'jwt',
                    bound_audiences: null,
                    bound_claims: {
                        iss: 'vault-action',
                        aud: 'sigstore',
                    },
                    user_claim: 'iss',
                    policies: ['reader']
                }
            });
        })

        beforeEach(() => {
            jest.resetAllMocks();

            when(core.getInput)
                .calledWith('url', expect.anything())
                .mockReturnValueOnce(`${vaultUrl}`);

            when(core.getInput)
                .calledWith('method', expect.anything())
                .mockReturnValueOnce('jwt');

            when(core.getInput)
                .calledWith('jwtPrivateKey', expect.anything())
                .mockReturnValueOnce('');

            when(core.getInput)
                .calledWith('secrets', expect.anything())
                .mockReturnValueOnce('secret/data/test secret');
        });

        it('successfully authenticates', async () => {
            when(core.getInput)
                .calledWith('role', expect.anything())
                .mockReturnValueOnce('default');

            when(core.getIDToken)
                .calledWith(undefined)
                .mockReturnValueOnce(defaultGithubJwt);

            await exportSecrets();
            expect(core.exportVariable).toBeCalledWith('SECRET', 'SUPERSECRET');
        });

        it('successfully authenticates with `jwtGithubAudience` set to `sigstore`', async () => {
            when(core.getInput)
                .calledWith('role', expect.anything())
                .mockReturnValueOnce('default-sigstore');

            when(core.getInput)
                .calledWith('jwtGithubAudience', expect.anything())
                .mockReturnValueOnce('sigstore');

            when(core.getIDToken)
                .calledWith(expect.anything())
                .mockReturnValueOnce(mockGithubOIDCResponse('sigstore'));

            await exportSecrets();
            expect(core.exportVariable).toBeCalledWith('SECRET', 'SUPERSECRET');
        })

        it('successfully authenticates as default role without specifying it', async () => {
            when(core.getInput)
                .calledWith('role', expect.anything())
                .mockReturnValueOnce(null);

            when(core.getIDToken)
                .calledWith(undefined)
                .mockReturnValueOnce(defaultGithubJwt);

            await exportSecrets();
            expect(core.exportVariable).toBeCalledWith('SECRET', 'SUPERSECRET');
        })

    });

});
