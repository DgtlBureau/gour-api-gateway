# Launch a project:

1.  npm ci
2.  Start command in console cp .example.env .env
3.  Set variables to .env
4.  npm run start:dev

No database connection required

# git

Current branch - main\

# docker and kafka setup

1. Create the docker file docker-compose.yml

===========

    version: '3'

    services:
      zoo1:
        image: zookeeper
        restart: always
        hostname: zoo1
        ports:
          - 2181:2181
        environment:
          ZOO_MY_ID: 1
          ZOOKEEPER_SASL_ENABLED: 'false'
          ZOO_SERVERS: server.1=zoo1:2888:3888;2181

    kafka1:
      image: confluentinc/cp-kafka:5.2.1
      hostname: kafka1
      ports:
        - '9092:9092'
      environment:
        KAFKA_LISTENERS: SASL_PLAINTEXT://:9092
        KAFKA_ADVERTISED_LISTENERS: SASL_PLAINTEXT://localhost:9092
        KAFKA_ZOOKEEPER_CONNECT: zoo1:2181
        ZOOKEEPER_SASL_ENABLED: 'false'
        KAFKA_OPTS: '-Djava.security.auth.login.config=/etc/kafka/kafka_server_jaas.conf'
        KAFKA_INTER_BROKER_LISTENER_NAME: SASL_PLAINTEXT
        KAFKA_SASL_ENABLED_MECHANISMS: PLAIN
        KAFKA_SASL_MECHANISM_INTER_BROKER_PROTOCOL: PLAIN
        KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      volumes:
        - ./kafka/kafka1/data:/var/lib/kafka/data
        - ./kafka_server_jaas.conf:/etc/kafka/kafka_server_jaas.conf
      depends_on:
        - zoo1
      
==========

2. Create the kafka file kafka_server_jaas.conf

==========

    KafkaServer {
       org.apache.kafka.common.security.plain.PlainLoginModule required
       username="admin"
       password="admin-secret"
       user_admin="admin-secret"
       user_alice="alice-secret";
    };

    Client {};

==========

3. Start docker use command "docker compose up"

