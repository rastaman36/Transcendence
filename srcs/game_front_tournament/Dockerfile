FROM node:latest

WORKDIR /files/

COPY --chmod=755 tools/script.sh /bin/

ENTRYPOINT [ "bash", "/bin/script.sh" ]
