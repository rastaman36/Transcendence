#!/usr/bin/env python3

import os
import hvac
import sys
import warnings

# Suppress the DeprecationWarning
warnings.filterwarnings("ignore", category=DeprecationWarning)

def main():
    print("Starting fetch_secrets.py script for profile service")
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
        prof_db_user = secret['data']['data']['PROF_DB_USER']
        prof_db_password = secret['data']['data']['PROF_DB_PASSWORD']
        prof_db_name = secret['data']['data']['PROF_DB_NAME']
        prof_db_port = secret['data']['data']['PROF_DB_PORT']
        prof_db_host = secret['data']['data']['PROF_DB_HOST']
        prof_secret_key = secret['data']['data']['PROF_SECRET_KEY']
        prof_debug = secret['data']['data']['PROF_DEBUG']
        prof_port = secret['data']['data']['PROF_PORT']

        # Set environment variables
        os.environ['PROF_DB_USER'] = prof_db_user
        os.environ['PROF_DB_PASSWORD'] = prof_db_password
        os.environ['PROF_DB_NAME'] = prof_db_name
        os.environ['PROF_DB_PORT'] = str(prof_db_port)
        os.environ['PROF_DB_HOST'] = prof_db_host
        os.environ['PROF_SECRET_KEY'] = prof_secret_key
        os.environ['PROF_DEBUG'] = str(prof_debug)
        os.environ['PROF_PORT'] = str(prof_port)

        print("Successfully fetched and set profile secrets from Vault")
        print(f"PROF_DB_USER: {os.environ['PROF_DB_USER']}")
        print(f"PROF_DB_NAME: {os.environ['PROF_DB_NAME']}")
        print(f"PROF_DB_PORT: {os.environ['PROF_DB_PORT']}")
        print(f"PROF_DB_HOST: {os.environ['PROF_DB_HOST']}")
        print(f"PROF_SECRET_KEY is set: {'Yes' if 'PROF_SECRET_KEY' in os.environ else 'No'}")
        print(f"PROF_DEBUG is set: {'Yes' if 'PROF_DEBUG' in os.environ else 'No'}")
        print(f"PROF_PORT is set: {'Yes' if 'PROF_PORT' in os.environ else 'No'}")

        # Write environment variables to a file
        with open('/tmp/prof_env', 'w') as f:
            for key, value in os.environ.items():
                f.write(f"export {key}='{value}'\n")

    except Exception as e:
        print(f"Error fetching secrets from Vault: {e}")
        sys.exit(1)

    print("fetch_secrets.py script completed successfully for profile service")

if __name__ == "__main__":
    main()
