'use strict';

const Joi = require('joi');
const server = require('./server');
const handls = require('./controllers/handler');

server.route({
  method: 'GET',
  path: '/slide/{id}',
  handler: handls.getSlide,
  config: {
    validate: {
      params: {
        id: Joi.number().integer().min(0)
      }
    }
  }
});

server.route({
  method: 'POST',
  path: '/slide/new',
  handler: handls.newSlide,
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
    }
  }
});

server.route({
  method: 'PUT',
  path: '/slide/{id}',
  handler: handls.updateSlide,
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
    }
  }
});
