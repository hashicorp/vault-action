#!/usr/bin/env bash
# Copyright IBM Corp. 2019, 2025
# SPDX-License-Identifier: MIT
#
# Generates a PKI chain (CA, server cert, client cert) using cfssl.
# Outputs certs to .build/certs/ and writes .build/e2e-tls.env for local
# act usage (act --env-file .build/e2e-tls.env).
#
# Usage: ./scripts/gen-tls-certs.sh
# Requires: cfssl, cfssljson  (brew install cfssl)

set -euo pipefail

pushd "$(git rev-parse --show-toplevel || echo .)" > /dev/null

OUTDIR=".build/certs"
ENVFILE=".build/e2e-tls.env"

if ! command -v cfssl &>/dev/null || ! command -v cfssljson &>/dev/null; then
    echo "error: cfssl and cfssljson are required." >&2
    popd > /dev/null
    exit 1
fi

mkdir -p "$OUTDIR"
pushd "$OUTDIR" > /dev/null

# ── cfssl signing config ──────────────────────────────────────────────────────
cat > cfssl-config.json <<'EOF'
{
  "signing": {
    "default": { "expiry": "8760h" },
    "profiles": {
      "server": {
        "usages": ["signing", "key encipherment", "server auth"],
        "expiry": "8760h"
      },
      "client": {
        "usages": ["signing", "key encipherment", "client auth"],
        "expiry": "8760h"
      }
    }
  }
}
EOF

# ── CA ────────────────────────────────────────────────────────────────────────
echo "Generating CA..."
cfssl gencert -initca - <<'EOF' | cfssljson -bare ca
{
  "CN": "Vault Test CA",
  "key": { "algo": "rsa", "size": 2048 },
  "ca": { "expiry": "87600h" }
}
EOF

# ── Server cert ───────────────────────────────────────────────────────────────
echo "Generating server certificate..."
cfssl gencert \
    -ca=ca.pem \
    -ca-key=ca-key.pem \
    -config=cfssl-config.json \
    -profile=server - <<'EOF' | cfssljson -bare server
{
  "CN": "vault-tls",
  "hosts": ["localhost", "127.0.0.1", "vault-tls"],
  "key": { "algo": "rsa", "size": 2048 }
}
EOF

# ── Client cert ───────────────────────────────────────────────────────────────
echo "Generating client certificate..."
cfssl gencert \
    -ca=ca.pem \
    -ca-key=ca-key.pem \
    -config=cfssl-config.json \
    -profile=client - <<'EOF' | cfssljson -bare client
{
  "CN": "vault-client",
  "key": { "algo": "rsa", "size": 2048 }
}
EOF

# ── Rename to names expected by vault config ──────────────────────────────────
mv ca.pem ca.crt
mv server.pem server.crt
mv server-key.pem server.key
mv client.pem client.crt
mv client-key.pem client.key

# ── Remove intermediates not needed at runtime ────────────────────────────────
rm -f ca.csr server.csr client.csr ca-key.pem cfssl-config.json

# Ensure files are readable by the vault container user
chmod 644 ./*.crt ./*.key

popd > /dev/null

# ── Copy vault server config ──────────────────────────────────────────────────
cp "integrationTests/e2e-tls/configs/config.hcl" "$OUTDIR/config.hcl"

# ── Write env file for local act usage ───────────────────────────────────────
{
    printf 'VAULTCA=%s\n'          "$(base64 < "$OUTDIR/ca.crt"     | tr -d '\n')"
    printf 'VAULT_CLIENT_CERT=%s\n' "$(base64 < "$OUTDIR/client.crt" | tr -d '\n')"
    printf 'VAULT_CLIENT_KEY=%s\n'  "$(base64 < "$OUTDIR/client.key" | tr -d '\n')"
} > "$ENVFILE"

echo "Certs generated in $OUTDIR"
echo "Env file written to $ENVFILE"

popd > /dev/null
