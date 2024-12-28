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
    postgres_password_file = '/tmp/postgres-password'  # Changed location

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
        postgres_password = secret['data']['data']['POSTGRES_PASSWORD']
        auth_db_name = secret['data']['data']['AUTH_DB_NAME']
        auth_db_port = secret['data']['data']['AUTH_DB_PORT']
        auth_db_host = secret['data']['data']['AUTH_DB_HOST']

        # Set environment variables for PostgreSQL
        os.environ['AUTH_DB_USER'] = auth_db_user
        os.environ['AUTH_DB_PASSWORD'] = auth_db_password
        os.environ['POSTGRES_PASSWORD'] = postgres_password
        os.environ['AUTH_DB_NAME'] = auth_db_name
        os.environ['AUTH_DB_PORT'] = str(auth_db_port)
        os.environ['AUTH_DB_HOST'] = auth_db_host

        # Get current date and set it as an environment variable
        from datetime import datetime
        current_date = datetime.now().strftime('%Y-%m-%d')
        os.environ['CURRENT_DATE'] = current_date

        # Write the fetched PostgreSQL password to a file
        with open(postgres_password_file, 'w') as f:
            f.write(postgres_password)
        print(f"Successfully wrote PostgreSQL password to {postgres_password_file}")

        print("Successfully fetched and set database secrets from Vault")
        print(f"AUTH_DB_USER: {os.environ['AUTH_DB_USER']}")
        print(f"AUTH_DB_NAME: {os.environ['AUTH_DB_NAME']}")
        print(f"AUTH_DB_PORT: {os.environ['AUTH_DB_PORT']}")
        print(f"AUTH_DB_HOST: {os.environ['AUTH_DB_HOST']}")
        print(f"CURRENT_DATE: {os.environ['CURRENT_DATE']}")
        # Don't print the password for security reasons

    except Exception as e:
        print(f"Error fetching secrets from Vault: {e}")
        sys.exit(1)

    print("fetch_secrets.py script completed successfully")

if __name__ == "__main__":
    main()
