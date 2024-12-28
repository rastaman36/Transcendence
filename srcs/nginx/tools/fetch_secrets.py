#!/usr/bin/env python3

import os
import hvac
import warnings

# Suppress the DeprecationWarning
warnings.filterwarnings("ignore", category=DeprecationWarning)

def main():
    # Read the Vault token
    with open('/root/vault-root-token.txt', 'r') as token_file:
        vault_token = token_file.read().strip()

    # Create Vault client
    client = hvac.Client(url='http://hashi_vault:8200', token=vault_token)

    # Fetch SSL paths from Vault
    try:
        secret = client.secrets.kv.v2.read_secret_version(
            path='my-app/secrets',
            raise_on_deleted_version=True  # Explicitly set to maintain current behavior
        )
        ssl_cert_path = secret['data']['data']['SSL_CERT_PATH']
        ssl_key_path = secret['data']['data']['SSL_KEY_PATH']

        print(f"SSL_CERT_PATH: {ssl_cert_path}")
        print(f"SSL_KEY_PATH: {ssl_key_path}")

        # Export the paths so they can be used in the Nginx configuration
        os.environ['SSL_CERT_PATH'] = ssl_cert_path
        os.environ['SSL_KEY_PATH'] = ssl_key_path

        # Write the paths to a file that will be sourced by the shell script
        with open('/tmp/ssl_paths.env', 'w') as f:
            f.write(f"export SSL_CERT_PATH={ssl_cert_path}\n")
            f.write(f"export SSL_KEY_PATH={ssl_key_path}\n")

    except Exception as e:
        print(f"Error fetching secrets: {e}")
        exit(1)

if __name__ == "__main__":
    main()
