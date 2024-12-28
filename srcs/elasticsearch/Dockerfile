FROM docker.elastic.co/elasticsearch/elasticsearch:7.14.0

# Set environment variables for Elasticsearch
ENV ELASTIC_PASSWORD=your_elastic_password

COPY elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml

USER root
RUN chown elasticsearch:elasticsearch config/elasticsearch.yml

USER elasticsearch
