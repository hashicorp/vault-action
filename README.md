# vault-action

A helper action for retrieving vault secrets as env vars.

## Example Usage

```yaml
jobs:
    build:
        # ...
        steps:
            # ...
            - name: Import Secrets
              uses: richicoder1/vault-action
              with:
                vaultUrl: https://vault.mycompany.com
                vaultToken: ${{ secrets.VaultToken }}
                keys: |
                    ci/aws accessKey | AWS_ACCESS_KEY_ID ;
                    ci/aws secretKey | AWS_SECRET_ACCESS_KEY ;
                    ci/npm token | NPM_TOKEN
            # ...
```

## Key Syntax

The `keys` parameter is multiple keys separated by the `;` character.

Each key is comprised of the `path` of they key, and optionally a [`JSONPath`](https://www.npmjs.com/package/jsonpath) expression and an output name.

```raw
{{ Key Path }} > {{ JSONPath Query }} | {{ Output Environment Variable Name }}
```

### Simple Key

To retrieve a key `npmToken` from path `ci` that has value `somelongtoken` from vault you could do:

```yaml
with:
    keys: ci npmToken
```

`vault-action` will automatically normalize the given data key, and output:

```bash
NPMTOKEN=somelongtoken
```

### Set Environment Variable Name

However, if you want to set it to a specific environmental variable, say `NPM_TOKEN`, you could do this instead:

```yaml
with:
    keys: ci npmToken | NPM_TOKEN
```

With that, `vault-action` will now use your requested name and output:

```bash
NPM_TOKEN=somelongtoken
```

### Multiple Keys

This action can take multi-line input, so say you had your AWS keys stored in a path and wanted to retrieve both of them. You can do:

```yaml
with:
    keys: |
        ci/aws accessKey | AWS_ACCESS_KEY_ID ;
        ci/aws secretKey | AWS_SECRET_ACCESS_KEY
```

## Masking

This action uses Github Action's built in masking, so all variables will automatically be masked if printed to the console or to logs.
