#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status.

# Run the Python script to fetch secrets
python3 /bin/fetch_secrets.py

# Source the environment variables
source /tmp/ssl_paths.env


# Ensure SSL directories exist
mkdir -p "$SSL_CERT_PATH" "$SSL_KEY_PATH"

# Generate SSL certificate
openssl req -x509 -newkey rsa:2048 -keyout "$SSL_KEY_PATH/transc.key" \
    -out "$SSL_CERT_PATH/transc.crt" -sha256 -days 365 -nodes -subj \
    "/C=MA/ST=BG/L=BG/O=Transc/OU=Net/CN=www.Transc-Net.com" > /dev/null 2>&1

#FROM HERE MAKE THE MODE SECURITY WORK

# # Change to /opt directory
# cd /opt || { echo "Failed to change directory to /opt"; exit 1; }

# # Clone ModSecurity
# git clone --depth 1 https://github.com/SpiderLabs/ModSecurity.git

# # Build ModSecurity
# cd ModSecurity || { echo "Failed to change directory to ModSecurity"; exit 1; }

# # Function to initialize and update submodules with retry
# init_and_update_submodules() {
#     local max_attempts=5
#     local attempt=1
#     while [ $attempt -le $max_attempts ]; do
#         echo "Attempt $attempt to initialize and update submodules"
#         if git submodule update --init --recursive --depth 1; then
#             echo "Successfully initialized and updated submodules"
#             return 0
#         else
#             echo "Failed to initialize and update submodules. Retrying in 10 seconds..."
#             sleep 10
#             ((attempt++))
#         fi
#     done
#     echo "Failed to initialize and update submodules after $max_attempts attempts"
#     return 1
# }

# # Initialize and update submodules with retry
# if ! init_and_update_submodules; then
#     echo "Failed to initialize and update submodules. Trying to proceed anyway..."
# fi

# ./build.sh || { echo "Failed to run build.sh"; exit 1; }
# ./configure || { echo "Failed to configure ModSecurity"; exit 1; }
# make
# make install || { echo "Failed to install ModSecurity"; exit 1; }

# cd /opt

# # Clone ModSecurity-nginx
# git clone --depth 1  https://github.com/SpiderLabs/ModSecurity-nginx.git

# # Download and compile Nginx with ModSecurity
# wget http://nginx.org/download/nginx-1.18.0.tar.gz
# tar -xzvf nginx-1.18.0.tar.gz
# cd nginx-1.18.0
# ./configure --with-compat --add-dynamic-module=../ModSecurity-nginx
# make modules || { echo "Failed to compile Nginx with ModSecurity"; exit 1; }
# mkdir -p /etc/nginx/modules
# cp ./objs/ngx_http_modsecurity_module.so /etc/nginx/modules || { echo "Failed to copy ngx_http_modsecurity_module.so"; exit 1; }

# # Download OWASP Core Rule Set with retry mechanism
# rm -rf /usr/share/modsecurity-crs
# for i in {1..5}; do
#     if git clone --depth 1 https://github.com/coreruleset/coreruleset /usr/local/modsecurity-crs; then
#         echo "Successfully cloned coreruleset"
#         break
#     else
#         echo "Attempt $i: Failed to clone coreruleset. Retrying in 5 seconds..."
#         sleep 5
#     fi
# done

# if [ ! -d "/usr/local/modsecurity-crs" ]; then
#     echo "Failed to clone coreruleset after 5 attempts. Exiting."
#     exit 1
# fi

# # Check if files exist before moving
# if [ -f "/usr/local/modsecurity-crs/crs-setup.conf.example" ]; then
#     mv /usr/local/modsecurity-crs/crs-setup.conf.example /usr/local/modsecurity-crs/crs-setup.conf
# else
#     echo "crs-setup.conf.example not found. Skipping."
# fi

# if [ -f "/usr/local/modsecurity-crs/rules/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf.example" ]; then
#     mv /usr/local/modsecurity-crs/rules/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf.example /usr/local/modsecurity-crs/rules/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf
# else
#     echo "REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf.example not found. Skipping."
# fi

# # Set up ModSecurity configuration for Nginx
# mkdir -p /etc/nginx/modsec
# cp /opt/ModSecurity/unicode.mapping /etc/nginx/modsec/
# cp /opt/ModSecurity/modsecurity.conf-recommended /etc/nginx/modsec/modsecurity.conf || { echo "Failed to copy modsecurity.conf-recommended"; exit 1; }
# sed -i 's/SecRuleEngine DetectionOnly/SecRuleEngine On/' /etc/nginx/modsec/modsecurity.conf || { echo "Failed to update SecRuleEngine in modsecurity.conf"; exit 1; }

# # Create main.conf only if CRS setup was successful
# if [ -f "/usr/local/modsecurity-crs/crs-setup.conf" ]; then
#     echo "Include /etc/nginx/modsec/modsecurity.conf
# Include /usr/local/modsecurity-crs/crs-setup.conf
# Include /usr/local/modsecurity-crs/rules/*.conf" > /etc/nginx/modsec/main.conf
# else
#     echo "CRS setup failed. Creating minimal main.conf"
#     echo "Include /etc/nginx/modsec/modsecurity.conf" > /etc/nginx/modsec/main.conf
# fi

#HERE IS DONE 

# Before starting Nginx, test the configuration
nginx -t

nginx -g "daemon off;"