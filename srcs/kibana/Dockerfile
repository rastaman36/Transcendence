FROM debian:bullseye-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    wget \
    gnupg2 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install hvac and PyYAML
RUN pip3 install hvac PyYAML

# Install nginx, openssl, curl, gnupg, lsb-release, python3, python3-pip, and vault
RUN apt-get update && \
    apt-get install -y curl gnupg lsb-release python3 python3-pip && \
    curl -fsSL https://apt.releases.hashicorp.com/gpg | gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/hashicorp.list && \
    apt-get update && \
    apt-get install -y vault

# Copy fetch script
COPY fetch_kibana_data.py /bin/fetch_kibana_data.py
RUN chmod +x /bin/fetch_kibana_data.py

# Copy the startup script
COPY start_kibana.sh /bin/start_kibana.sh
RUN chmod +x /bin/start_kibana.sh

# Add Elastic repository
RUN wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | apt-key add - \
    && echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" > /etc/apt/sources.list.d/elastic-7.x.list

# Install Kibana
RUN apt-get update && apt-get install -y kibana=7.14.0 \
    && rm -rf /var/lib/apt/lists/*

# Copy config
COPY kibana.yml /etc/kibana/kibana.yml

# Set permissions
RUN chown kibana:kibana /etc/kibana/kibana.yml

# Switch to kibana user
USER kibana

ENTRYPOINT ["/bin/bash", "-c", "/bin/start_kibana.sh"]

