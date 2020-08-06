ui = false
disable_mlock = true

listener "tcp" {
  address = "[::]:8200"
  cluster_address = "[::]:8201"
  tls_cert_file = "/etc/vault/server.crt"
  tls_key_file = "/etc/vault/server.key"
  tls_client_ca_file = "/etc/vault/ca.crt"
  tls_require_and_verify_client_cert = "true"
}

storage "file" {
  path = "/var/lib/vault"
}