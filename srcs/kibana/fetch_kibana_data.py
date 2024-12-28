import hvac
import yaml
import os
import sys


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

# Fetch the Elasticsearch credentials
    try:
        secrets = client.secrets.kv.v2.read_secret_version(path='my-app/secrets', raise_on_deleted_version=False)
        elasticsearch_username = secrets['data']['data']['ELASTICSEARCH_USERNAME']
        elasticsearch_password = secrets['data']['data']['ELASTICSEARCH_PASSWORD']
        elasticsearch_hosts = secrets['data']['data']['ELASTICSEARCH_HOST']
        # Set environment variables for Elasticsearch credentials
        os.environ['ELASTICSEARCH_USERNAME'] = elasticsearch_username
        os.environ['ELASTICSEARCH_PASSWORD'] = elasticsearch_password 
        os.environ['ELASTICSEARCH_HOST'] = elasticsearch_hosts

        # Prepare the new kibana.yml content
        kibana_config = {
            'server.name': 'kibana',
            'server.host': '0',
            'elasticsearch.hosts': [os.environ['ELASTICSEARCH_HOST']],
            'xpack.monitoring.ui.container.elasticsearch.enabled': True,
            'elasticsearch.username': os.environ['ELASTICSEARCH_USERNAME'],
            'elasticsearch.password': os.environ['ELASTICSEARCH_PASSWORD'],
            'elasticsearch.requestTimeout': 30000  # Timeout in milliseconds (30 seconds)
        }

        # Write the new configuration to kibana.yml
        with open('/etc/kibana/kibana.yml', 'w') as yaml_file:
            yaml.dump(kibana_config, yaml_file)

        # Log the contents of the generated kibana.yml
        with open('/etc/kibana/kibana.yml', 'r') as yaml_file:
            print('kibana.yml contents:')
            print(yaml_file.read())

        print(f'Fetched Elasticsearch Username: {elasticsearch_username}')
        print(f'Fetched Elasticsearch Password: {elasticsearch_password}')
        print(f'Fetched Elasticsearch Hosts: {elasticsearch_hosts}')
    except hvac.exceptions.InvalidRequest as e:
        print(f'Error fetching secrets: {e}')
if __name__ == "__main__":
    main()