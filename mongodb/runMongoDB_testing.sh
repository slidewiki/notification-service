#!/bin/bash
#starting docker container with mongodb
#for testing

docker pull slidewiki/plainmongodb:latest

docker stop SlideWikiServiceTemplateMongoDB

docker rm SlideWikiServiceTemplateMongoDB

docker run --name SlideWikiServiceTemplateMongoDB -d slidewiki/plainmongodb:latest
