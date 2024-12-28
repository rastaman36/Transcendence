#!/bin/bash

MAX_RETRIES=30
RETRY_INTERVAL=2

# Function to check if vault is accessible
check_vault() {
    curl -s -o /dev/null -w "%{http_code}" $VAULT_ADDR/v1/sys/health || echo "000"
}

# Wait for Vault to be ready
echo "Waiting for Vault to be ready..."
for i in $(seq 1 $MAX_RETRIES); do
    STATUS=$(check_vault)
    if [ "$STATUS" = "200" ] || [ "$STATUS" = "429" ]; then
        echo "Vault is ready!"
        break
    fi
    if [ $i -eq $MAX_RETRIES ]; then
        echo "Timeout waiting for Vault"
        exit 1
    fi
    echo "Waiting for Vault to be ready... (Attempt $i/$MAX_RETRIES)"
    sleep $RETRY_INTERVAL
done

# Fetch secrets and source them
python /bin/fetch_secrets.py
if [ ! -f /tmp/prof_env ]; then
    echo "Failed to create prof_env file"
    exit 1
fi

# Create a profile script that will be sourced on shell login
cat > /etc/profile.d/prof_env.sh << 'EOF'
#!/bin/bash
set -a
. /tmp/prof_env
set +a
EOF

chmod +x /etc/profile.d/prof_env.sh

# Source it now
. /etc/profile.d/prof_env.sh

# Verify that environment variables are set
if [ -z "$PROF_DB_USER" ] || [ -z "$PROF_DB_PASSWORD" ]; then
    echo "Environment variables not set properly"
    exit 1
fi

# Start the application
exec /bin/script.sh 