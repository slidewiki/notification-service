#!/bin/bash

docker build -t slidewiki/microservicetemplate ./
docker rmi $(docker images | grep "<none>" | awk "{print \$3}")
docker push slidewiki/microservicetemplate
