import hvac

# Read the root token from the file
with open('/root/vault-root-token.txt', 'r') as token_file:
    vault_token = token_file.read().strip()

# Authenticate to Vault using the token from the file
client = hvac.Client(
    url='http://127.0.0.1:8200',
    token=vault_token,
)

# Check if the secret already exists
try:
    existing_secrets = client.secrets.kv.v2.read_secret_version(path='my-app/secrets')
    existing_data = existing_secrets['data']['data']
except hvac.exceptions.InvalidPath:
    existing_data = {}

# Define the secrets to be added or updated
new_secrets = {
    # Authentication service credentials
    "AUTH_SECRET_KEY": "django-insecure-%7&w)h*y8ww7cx(!po(%7@pxp33uc%__a@kg(nzm1k3e0^)+17",
    "AUTH_DEBUG": True,
    "AUTH_PORT": 7070,

    # Intra authentication service credentials
    "INTRA_SECRET": "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",
    "INTRA_UID": "u-s4t2ud-5c46e24dcfb7f0d8a56c2f9fb6b7700409c61f6626445e1a365f4fb8ab8824fe",
    "INTRA_REDIRECT_URI": "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-5c46e24dcfb7f0d8a56c2f9fb6b7700409c61f6626445e1a365f4fb8ab8824fe&redirect_uri=https%3A%2F%2Fwww.transc-net.com%2F&response_type=code",

    # Profile service credentials
    "PROF_SECRET_KEY": "django-insecure-lux6tbp4glpna22%w_q!x5i0v5on5*3fai=#3b_cz3cwjf$v)x",
    "PROF_DEBUG": True,
    "PROF_PORT": 8080,

    # auth_db credentials
    "POSTGRES_PASSWORD": "postgres",
    "AUTH_DB_USER": "postgres",
    "AUTH_DB_PASSWORD": "postgres",
    "AUTH_DB_NAME": "auth_db",
    "AUTH_DB_HOST": "auth_db",
    "AUTH_DB_PORT": 5432,

    # prof_db credentials
    "PGPORT": "4321",
    "PROF_DB_USER": "postgres",
    "PROF_DB_PASSWORD": "postgres",
    "PROF_DB_NAME": "prof_db",
    "PROF_DB_HOST": "prof_db",
    "PROF_DB_PORT": 4321,

    # Nginx credentials
    "SSL_CERT_PATH": "/etc/ssl/certs",
    "SSL_KEY_PATH": "/etc/ssl/private",

    # SMTP credentials
    "EMAIL_HOST": "smtp.gmail.com",
    "EMAIL_USE_TLS": True,
    "EMAIL_PORT": 587,
    "EMAIL_HOST_USER": "oufer.kamal@gmail.com",
    "EMAIL_HOST_PASSWORD": "nlis ejsn igew hdtx",

    # Grafana credentials
    "GRAFANA_USER": "admin",
    "GRAFANA_PASSWORD": "kamal123",

    # Prometheus credentials
    "PROMETHEUS_USER": "admin",
    "PROMETHEUS_PASSWORD": "kamal123",
    "PROMETHEUS_PORT": 9090,

    # Kibana credentials
    "ELASTICSEARCH_USERNAME": "elastic",
    "ELASTICSEARCH_PASSWORD": "your_elastic_password",
    "ELASTICSEARCH_HOST": "http://elasticsearch:9200",
    # "ELASTICSEARCH_PORT": 9200,
    # "ELASTICSEARCH_REQUEST_TIMEOUT": 30000
}

# Update only the secrets that don't exist or have changed
secrets_to_update = {k: v for k, v in new_secrets.items() if k not in existing_data or existing_data[k] != v}

if secrets_to_update:
    client.secrets.kv.v2.create_or_update_secret(
        path='my-app/secrets',
        secret=secrets_to_update,
    )
    print('New or updated secrets written successfully.')
else:
    print('No new secrets to add or update.')

# Reading the secrets back
read_response = client.secrets.kv.v2.read_secret_version(path='my-app/secrets')

# Print all secrets
for key, value in read_response['data']['data'].items():
    print(f'{key}: {value}')
