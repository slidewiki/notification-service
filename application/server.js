/*
This is a demo application implementing some interfaces as described in https://docs.google.com/document/d/1337m6i7Y0GPULKLsKpyHR4NRzRwhoxJnAZNnDFCigkc/edit#
This application demonstrates a serivce which just returns static data. The requests have no sideeffects and there is no database involved.
 */

'use strict';

//This is our webserver framework (instead of express)
const hapi = require('hapi');
const myRoutes = require('./routes.js');

//Initiate the webserver
const server = new hapi.Server();
server.connection({
  host: 'localhost',
  port: 3000
});

//Export the webserver to be able to use server.log()
module.exports = server;

//Plugin for sweet server console output
let plugins = {
  register: require('good'),
  options: {
    reporters: [{
      reporter: require('good-console'),
      events: {
        response: '*',
        log: '*'
      }
    }]
  }
};

//Register plugins and start webserver
server.register(plugins, (err) => {
  if (err) {
    console.error(err);
    global.process.exit();
  } else {
    server.start(() => {
      server.log('info', 'Server started at ' + server.info.uri);
      //Register routes
      myRoutes(server);
    });
  }
});
