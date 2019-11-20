# vault-action

A helper action for easily pulling secrets from the default v2 K/V backend of vault.

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
                method: token
                token: ${{ secrets.VaultToken }}
                secrets: |
                    ci/aws accessKey | AWS_ACCESS_KEY_ID ;
                    ci/aws secretKey | AWS_SECRET_ACCESS_KEY ;
                    ci npm_token
            # ...
```

## Authentication method

The `method` parameter can have these value :
- **token**: you must provide a token parameter
- **approle**: you must provide a roleId & secretId parameter

## Key Syntax

The `secrets` parameter is a set of multiple secret requests separated by the `;` character.

Each secret request is comprised of the `path` and the `key` of the desired secret, and optionally the desired Env Var output name.

```raw
{{ Secret Path }} {{ Secret Key }} | {{ Output Environment Variable Name }}
```

### Simple Key

To retrieve a key `npmToken` from path `ci` that has value `somelongtoken` from vault you could do:

```yaml
with:
    secrets: ci npmToken
```

`vault-action` will automatically normalize the given data key, and output:

```bash
NPMTOKEN=somelongtoken
```

### Set Environment Variable Name

However, if you want to set it to a specific environmental variable, say `NPM_TOKEN`, you could do this instead:

```yaml
with:
    secrets: ci npmToken | NPM_TOKEN
```

With that, `vault-action` will now use your requested name and output:

```bash
NPM_TOKEN=somelongtoken
```

### Multiple Secrets

This action can take multi-line input, so say you had your AWS keys stored in a path and wanted to retrieve both of them. You can do:

```yaml
with:
    secrets: |
        ci/aws accessKey | AWS_ACCESS_KEY_ID ;
        ci/aws secretKey | AWS_SECRET_ACCESS_KEY
```

### Namespace

This action could be use with namespace Vault Enterprise feature. You can specify namespace in request : 

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
