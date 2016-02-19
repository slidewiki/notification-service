#!/bin/bash

docker stop SlideWikiServiceTemplateMongoDB
docker rm SlideWikiServiceTemplateMongoDB
docker rmi localmongodbimage
