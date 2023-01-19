# Vault GitHub Action

---

**Please note**: We take Vault's security and our users' trust very seriously. If you believe you have found a security issue in Vault or this Vault Action, _please responsibly disclose_ by contacting us at [security@hashicorp.com](mailto:security@hashicorp.com).

---

A helper action for easily pulling secrets from HashiCorp Vault™.

<!-- TOC -->

- [Vault GitHub Action](#vault-github-action)
  - [Example Usage](#example-usage)
  - [Authentication Methods](#authentication-methods)
    - [JWT with GitHub OIDC Tokens](#jwt-with-github-oidc-tokens)
    - [AppRole](#approle)
    - [Token](#token)
    - [GitHub](#github)
    - [JWT with OIDC Provider](#jwt-with-oidc-provider)
    - [Kubernetes](#kubernetes)
    - [Other Auth Methods](#other-auth-methods)
  - [Key Syntax](#key-syntax)
    - [Simple Key](#simple-key)
    - [Set Output Variable Name](#set-output-variable-name)
    - [Multiple Secrets](#multiple-secrets)
  - [Other Secret Engines](#other-secret-engines)
  - [Adding Extra Headers](#adding-extra-headers)
  - [HashiCorp Cloud Platform or Vault Enterprise](#hashicorp-cloud-platform-or-vault-enterprise)
    - [Namespace](#namespace)
  - [Reference](#reference)
  - [Masking - Hiding Secrets from Logs](#masking---hiding-secrets-from-logs)
  - [Normalization](#normalization)

<!-- /TOC -->

## Example Usage

```yaml
jobs:
    build:
        # ...
        steps:
            # ...
            - name: Import Secrets
              uses: hashicorp/vault-action@v2
              with:
                url: https://vault.mycompany.com:8200
                token: ${{ secrets.VAULT_TOKEN }}
                caCertificate: ${{ secrets.VAULT_CA_CERT }}
                secrets: |
                    secret/data/ci/aws accessKey | AWS_ACCESS_KEY_ID ;
                    secret/data/ci/aws secretKey | AWS_SECRET_ACCESS_KEY ;
                    secret/data/ci npm_token
            # ...
```

## Authentication Methods

Consider using a [Vault authentication method](https://www.vaultproject.io/docs/auth) such as the JWT auth method with
[GitHub OIDC tokens](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect) or the AppRole auth method. You can configure which by using the `method` parameter.

### JWT with GitHub OIDC Tokens

You can configure trust between a GitHub Actions workflow
and Vault using the
[GitHub's OIDC provider](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect).
Each GitHub Actions workflow receives an auto-generated OIDC token with claims
to establish the identity of the workflow.

__Vault Configuration__

<details>
<summary>Click to toggle instructions for configuring Vault.</summary>

Set up Vault with the [JWT auth method](https://www.vaultproject.io/api/auth/jwt#configure).
Pass the following parameters to your auth method configuration:

- `oidc_discovery_url`: `https://token.actions.githubusercontent.com`
- `bound_issuer`: `https://token.actions.githubusercontent.com`


Configure a [Vault role](https://www.vaultproject.io/api/auth/jwt#create-role) for the auth method.

- `role_type`: `jwt`

- `bound_audiences`: `"https://github.com/<org>"`. Update this parameter if
  you change the `aud` claim in the GitHub OIDC token via the
  `jwtGithubAudience` parameter in the action config.

- `user_claim`: Set this to a claim name (e.g., `repository`) in the
  [GitHub OIDC token](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect#understanding-the-oidc-token).

- `bound_claims` OR `bound_subject`: match on [GitHub subject claims](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect#example-subject-claims).

  - For wildcard (non-exact) matches, use `bound_claims`.

     - `bound_claims_type`: `glob`

     - `bound_claims`: JSON object. Maps one or more claim names to corresponding wildcard values.
       ```json
       {"sub": "repo:<orgName>/*"}
       ```

  - For exact matches, use `bound_subject`.

    - `bound_claims_type`: `string`

    - `bound_subject`: Must exactly match the `sub` claim in the OIDC token.
      ```plaintext
      repo:<orgName/repoName>:ref:refs/heads/branchName
      ```

</details>

__GitHub Actions Workflow__

In the GitHub Actions workflow, the workflow needs permissions to read contents
and write the ID token.

```yaml
jobs:
    retrieve-secret:
        permissions:
            contents: read
            id-token: write
```

In the action, provide the name of the Vault role you created to the `role` parameter.
You can optionally set the `jwtGithubAudience` parameter to change the `aud`
claim from its default.

```yaml
with:
  url: https://vault.mycompany.com:8200
  caCertificate: ${{ secrets.VAULT_CA_CERT }}
  role: <Vault JWT Auth Role Name>
  method: jwt
  jwtGithubAudience: sigstore # set the GitHub token's aud claim
```

### AppRole

The [AppRole auth method](https://www.vaultproject.io/docs/auth/approle) allows
your GitHub Actions workflow to authenticate to Vault with a pre-defined role.
Set the role ID and secret ID as GitHub secrets and pass them to the
`roleId` and `secretId` parameters.

```yaml
with:
  url: https://vault.mycompany.com:8200
  caCertificate: ${{ secrets.VAULT_CA_CERT }}
  method: approle
  roleId: ${{ secrets.VAULT_ROLE_ID }}
  secretId: ${{ secrets.VAULT_SECRET_ID }}
```

### Token

For the default method of authenticating to Vault,
use a [Vault token](https://www.vaultproject.io/docs/concepts/tokens).
Set the Vault token as a GitHub secret and pass
it to the `token` parameter.

```yaml
with:
  url: https://vault.mycompany.com:8200
  caCertificate: ${{ secrets.VAULT_CA_CERT }}
  token: ${{ secrets.VAULT_TOKEN }}
```

### GitHub

The [GitHub auth method](https://www.vaultproject.io/docs/auth/github)
requires `read:org` permissions for authentication. The auto-generated `GITHUB_TOKEN`
created for projects does not have these permissions and GitHub does not allow this
token's permissions to be modified. A new GitHub Token secret must be created with
`read:org` permissions to use this authentication method.

Pass the GitHub token as a GitHub secret into the `githubToken` parameter.

```yaml
with:
  url: https://vault.mycompany.com:8200
  caCertificate: ${{ secrets.VAULT_CA_CERT }}
  method: github
  githubToken: ${{ secrets.GITHUB_TOKEN }}
```

### JWT with OIDC Provider

You can configure trust between your own OIDC Provider and Vault
with the JWT auth method. Provide a `role` & `jwtPrivateKey` parameters,
additionally you can pass `jwtKeyPassword` & `jwtTtl` parameters

```yaml
with:
  url: https://vault.mycompany.com:8200
  caCertificate: ${{ secrets.VAULT_CA_CERT }}
  method: jwt
  role: <Vault JWT Auth Role Name>
  jwtPrivateKey: ${{ secrets.JWT_PRIVATE_KEY }}
  jwtKeyPassword: ${{ secrets.JWT_KEY_PASS }}
  jwtTtl: 3600 # 1 hour, default value
```

### Kubernetes

Consider the [Kubernetes auth method](https://www.vaultproject.io/docs/auth/kubernetes)
when using self-hosted runners on Kubernetes. You must provide the `role` parameter
for the Vault role associated with the Kubernetes auth method.
You can optionally override the `kubernetesTokenPath` parameter for
custom-mounted serviceAccounts.

```yaml
with:
  url: https://vault.mycompany.com:8200
  caCertificate: ${{ secrets.VAULT_CA_CERT }}
  method: kubernetes
  role: <Vault Kubernetes Auth Role Name>
  kubernetesTokenPath: /var/run/secrets/kubernetes.io/serviceaccount/token # default token path
```

### Other Auth Methods

If any other method is specified and you provide an `authPayload`, the action will
attempt to `POST` to `auth/${method}/login` with the provided payload and parse out the client token.

## Key Syntax

The `secrets` parameter is a set of multiple secret requests separated by the `;` character.

Each secret request consists of the `path` and the `key` of the desired secret, and optionally the desired Env Var output name.

```raw
{{ Secret Path }} {{ Secret Key or Selector }} | {{ Env/Output Variable Name }}
```

### Simple Key

To retrieve a key `npmToken` from path `secret/data/ci` that has value `somelongtoken` from vault you could do:

```yaml
with:
    secrets: secret/data/ci npmToken
```

`vault-action` will automatically normalize the given secret selector key, and set the follow as environment variables for the following steps in the current job:

```bash
NPMTOKEN=somelongtoken
```

You can also access the secret via outputs:

```yaml
steps:
    # ...
    - name: Import Secrets
      id: secrets
      # Import config...
    - name: Sensitive Operation
      run: "my-cli --token '${{ steps.secrets.outputs.npmToken }}'"
```

_**Note:** If you'd like to only use outputs and disable automatic environment variables, you can set the `exportEnv` option to `false`._

### Set Output Variable Name

However, if you want to set it to a specific name, say `NPM_TOKEN`, you could do this instead:

```yaml
with:
    secrets: secret/data/ci npmToken | NPM_TOKEN
```

With that, `vault-action` will now use your requested name and output:

```bash
NPM_TOKEN=somelongtoken
```

```yaml
steps:
  # ...
  - name: Import Secrets
    id: secrets
    # Import config...
  - name: Sensitive Operation
    run: "my-cli --token '${{ steps.secrets.outputs.NPM_TOKEN }}'"

```

### Multiple Secrets

This action can take multi-line input, so say you had your AWS keys stored in a path and wanted to retrieve both of them. You can do:

```yaml
with:
    secrets: |
        secret/data/ci/aws accessKey | AWS_ACCESS_KEY_ID ;
        secret/data/ci/aws secretKey | AWS_SECRET_ACCESS_KEY
```

## Other Secret Engines

Vault Action currently supports retrieving secrets from any engine where secrets
are retrieved via `GET` requests.  This means secret engines such as PKI are currently
not supported due to their requirement of sending parameters along with the request
(such as `common_name`).

For example, to request a secret from the `cubbyhole` secret engine:

```yaml
with:
    secrets: |
        /cubbyhole/foo foo ;
        /cubbyhole/foo zip | MY_KEY ;
```

Resulting in:

```bash
FOO=bar
MY_KEY=zap
```

```yaml
steps:
  # ...
  - name: Import Secrets
    id: secrets
    # Import config...
  - name: Sensitive Operation
    run: "my-cli --token '${{ steps.secrets.outputs.foo }}'"
  - name: Another Sensitive Operation
    run: "my-cli --token '${{ steps.secrets.outputs.MY_KEY }}'"
```

## Adding Extra Headers

If you ever need to add extra headers to the vault request, say if you need to authenticate with a firewall, all you need to do is set `extraHeaders`:

```yaml
with:
    secrets: |
        secret/ci/aws accessKey | AWS_ACCESS_KEY_ID ;
        secret/ci/aws secretKey | AWS_SECRET_ACCESS_KEY
    extraHeaders: |
      X-Secure-Id: ${{ secrets.SECURE_ID }}
      X-Secure-Secret: ${{ secrets.SECURE_SECRET }}
```

This will automatically add the `x-secure-id` and `x-secure-secret` headers to every request to Vault.

## HashiCorp Cloud Platform or Vault Enterprise

If you are using [HCP Vault](https://cloud.hashicorp.com/products/vault)
or Vault Enterprise, you may need additional parameters in
your GitHub Actions workflow.

### Namespace

If you need to retrieve secrets from a specific Vault namespace, set the `namespace`
parameter specifying the namespace. In HCP Vault, the namespace defaults to `admin`.

```yaml
steps:
    # ...
    - name: Import Secrets
      uses: hashicorp/vault-action
      with:
        url: https://vault-enterprise.mycompany.com:8200
        caCertificate: ${{ secrets.VAULT_CA_CERT }}
        method: token
        token: ${{ secrets.VAULT_TOKEN }}
        namespace: admin
        secrets: |
            secret/ci/aws accessKey | AWS_ACCESS_KEY_ID ;
            secret/ci/aws secretKey | AWS_SECRET_ACCESS_KEY ;
            secret/ci npm_token
```

## Reference

Here are all the inputs available through `with`:

| Input               | Description                                                                                                                                          | Default | Required |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | -------- |
| `url`               | The URL for the vault endpoint                                                                                                                       |         | ✔        |
| `secrets`           | A semicolon-separated list of secrets to retrieve. These will automatically be converted to environmental variable keys. See README for more details |         |          |
| `namespace`         | The Vault namespace from which to query secrets. Vault Enterprise only, unset by default                                                             |         |          |
| `method`            | The method to use to authenticate with Vault.                                                                                                        | `token` |          |
| `role`              | Vault role for specified auth method                                                                                                                 |         |          |
| `path`              | Custom vault path, if the auth method was enabled at a different path                                                                                                |         |          |
| `token`             | The Vault Token to be used to authenticate with Vault                                                                                                |         |          |
| `roleId`            | The Role Id for App Role authentication                                                                                                              |         |          |
| `secretId`          | The Secret Id for App Role authentication                                                                                                            |         |          |
| `githubToken`       | The Github Token to be used to authenticate with Vault                                                                                               |         |          |
| `jwtPrivateKey`     | Base64 encoded Private key to sign JWT                                                                                                               |         |          |
| `jwtKeyPassword`    | Password for key stored in jwtPrivateKey (if needed)                                                                                                 |         |          |
| `jwtGithubAudience` | Identifies the recipient ("aud" claim) that the JWT is intended for                                                                                   |`sigstore`|          |
| `jwtTtl`            | Time in seconds, after which token expires                                                                                                           |         | 3600     |
| `kubernetesTokenPath`         | The path to the service-account secret with the jwt token for kubernetes based authentication                                                                                               |`/var/run/secrets/kubernetes.io/serviceaccount/token`         |          |
| `authPayload`       | The JSON payload to be sent to Vault when using a custom authentication method.                                                                      |         |          |
| `extraHeaders`      | A string of newline separated extra headers to include on every request.                                                                             |         |          |
| `exportEnv`         | Whether or not export secrets as environment variables.                                                                                              | `true`  |          |
| `exportToken`       | Whether or not export Vault token as environment variables (i.e VAULT_TOKEN).                                                                        | `false` |          |
| `caCertificate`     | Base64 encoded CA certificate the server certificate was signed with.                                                                                |         |          |
| `clientCertificate` | Base64 encoded client certificate the action uses to authenticate with Vault when mTLS is enabled.                                                   |         |          |
| `clientKey`         | Base64 encoded client key the action uses to authenticate with Vault when mTLS is enabled.                                                           |         |          |
| `tlsSkipVerify`     | When set to true, disables verification of server certificates when testing the action.                                                              | `false` |          |

## Masking - Hiding Secrets from Logs

This action uses GitHub Action's built-in masking, so all variables will automatically be masked (aka hidden) if printed to the console or to logs.
**This only obscures secrets from output logs.** If someone has the ability to edit your workflows, then they are able to read and therefore write secrets to somewhere else just like normal GitHub Secrets.

## Normalization

To make it simpler to consume certain secrets as env vars, if no Env/Output Var Name is specified `vault-action` will replace and `.` chars with `__`, remove any other non-letter or number characters. If you're concerned about the result, it's recommended to provide an explicit Output Var Key.
