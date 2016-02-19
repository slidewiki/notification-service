#!/bin/bash
#starting docker container with mongodb
#for testing

#docker pull slidewiki/plainmongodb:latest

#docker stop SlideWikiServiceTemplateMongoDB

#docker rm SlideWikiServiceTemplateMongoDB

cd ../mongodb
docker build -t localmongodbimage ./

#docker run --name SlideWikiServiceTemplateMongoDB -p 27018:27018 -d slidewiki/plainmongodb:latest
docker run --name SlideWikiServiceTemplateMongoDB -p 27017:27017 -d localmongodbimage
