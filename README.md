# Microservice Template #
[![License](https://img.shields.io/badge/License-GPLv3-green.svg)](https://github.com/slidewiki/Microservice-Template/blob/master/LICENSE)
[![Language](https://img.shields.io/badge/Language-Javascript%20ECMA2015-lightgrey.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Framework](https://img.shields.io/badge/Framework-NodeJS%205.5.0-blue.svg)](https://nodejs.org/)
[![Webserver](https://img.shields.io/badge/Webserver-Hapi%2013.0.0-blue.svg)](http://hapijs.com/)
[![LinesOfCode](https://img.shields.io/badge/LOC-278-lightgrey.svg)](http://hapijs.com/)
[![Coverage](https://img.shields.io/badge/Coverage-XX%-green.svg)](https://github.com/slidewiki/Microservice-Template/blob/master/application/package.json)

This repository contains the template code for a NodeJS based Microservice of the Slidewiki 2.0 project. Please do **NOT** clone this repository and develop your application in it. Instead fork it (into the Slidewiki Organization) and develop your application there. Continuous Integration and Delivery will be setup automagically for your fork.

### Install NodeJS ###
---
Plese visit the folder [**./Install NodeJS**](https://github.com/slidewiki/Microservice-Template/tree/master/Install%20NodeJS), located inside this repository.

### Where to start developing? ###
---

### What's about Continuous Integration/Delivery? ###
---

```
code here
```

### Use Docker to run/test your application ###
---
You can use Docker to build, test and run your application locally. Simply edit the Dockerfile and run:

```
docker build -t MY_IMAGE_TAG ./
docker run -it --rm -p 8880:80 MY_IMAGE_TAG
```
