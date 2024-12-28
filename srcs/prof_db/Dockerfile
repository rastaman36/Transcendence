FROM postgres:16.6

# Install Vault CLI and Python
RUN apt-get update && apt-get install -y curl gnupg lsb-release python3 python3-venv python3-pip
RUN curl -fsSL https://apt.releases.hashicorp.com/gpg | gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
RUN echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/hashicorp.list
RUN apt-get update && apt-get install -y vault

# Create and activate a virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install hvac in the virtual environment
RUN pip3 install hvac

# Create a directory for the secrets
RUN mkdir -p /run/secrets && chmod 755 /run/secrets

COPY ./fetch_secrets.py /bin/
RUN chmod +x /bin/fetch_secrets.py

COPY ./script.sh /bin/
RUN chmod +x /bin/script.sh

# Copy PostgreSQL configuration
COPY ./postgresql.conf /etc/postgresql/postgresql.conf

ENTRYPOINT ["/bin/script.sh"]

# Set the default command
CMD ["postgres"]
