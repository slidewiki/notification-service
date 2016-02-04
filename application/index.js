/*
This is the demo application with the interfaces as describet in https://docs.google.com/document/d/1337m6i7Y0GPULKLsKpyHR4NRzRwhoxJnAZNnDFCigkc/edit#
It demonstrates a serivce which just returns static data. The requests have no sideeffects and there is no database.
 */

'use strict';

//using hapi instead of express
const Hapi = require('hapi');
//module for sweet server console output
const Good = require('good');

const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 3000
});

const _NaN_ = parseInt("Slidewiki");

//TODO test all parameters (type)
//TODO create multiple modules
//TODO implement useful handlers

server.route({
    method: 'GET',
    path: '/deck/tree/{id}',
    handler: function (request, reply) {
        reply([
            {title: 'root', id: request.params.id, type:'deck', position:'1', children:
                [
                    {title: 'child 1', id: 11, type: 'slide', position: '1'},
                    {title: 'child 2', id: 12, type: 'slide', position: '2'},
                    {title: 'child 3', id: 13, type: 'deck', position: '3', children:[
                        {title: 'child 31', id: 131, type: 'slide' , position: '1'},
                        {title: 'child 32', id: 132, type: 'deck', position: '2', children:[
                            {title: 'child 321', id: 1321, type: 'slide' , position: '1'},
                            {title: 'child 322', id: 1322, type: 'slide', position: '2'}
                        ]}]}]},
            {title: 'child 33', id: 133, type: 'slide', position: '3'},
            {title: 'child 4', id: 14, type: 'slide', position: '4'}
        ]);
    }
});

server.route({
    method: 'GET',
    path: '/content/contributors/{type}/{id}',
    handler: function (request, reply) {
        reply([
                {username: 'ali1k', avatar:'ali.png', role: ['creator']},
                {username: 'dtarasowa', avatar:'darya.png', role: ['editor']},
                {username: 'soeren', avatar:'darya.png', role: ['editor']}
            ]
        );
    }
});

server.route({
  method: 'GET',
  path: '/deck/{id}',
  handler: function(request, reply) {
    reply({
        id: request.params.id,
        title:'Sample Deck',
        description: 'it describes the content of deck',
        created_at: 'timestamp',
        numberOfSlides: 10
    });
  }
});

server.route({
    method: 'GET',
    path: '/slide/{id}',
    handler: function(request, reply) {
        reply({
            id: request.params.id,
            title:'Sample Slide',
            body: 'slide content',
            created_at: 'timestamp'
        });
    }
});

server.route({
    method: 'GET',
    path: '/content/tags/{type}/{id}',
    handler: function (request, reply) {
        reply([
            {name:'Slide',id:12, url: 'http://wikipedia.com/slide'},
            {name:'E-Learning',id:23, url: 'http://wikipedia.com/elearning'}
            ]
        );
    }
});

//At the moment this seems not handable by hapi.
// /deck/slides/:id/offset/:offset/limit/:limit/fields/:onlyIDs seems too long
server.route({
    method: 'GET',
    path: '/deck/slides/{slideparams*7}',
    handler: function (request, reply) {
        const slideparamsParts = request.params.slideparams.split('/');
        var id = parseInt(slideparamsParts[0]);
        var offset = parseInt(slideparamsParts[2]);
        var limit = parseInt(slideparamsParts[4]);
        var onlyIDs = slideparamsParts[6];

        var paramsAreValid = id != _NaN_ && offset != _NaN_ && limit != _NaN_ && onlyIDs;

        if (!paramsAreValid)
            reply("Wrong parameters: " + id + ", " + offset + ", " + limit + ", " + onlyIds);
        else
        {
            var result = {
                id: 56,
                slides:[
                    {id: 34, title: 'sample slide 1', body: ' content of slide', created_at: 'timestamp'},
                    {id: 35, title: 'sample slide 2', body: ' content of slide', created_at: 'timestamp'}
                ],
                offset:1,
                limit:10
            };

            if (onlyIDs.toString() === "true")
                result = {
                    id: 56,
                    slides:[
                        {id: 34},
                        {id: 35}
                    ],
                    offset:1,
                    limit:10
                };
        }
    }
});

server.route({
    method: 'GET',
    path: '/scripts/slide/setAllTitles',
    handler: function (request, reply) {
        reply(['new slide',"Introduction","Sundial","Untitled"]);
    }
});

server.route({
    method: 'GET',
    path: '/user/{username}',
    handler: function (request, reply) {
        reply({
            username: request.params.username,
            registered: '01.01.2015',
            avatar: 'dummy'
            }
        );
    }
});

server.route({
    method: 'GET',
    path: '/user/login/{username}/{pass}',
    handler: function (request, reply) {
        reply({
            id: 2,
            username: request.params.username,
            registered: '01.01.2015',
            avatar: 'dummy'
            }
        );
    }
});

server.route({
    method: 'POST',
    path: '/slide/new',
    handler: function (request, reply) {
        reply({
            id: 214124214,
            title: 'slide title',
            body: '',
            created_at: (new Date()).toString(),
            root_deck_changed: true,
                root_deck_id: 57
            }
        );
    }
});

server.route({
    method: 'PUT',
    path: '/slide/update',
    handler: function (request, reply) {
        reply({
                id: 214124215,
                title: 'slide title',
                body: '',
                created_at: (new Date()).toUTCString(),
                root_deck_changed: true,
                root_deck_id: 57
            }
        );
    }
});

server.route({
    method: 'GET',
    path: '/translate/{translate*3}',
    handler: function (request, reply) {
        reply({
            id:56
            }
        );
    }
});

server.route({
    method: 'GET',
    path: '/moveItem/{params*4}',
    handler: function (request, reply) {
        reply({
                error: 'INTERNAL'
            }
        );
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
