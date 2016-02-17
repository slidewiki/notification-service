#!/bin/bash
#starting docker container with mongodb
#for testing

docker pull slidewiki/plainmongodb:latest

docker stop SlideWikiServiceTemplateMongoDB

docker rm SlideWikiServiceTemplateMongoDB

docker run --name SlideWikiServiceTemplateMongoDB -p 27018:27018 -d slidewiki/plainmongodb:latest
