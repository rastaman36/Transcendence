#!/bin/bash

# Wait for the token file to be created
while [ ! -f /vault/data/vault-token.txt ]; do
  echo "Waiting for Vault token..."
  sleep 1
done

# Read the token and export it as an environment variable
export VAULT_TOKEN=$(cat /vault/data/vault-token.txt)

echo "Vault token set as environment variable."
