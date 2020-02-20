# vault-action

A helper action for easily pulling secrets from HashiCorp Vault™.

By default, this action pulls from  [Version 2](https://www.vaultproject.io/docs/secrets/kv/kv-v2/) of the K/V Engine. See examples below for how to [use v1](#using-kv-version-1) as well as [other non-K/V engines](#other-secret-engines).

## Example Usage

```yaml
jobs:
    build:
        # ...
        steps:
            # ...
            - name: Import Secrets
              uses: RichiCoder1/vault-action
              with:
                url: https://vault.mycompany.com:8200
                token: ${{ secrets.VaultToken }}
                secrets: |
                    ci/aws accessKey | AWS_ACCESS_KEY_ID ;
                    ci/aws secretKey | AWS_SECRET_ACCESS_KEY ;
                    ci npm_token
            # ...
```

## Authentication method

While most workflows will likely use a vault token, you can also use an `approle` to authenticate with vaule. You can configure which by using the `method` parameter:

- **token**: (by default) you must provide a token parameter
```yaml
...
with:
  url: https://vault.mycompany.com:8200
  token: ${{ secrets.VaultToken }}
```
- **approle**: you must provide a roleId & secretId parameter
```yaml
...
with:
  url: https://vault.mycompany.com:8200
  method: approle
  roleId: ${{ secrets.roleId }}
  secretId: ${{ secrets.secretId }}
```

## Key Syntax

The `secrets` parameter is a set of multiple secret requests separated by the `;` character.

Each secret request is comprised of the `path` and the `key` of the desired secret, and optionally the desired Env Var output name.

```raw
{{ Secret Path }} {{ Secret Key }} | {{ Output Variable Name }}
```

### Simple Key

To retrieve a key `npmToken` from path `ci` that has value `somelongtoken` from vault you could do:

```yaml
with:
    secrets: ci npmToken
```

`vault-action` will automatically normalize the given secret selector key, and set the follow as environment variables for the following steps in the current job:

```bash
NPMTOKEN=somelongtoken
```

You can also access the secret via ouputs:

```yaml
steps:
    # ...
    - name: Import Secrets
      id: secrets
      # Import config...
    - name: Sensitive Operation
      run: "my-cli --token '${{ steps.secrets.outputs.npmToken }}'"

```

### Set Output Variable Name

However, if you want to set it to a specific name, say `NPM_TOKEN`, you could do this instead:

```yaml
with:
    secrets: ci npmToken | NPM_TOKEN
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
        ci/aws accessKey | AWS_ACCESS_KEY_ID ;
        ci/aws secretKey | AWS_SECRET_ACCESS_KEY
```

### Using K/V version 1

By default, `vault-action` expects a K/V engine using [version 2](https://www.vaultproject.io/docs/secrets/kv/kv-v2.html).

In order to work with a [v1 engine](https://www.vaultproject.io/docs/secrets/kv/kv-v1/), the `kv-version` parameter may be passed:

```yaml
with:
    kv-version: 1
```

### Custom K/V Engine Path

When you enable the K/V Engine, by default it's placed at the path `secret`, so a secret named `ci` will be accessed from `secret/ci`. However, [if you enabled the secrets engine using a custom `path`](https://www.vaultproject.io/docs/commands/secrets/enable/#inlinecode--path-4), you
can pass it as follows:

```yaml
with:
    path: my-secrets
    secrets: ci npmToken
```

This way, the `ci` secret in the example above will be retrieved from `my-secrets/ci`.

### Other Secret Engines

While this action primarily supports the K/V engine, it is possible to request secrets from other engines in Vault.

To do so when specifying the `Secret Path`, just append a leading formard slash (`/`) and specify the path as described in the Vault API documentation.

For example, to retrieve a stored secret from the [`cubbyhole` engine](https://www.vaultproject.io/api-docs/secret/cubbyhole/), assuming you have a stored secret at the path `foo` with the contents:

```json
{
  "foo": "bar",
  "zip": "zap"
}
```

You could request the contents like so:

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

Secrets pulled from the same `Secret Path` are cached by default. So if you, for example, are using the `aws` engine and retrieve a key, only a single key for a given path is returned.

e.g.:

```yaml
with:
    secrets: |
        /aws/creds/ci access_key | AWS_ACCESS_KEY_ID ;
        /aws/creds/ci secret_key | AWS_SECRET_ACCESS_KEY
```

would work fine.

NOTE: The `Secret Key` is pulled from the `data` property of the response.

## Vault Enterprise Features

### Namespace

If you need to retrieve secrets from a specific vault namespace, all that's required is an additional parameter specifying the namespace.

```yaml
steps:
    # ...
    - name: Import Secrets
      uses: RichiCoder1/vault-action
      with:
        url: https://vault-enterprise.mycompany.com:8200
        method: token
        token: ${{ secrets.VaultToken }}
        namespace: ns1
        secrets: |
            ci/aws accessKey | AWS_ACCESS_KEY_ID ;
            ci/aws secretKey | AWS_SECRET_ACCESS_KEY ;
            ci npm_token
```

## Masking

This action uses Github Action's built in masking, so all variables will automatically be masked if printed to the console or to logs.
