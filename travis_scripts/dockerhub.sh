#!/bin/bash

docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
docker build -t slidewiki/microservicetemplate ./
docker push slidewiki/microservicetemplate
