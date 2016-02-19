/* These are routes as defined in https://docs.google.com/document/d/1337m6i7Y0GPULKLsKpyHR4NRzRwhoxJnAZNnDFCigkc/edit#
Each route implementes a basic parameter/payload validation and a swagger API documentation desription*/

'use strict';
const Joi = require('joi');
const handlers = require('./controllers/handler');

module.exports = function(server) {

  //Get slide with id id from database and return it (when not available, return NOT FOUND). Validate id to an integer, greater then 0
  server.route({
    method: 'GET',
    path: '/slide/{id}',
    handler: handlers.getSlide,
    config: {
      validate: {
        params: {
          id: Joi.number().integer().min(0)
        }
      },
      tags: ['api'],
      description: 'Get slide with id <id>'
    }
  });

  //Create new slide (by payload) and return it (...). Validate payload
  server.route({
    method: 'POST',
    path: '/slide/new',
    handler: handlers.newSlide,
    //TODO validate body
    config: {
      validate: {
        payload: Joi.object().keys({
          title: Joi.string(),
          parent_deck_id: Joi.number().integer().min(0),
          position: Joi.number().integer().min(0),
          user_id: Joi.number().integer().min(0),
          root_deck_id: Joi.number().integer().min(0),
          language: Joi.string()
        }).requiredKeys('title', 'language')
      },
      tags: ['api'],
      description: 'Create a new slide'
    }
  });

  //Update slide with id id (by payload) and return it (...). Validate payload
  server.route({
    method: 'PUT',
    path: '/slide/{id}',
    handler: handlers.updateSlide,
    config: {
      validate: {
        params: {
          id: Joi.number().integer().min(0)
        },
        payload: Joi.object().keys({
          id: Joi.number().integer().min(0),
          title: Joi.string(),
          body: Joi.string(),
          user_id: Joi.number().integer().min(0),
          root_deck_id: Joi.number().integer().min(0),
          parent_deck_id: Joi.number().integer().min(0),
          no_new_revision: Joi.boolean()
        }).requiredKeys('id', 'title', 'body')
      },
      tags: ['api'],
      description: 'Update a slide'
    }
  });
};
