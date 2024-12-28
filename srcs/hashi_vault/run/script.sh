#!/bin/bash

# Start Vault server in the background
vault server -config=/etc/vault.d/vault.hcl &
VAULT_PID=$!

# Set VAULT_ADDR
export VAULT_ADDR='http://127.0.0.1:8200'

# Wait for Vault to start
sleep 10

# Initialize Vault
init_output=$(vault operator init -key-shares=5 -key-threshold=3)

# Extract unseal keys and root token from the initialization output
UNSEAL_KEY_1=$(echo "$init_output" | grep 'Unseal Key 1:' | awk '{print $NF}')
UNSEAL_KEY_2=$(echo "$init_output" | grep 'Unseal Key 2:' | awk '{print $NF}')
UNSEAL_KEY_3=$(echo "$init_output" | grep 'Unseal Key 3:' | awk '{print $NF}')
UNSEAL_KEY_4=$(echo "$init_output" | grep 'Unseal Key 4:' | awk '{print $NF}')
UNSEAL_KEY_5=$(echo "$init_output" | grep 'Unseal Key 5:' | awk '{print $NF}')
ROOT_TOKEN=$(echo "$init_output" | grep 'Initial Root Token:' | awk '{print $NF}')

# Output the keys and token
echo "Unseal Key 1: $UNSEAL_KEY_1"
echo "Unseal Key 2: $UNSEAL_KEY_2"
echo "Unseal Key 3: $UNSEAL_KEY_3"
echo "Unseal Key 4: $UNSEAL_KEY_4"
echo "Unseal Key 5: $UNSEAL_KEY_5"
echo "Initial Root Token: $ROOT_TOKEN"

# Unseal Vault
vault operator unseal $UNSEAL_KEY_1
vault operator unseal $UNSEAL_KEY_2
vault operator unseal $UNSEAL_KEY_3
vault operator unseal $UNSEAL_KEY_4
vault operator unseal $UNSEAL_KEY_5

# Log in to Vault with the root token
vault login $ROOT_TOKEN

# Save the root token for further use
echo "$ROOT_TOKEN" > /root/vault-root-token.txt

# Optionally, you can export the token as an environment variable
export VAULT_TOKEN=$ROOT_TOKEN

export VAULT_ADDR='http://127.0.0.1:8200'
vault secrets enable -path=secret kv-v2

# Execute add_data.py
ADD_DATA_PATH=$(find / -name add_data.py 2>/dev/null)
if [ -n "$ADD_DATA_PATH" ]; then
    echo "Found add_data.py at $ADD_DATA_PATH"
    python3 "$ADD_DATA_PATH"
else
    echo "Error: add_data.py not found in the filesystem. Skipping execution."
fi

# Keep the script running to maintain the Vault server
wait $VAULT_PID

echo "Vault has been initialized, unsealed, and logged in."
echo "Root token saved to /root/vault-root-token.txt"
