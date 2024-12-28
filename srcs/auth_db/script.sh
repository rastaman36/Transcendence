#!/bin/bash
set -e

# Function to fetch secrets
fetch_secrets() {
    echo "Fetching secrets..."
    /opt/venv/bin/python3 /bin/fetch_secrets.py
    if [ $? -ne 0 ]; then
        echo "Error: fetch_secrets.py failed. Exiting."
        exit 1
    fi
}

# Fetch secrets
fetch_secrets

# Set POSTGRES_PASSWORD_FILE instead of POSTGRES_PASSWORD
export POSTGRES_PASSWORD_FILE=/tmp/postgres-password

# Ensure the PostgreSQL data directory has correct ownership
chown -R postgres:postgres /var/lib/postgresql/data

# Start PostgreSQL in the background
docker-entrypoint.sh postgres &

# Wait for PostgreSQL to be ready
until pg_isready -U postgres; do
    echo "Waiting for PostgreSQL to be ready..."
    sleep 2
done

# Create the database if it doesn't exist
psql -U postgres <<-EOSQL
    CREATE DATABASE auth_db;
EOSQL

# Keep the script running
tail -f /dev/null
