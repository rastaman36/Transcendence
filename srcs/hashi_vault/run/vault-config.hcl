# vault-config.hcl

# Listener configuration: Vault listens on localhost, port 8200
listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = 1
}

# Storage backend: Store data in a file (persistent)
storage "file" {
  path = "/vault/data"
}

# Disable mlock (needed for non-root containers)
disable_mlock = true

# Enable the Vault UI
ui = true