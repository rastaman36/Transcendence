# Use the Debian base image
FROM debian:bullseye

# Install dependencies
RUN apt-get update && \
    apt-get install -y wget gpg lsb-release 
    # pip3 install hvac

# Add HashiCorp's GPG key and repository
RUN wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor > /usr/share/keyrings/hashicorp-archive-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/hashicorp.list

# Update package list and install Vault
RUN apt-get update && apt-get install -y vault
RUN apt install python3-pip -y
RUN pip3 install hvac


# Expose Vault's default port
EXPOSE 8200

COPY ./run/script.sh /

# Copy the Vault configuration into the container
COPY ./run/vault-config.hcl /etc/vault.d/vault.hcl
COPY ./run/add_data.py /root/

RUN chmod +x /script.sh
# RUN chmod +x /add_data.py
# RUN python3 /add_data.py

# Start Vault in server mode using the configuration file
CMD ["/script.sh"]
