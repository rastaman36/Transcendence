FROM docker.elastic.co/logstash/logstash:7.14.0

COPY logstash.yml /usr/share/logstash/config/logstash.yml
COPY pipeline/ /usr/share/logstash/pipeline/

USER root
RUN chown -R logstash:logstash /usr/share/logstash/config/logstash.yml /usr/share/logstash/pipeline/

USER logstash
