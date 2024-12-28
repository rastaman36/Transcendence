#!/usr/bin/env python3

import os
import hvac
import sys
import warnings

# Suppress the DeprecationWarning
warnings.filterwarnings("ignore", category=DeprecationWarning)

def main():
    print("Starting fetch_secrets.py script")
    vault_addr = os.environ.get('VAULT_ADDR', 'http://hashi_vault:8200')
    print(f"Using Vault address: {vault_addr}")
    
    token_file = '/run/secrets/vault-token'
    try:
        if not os.path.exists(token_file):
            print(f"Token file not found at {token_file}")
            print("Contents of /run/secrets:")
            print(os.listdir('/run/secrets'))
            sys.exit(1)
        else:
            with open(token_file, 'r') as f:
                vault_token = f.read().strip()
            print("Successfully read Vault token")
    except Exception as e:
        print(f"Error reading Vault token: {e}")
        sys.exit(1)

    # Create Vault client
    client = hvac.Client(url=vault_addr, token=vault_token)

    # Fetch secrets from Vault
    try:

        secret = client.secrets.kv.v2.read_secret_version(path='my-app/secrets', raise_on_deleted_version=False)
        auth_db_user = secret['data']['data']['AUTH_DB_USER']
        auth_db_password = secret['data']['data']['AUTH_DB_PASSWORD']
        auth_db_name = secret['data']['data']['AUTH_DB_NAME']
        auth_db_port = secret['data']['data']['AUTH_DB_PORT']
        auth_db_host = secret['data']['data']['AUTH_DB_HOST']
        auth_secret_key = secret['data']['data']['AUTH_SECRET_KEY']
        auth_debug = secret['data']['data']['AUTH_DEBUG']
        auth_port = secret['data']['data']['AUTH_PORT']
        # Fetch Intra authentication secrets
        intra_secret = secret['data']['data']['INTRA_SECRET']
        intra_uid = secret['data']['data']['INTRA_UID']
        intra_redirect_uri = secret['data']['data']['INTRA_REDIRECT_URI']

        # Set environment variables
        os.environ['AUTH_DB_USER'] = auth_db_user
        os.environ['AUTH_DB_PASSWORD'] = auth_db_password
        os.environ['AUTH_DB_NAME'] = auth_db_name
        os.environ['AUTH_DB_PORT'] = str(auth_db_port)
        os.environ['AUTH_DB_HOST'] = auth_db_host
        os.environ['AUTH_SECRET_KEY'] = auth_secret_key
        os.environ['AUTH_DEBUG'] = str(auth_debug)
        os.environ['AUTH_PORT'] = str(auth_port)
        # Set Intra authentication environment variables
        os.environ['INTRA_SECRET'] = intra_secret
        os.environ['INTRA_UID'] = intra_uid
        os.environ['INTRA_REDIRECT_URI'] = intra_redirect_uri

        print("Successfully fetched and set database secrets from Vault")
        print(f"AUTH_DB_USER: {os.environ['AUTH_DB_USER']}")
        print(f"AUTH_DB_NAME: {os.environ['AUTH_DB_NAME']}")
        print(f"AUTH_DB_PORT: {os.environ['AUTH_DB_PORT']}")
        print(f"AUTH_DB_HOST: {os.environ['AUTH_DB_HOST']}")
        print(f"AUTH_SECRET_KEY is set: {'Yes' if 'AUTH_SECRET_KEY' in os.environ else 'No'}")
        print(f"AUTH_DEBUG is set: {'Yes' if 'AUTH_DEBUG' in os.environ else 'No'}")
        print(f"AUTH_PORT is set: {'Yes' if 'AUTH_PORT' in os.environ else 'No'}")
        print("Successfully fetched and set Intra authentication secrets from Vault")
        print(f"INTRA_SECRET is set: {'Yes' if 'INTRA_SECRET' in os.environ else 'No'}")
        print(f"INTRA_UID is set: {'Yes' if 'INTRA_UID' in os.environ else 'No'}")
        print(f"INTRA_REDIRECT_URI is set: {'Yes' if 'INTRA_REDIRECT_URI' in os.environ else 'No'}")

        # Write environment variables to a file
        with open('/tmp/auth_env', 'w') as f:
            for key, value in os.environ.items():
                f.write(f"export {key}='{value}'\n")

    except Exception as e:
        print(f"Error fetching secrets from Vault: {e}")
        sys.exit(1)

    print("fetch_secrets.py script completed successfully")

if __name__ == "__main__":
    main()
