/*
This is a demo application implementing some interfaces as described in https://docs.google.com/document/d/1337m6i7Y0GPULKLsKpyHR4NRzRwhoxJnAZNnDFCigkc/edit#
This application demonstrates a service which returns previously inserted data from a MongoDB database.
 */

'use strict';

//This is our webserver framework (instead of express)
const hapi = require('hapi'),
  co = require('./common');

//Initiate the webserver with standard or given port
const server = new hapi.Server({ connections: {routes: {validate: { options: {convert : false}}}}});

let port = (!co.isEmpty(process.env.APPLICATION_PORT)) ? process.env.APPLICATION_PORT : 3500;
server.connection({
  port: port
});
let host = (!co.isEmpty(process.env.VIRTUAL_HOST)) ? process.env.VIRTUAL_HOST : server.info.host;

//Export the webserver to be able to use server.log()
module.exports = server;

//Plugin for sweet server console output
let plugins = [
  require('inert'),
  require('vision'), {
    register: require('good'),
    options: {
      ops: {
        interval: 1000
      },
      reporters: {
        console: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{
            log: '*',
            response: '*',
            request: '*'
          }]
        }, {
          module: 'good-console'
        }, 'stdout']
      }
    }
  }, { //Plugin for swagger API documentation
    register: require('hapi-swagger'),
    options: {
      host: host,
      info: {
        title: 'Template service API',
        description: 'Powered by node, hapi, joi, hapi-swaggered, hapi-swaggered-ui and swagger-ui',
        version: '0.1.0'
      }
    }
  }
];

const createIndexes = require('./database/createIndexes');

//Register plugins and start webserver
server.register(plugins, (err) => {
  if (err) {
    console.error(err);
    global.process.exit();
  } else {
    // create any indexes before starting the server
    createIndexes().then(() => {
      server.start(() => {
        server.log('info', 'Server started at ' + server.info.uri);
        //Register routes
        require('./routes.js')(server);
      });
      return;
    }).catch((err) => {
      console.warn('error creating the indexes on the database collection:');
      console.warn(err.message);
    });
  }
});
