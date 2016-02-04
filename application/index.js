'use strict';

const Hapi = require('hapi');
const Good = require('good');

const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 3000
});

server.route({
  method: 'GET',
  path: '/deck/{id}',
  handler: function(request, reply) {
    reply('Deck ' + encodeURIComponent(request.params.id) + ' was request.');
    /*return a JSON object like {
      id: 57,
      title:'Sample Deck',
      description: 'it describes the content of deck',
      created_at: 'timestamp',
      numberOfSlides: 10
    }
    */
  }
});

server.route({
  method: ['PUT', 'POST'],
  path: '/deck/{id}',
  handler: function(request, reply) {
    reply('A new Deck with ID ' + encodeURIComponent(request.params.id) + ' has been written to the Database.');
  }
});

server.register({
  register: Good,
  options: {
    reporters: [{
      reporter: require('good-console'),
      events: {
        response: '*',
        log: '*'
      }
    }]
  }
}, (err) => {
  if (err) {
    throw err; // something bad happened loading the plugin
  }

  server.start(() => {
    server.log('info', 'Server running at: ' + server.info.uri);
  });
});
