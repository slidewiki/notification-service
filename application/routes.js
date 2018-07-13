/*
These are routes as defined in https://docs.google.com/document/d/1337m6i7Y0GPULKLsKpyHR4NRzRwhoxJnAZNnDFCigkc/edit#
Each route implementes a basic parameter/payload validation and a swagger API documentation description
*/
'use strict';

const Joi = require('joi'),
  handlers = require('./controllers/handler');

module.exports = function(server) {
  //Get slide with id id from database and return it (when not available, return NOT FOUND). Validate id
  server.route({
    method: 'GET',
    path: '/template/{id}',
    handler: handlers.getTemplate,
    config: {
      validate: {
        /*params: {
          id: Joi.string().alphanum().lowercase()
        },*/
      },
      tags: ['api'],
      description: 'Get a template'
    }
  });

  //Create new template (by payload) and return it (...). Validate payload
  server.route({
    method: 'POST',
    path: '/template/new',
    handler: handlers.newTemplate,
    config: {
      validate: {
        payload: Joi.object().keys({
          title: Joi.string(),
          body: Joi.string(),
          user_id: Joi.string().alphanum().lowercase()
        }).requiredKeys('title', 'body', 'user_id')
      },
      tags: ['api'],
      description: 'Create a new template'
    }
  });

  //Update template with id id (by payload) and return it (...). Validate payload
  server.route({
    method: 'PUT',
    path: '/template/{id}',
    handler: handlers.replaceTemplate,
    config: {
      validate: {
        params: {
          id: Joi.string().alphanum().lowercase()
        },
        payload: Joi.object().keys({
          title: Joi.string(),
          body: Joi.string(),
          user_id: Joi.string().alphanum().lowercase()
        }).requiredKeys('title', 'body', 'user_id')
      },
      tags: ['api'],
      description: 'Replace a template'
    }
  });
};
