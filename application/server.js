/*
This is a demo application implementing some interfaces as described in https://docs.google.com/document/d/1337m6i7Y0GPULKLsKpyHR4NRzRwhoxJnAZNnDFCigkc/edit#
This application demonstrates a serivce which returns previously inserted data from a fake database. The requests have no sideeffects and there is no database involved.
 */

'use strict';

//This is our webserver framework (instead of express)
const hapi = require('hapi'),
  co = require('./common');

//Initiate the webserver
const server = new hapi.Server();
let port2 = 3000;
if (!co.isEmpty(process.env.APPLICATION_PORT)) {
  port2 = process.env.APPLICATION_PORT;
  console.log('Using port ' + port2 + ' as application port.');
}
server.connection({
  //  host: 'localhost',
  port: port2
});

//Export the webserver to be able to use server.log()
module.exports = server;

//Plugin for sweet server console output
let plugins = [
  require('inert'),
  require('vision'), {
    register: require('good'),
    options: {
      reporters: [{
        reporter: require('good-console'),
        events: {
          request: '*',
          response: '*',
          log: '*'
        }
      }]
    }
  }, { //Plugin for swagger API documentation
    register: require('hapi-swagger'),
    options: {
      info: {
        title: 'Example API',
        description: 'Powered by node, hapi, joi, hapi-swaggered, hapi-swaggered-ui and swagger-ui',
        version: '0.1.0'
      }
    }
  }
];

//Register plugins and start webserver
server.register(plugins, (err) => {
  if (err) {
    console.error(err);
    global.process.exit();
  } else {
    server.start(() => {
      server.log('info', 'Server started at ' + server.info.uri);
      //Register routes
      require('./routes.js')(server);
    });
  }
});
