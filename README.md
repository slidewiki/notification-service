# Microservice Template #
[![Build Status](https://snap-ci.com/slidewiki/Microservice-Template/branch/master/build_image)](https://snap-ci.com/slidewiki/Microservice-Template/branch/master)
[![License](https://img.shields.io/badge/License-GPLv3-green.svg)](https://github.com/slidewiki/Microservice-Template/blob/master/LICENSE)
[![Language](https://img.shields.io/badge/Language-Javascript%20ECMA2015-lightgrey.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Framework](https://img.shields.io/badge/Framework-NodeJS%205.6.0-blue.svg)](https://nodejs.org/)
[![Webserver](https://img.shields.io/badge/Webserver-Hapi%2013.0.0-blue.svg)](http://hapijs.com/)
[![LinesOfCode](https://img.shields.io/badge/LOC-278-lightgrey.svg)](https://github.com/slidewiki/Microservice-Template/blob/master/application/package.json)
[![Coverage Status](https://coveralls.io/repos/github/slidewiki/Microservice-Template/badge.svg?branch=master)](https://coveralls.io/github/slidewiki/Microservice-Template?branch=master)

This repository contains the template code for a NodeJS based Microservice of the Slidewiki 2.0 project. Please do **NOT** clone this repository and develop your application in it. Instead fork it (into the Slidewiki Organization) and develop your application there. The CI maintainer ([Roy Meissner](https://github.com/rmeissn)) will setup continuous integration and delivery for your fork. Just notify him.

Remember to exchange badge urls when forking!

### Install NodeJS ###
---
Please visit the folder [**./Install NodeJS**](https://github.com/slidewiki/Microservice-Template/tree/master/Install%20NodeJS), located inside this repository.

### Where to start developing? ###
---
Have a look at the file [application/server.js](https://github.com/slidewiki/Microservice-Template/blob/master/application/server.js), that is the main routine of this service. Follow the **require(...)** statements to get trough the entire code in the right order.

When you want to have a look at **tests**, head over to the folder [application/tests/](https://github.com/slidewiki/Microservice-Template/tree/master/application/tests). We're using Mocha and Chai for our purposes.

Since we're developing our application with NodeJS, we're using [npm](https://docs.npmjs.com/) as a **task runner**. Have a look at the [/application/package.json](https://github.com/slidewiki/Microservice-Template/blob/master/application/package.json) script section to obtain an overview of available commands. Some are:

```
# Run syntax check and lint your code
npm run lint

# Run unit tests
npm run unit:test

# Start the application
npm start
...
```

You want to **checkout this cool service**? Simply start the service and head over to: [http://localhost:3000/documentation](http://localhost:3000/documentation). We're using swagger to have this super cool API discrovery/documentation tool. BTW.: Did you already discoverd the super easy swagger integration inside [/application/routes.js](https://github.com/slidewiki/Microservice-Template/blob/master/application/routes.js)? Tags 'api' and 'description' were everything we needed to add.

### What's about Continuous Integration/Delivery? ###
---
Continuous Integration (and in the future Continuous Delivery) is currently setup by using the (for OSS projects) free to use web application [Snap-CI](https://snap-ci.com/). By clicking on first badge (see at the top), you will be redirected to Snap-CI. There you can have a look at all the different build stages.

We've also setup Code Coverage reports. This is done by [Coveralls](https://coveralls.io). Just click on the coverage badge and you'll be redirected to our corresponding Coveralls project.

In the future, we will exchange Snap-CI with our local instance of Bamboo at the Fraunhofer institute. There will be no changes for you, except that the UI looks a little different.

### Use Docker to run/test your application ###
---
You can use Docker to build, test and run your application locally. Simply edit the Dockerfile and run:

```
docker build -t MY_IMAGE_TAG ./
docker run -it --rm -p 8880:3000 MY_IMAGE_TAG
```
