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
                    ci_key ;
                    ci/aws > $.accessKey | AWS_ACCESS_KEY_ID ;
                    ci/aws > $.secretKey | AWS_SECRET_ACCESS_KEY ;
                    ci/npm_token | NPM_TOKEN
            # ...
```

## Key Syntax

The `keys` parameter is multiple keys separated by the `;` character.

Each key is comprised of the `path` of they key, and optionally a [`JSONPath`](https://www.npmjs.com/package/jsonpath) expression and an output name.

```raw
{{ Key Path }} > {{ JSONPath Query }} | {{ Output Environment Variable Name }}
```

### Simple Key

To retrieve a key `ci/npm_token` that has value `somelongtoken` from vault you could do:

```yaml
with:
    keys: ci/npm_token
```

`vault-action` will automatically normalize the given path, and output:

```bash
CI__NPM_TOKEN=somelongtoken
```

### Set Environment Variable Name

However, if you want to set it to a specific environmental variable, say `NPM_TOKEN`, you could do this instead:

```yaml
with:
    keys: ci/npm_token | NPM_TOKEN
```

With that, `vault-action` will now use your request name and output:

```bash
NPM_TOKEN=somelongtoken
```

### JSON Key

Say you are storing a set of AWS keys as a JSON document in Vault like so:

```json
{
    "accessKey": "AKIAIOSFODNN7EXAMPLE",
    "secretKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
}
```

And you want to set them to `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` respectively so you could use the AWS CLI:

```yaml
with:
    keys: |
        ci/aws > $.accessKey | AWS_ACCESS_KEY_ID ;
        ci/aws > $.secretKey | AWS_SECRET_ACCESS_KEY
```

This would output:

```bash
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

## Masking

This action uses Github Action's built in masking, so all variables will automatically be masked if printed to the console or to logs.
