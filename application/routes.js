'use strict';

const Joi = require('joi');
const server = require('./server');
const handls = require('./controllers/handler');

//Get slide with id id from database and return it (when not available, return NOT FOUND). Validate id to an integer, greater then 0
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

//Create new slide (by payload) and return it (...). Validate payload
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

//Update slide with id id (by payload) and return it (...). Validate payload 
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
