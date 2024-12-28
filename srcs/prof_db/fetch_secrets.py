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
        prof_db_user = secret['data']['data']['PROF_DB_USER']
        prof_db_password = secret['data']['data']['PROF_DB_PASSWORD']
        postgres_password = secret['data']['data']['POSTGRES_PASSWORD']
        prof_db_name = secret['data']['data']['PROF_DB_NAME']
        prof_db_port = secret['data']['data']['PROF_DB_PORT']
        prof_db_host = secret['data']['data']['PROF_DB_HOST']
        pgport = secret['data']['data']['PGPORT']

        # Set environment variables for PostgreSQL
        os.environ['PROF_DB_USER'] = prof_db_user
        os.environ['PROF_DB_PASSWORD'] = prof_db_password
        os.environ['POSTGRES_PASSWORD'] = postgres_password
        os.environ['PROF_DB_NAME'] = prof_db_name
        os.environ['PROF_DB_PORT'] = str(prof_db_port)
        os.environ['PROF_DB_HOST'] = prof_db_host
        os.environ['PGPORT'] = "4321"

        # Write the fetched PostgreSQL password to a file
        with open(postgres_password_file, 'w') as f:
            f.write(postgres_password)
        print(f"Successfully wrote PostgreSQL password to {postgres_password_file}")

        # Get current date and set it as an environment variable
        from datetime import datetime
        current_date = datetime.now().strftime('%Y-%m-%d')
        os.environ['CURRENT_DATE'] = current_date

        print("Successfully fetched and set database secrets from Vault")
        print(f"PROF_DB_USER: {os.environ['PROF_DB_USER']}")
        print(f"PROF_DB_NAME: {os.environ['PROF_DB_NAME']}")
        print(f"PROF_DB_PORT: {os.environ['PROF_DB_PORT']}")
        print(f"PROF_DB_HOST: {os.environ['PROF_DB_HOST']}")
        print(f"CURRENT_DATE: {os.environ['CURRENT_DATE']}")
        print(f"PGPORT: {os.environ['PGPORT']}")

    except Exception as e:
        print(f"Error fetching secrets from Vault: {e}")
        sys.exit(1)

    print("fetch_secrets.py script completed successfully")

if __name__ == "__main__":
    main()
