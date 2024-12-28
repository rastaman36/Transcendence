FROM python:3.13-rc-bookworm

WORKDIR /files/

RUN apt-get update && apt-get install -y postgresql-client curl gnupg lsb-release
RUN curl -fsSL https://apt.releases.hashicorp.com/gpg | gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
RUN echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/hashicorp.list
RUN apt-get update && apt-get install -y vault

RUN pip3 install --no-warn-script-location hvac


COPY  tools/script.sh /bin/
COPY  tools/init.sh /bin/
COPY  tools/req.txt /tmp/
COPY  tools/fetch_secrets.py /bin/

RUN  chmod 755  /bin/script.sh
RUN  chmod 755  /bin/init.sh
RUN  chmod 644  /tmp/req.txt
RUN  chmod 755  /bin/fetch_secrets.py

RUN pip install --no-warn-script-location -r /tmp/req.txt

# Ensure profile.d scripts are sourced
RUN echo ". /etc/profile" >> /root/.bashrc

ENTRYPOINT ["/bin/bash", "-c", "/bin/init.sh"]
