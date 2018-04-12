#!/bin/bash

echo $DOCKER_PASSWORD | docker login -u="$DOCKER_USERNAME" --password-stdin
docker build --build-arg BUILD_ENV=travis -t slidewiki/microservicetemplate:latest-dev ./
docker push slidewiki/microservicetemplate:latest-dev
