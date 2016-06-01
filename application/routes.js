/*
These are routes as defined in https://docs.google.com/document/d/1337m6i7Y0GPULKLsKpyHR4NRzRwhoxJnAZNnDFCigkc/edit#
Each route implementes a basic parameter/payload validation and a swagger API documentation description
*/
'use strict';

const Joi = require('joi'),
  handlers = require('./controllers/handler');

module.exports = function(server) {
  //Get notifications with subscribed_user_id id from database and return the entire list (when not available, return NOT FOUND). Validate id
  server.route({
    method: 'GET',
    path: '/notifications/{id}',
    handler: handlers.getNotifications,
    config: {
      validate: {
        params: {
          id: Joi.string().alphanum().lowercase()
        },
      },
      tags: ['api'],
      description: 'Get a list of notifications (example id: 112233445566778899000001; id:000000000000000000000000 recreates mockup data)'
    }
  });

  //Get all notifications from database and return the entire list (when not available, return NOT FOUND).
  server.route({
    method: 'GET',
    path: '/notifications/all',
    handler: handlers.getAllNotifications,
    config: {
      tags: ['api'],
      description: 'Get a list of all notifications'
    }
  });

  //Get notification with id id from database and return it (when not available, return NOT FOUND). Validate id
  server.route({
    method: 'GET',
    path: '/notification/{id}',
    handler: handlers.getNotification,
    config: {
      validate: {
        params: {
          id: Joi.string().alphanum().lowercase()
        },
      },
      tags: ['api'],
      description: 'Get the notification'
    }
  });

  //Create new notification (by payload) and return it (...). Validate payload
  server.route({
    method: 'POST',
    path: '/notification/new',
    handler: handlers.newNotification,
    config: {
      validate: {
        payload: Joi.object().keys({
          activity_type: Joi.string(),
          user_id: Joi.string().alphanum().lowercase(),
          content_id: Joi.string().alphanum().lowercase(),
          content_kind: Joi.string().valid('deck', 'slide'),
          content_name: Joi.string(),
          subscribed_user_id: Joi.string().alphanum().lowercase(),
          translation_info: Joi.object().keys({
            content_id: Joi.string().alphanum().lowercase(),
            language: Joi.string()
          }),
          share_info: Joi.object().keys({
            postURI: Joi.string(),
            platform: Joi.string()
          }),
          comment_info: Joi.object().keys({
            comment_id: Joi.string().alphanum().lowercase(),
            text: Joi.string()
          }),
          use_info: Joi.object().keys({
            target_id: Joi.string().alphanum().lowercase(),
            target_name: Joi.string()
          }),
          react_type: Joi.string(),
          rate_type: Joi.string()
        }).requiredKeys('content_id', 'user_id', 'activity_type', 'subscribed_user_id'),
      },
      tags: ['api'],
      description: 'Create a new notification'
    }
  });

  //Update notification with id id (by payload) and return it (...). Validate payload
  server.route({
    method: 'PUT',
    path: '/notification/{id}',
    handler: handlers.updateNotification,
    config: {
      validate: {
        params: {
          id: Joi.string().alphanum().lowercase()
        },
        payload: Joi.object().keys({
          activity_type: Joi.string(),
          user_id: Joi.string().alphanum().lowercase(),
          content_id: Joi.string().alphanum().lowercase(),
          content_kind: Joi.string().valid('deck', 'slide'),
          content_name: Joi.string(),
          subscribed_user_id: Joi.string().alphanum().lowercase(),
          translation_info: Joi.object().keys({
            content_id: Joi.string().alphanum().lowercase(),
            language: Joi.string()
          }),
          share_info: Joi.object().keys({
            postURI: Joi.string(),
            platform: Joi.string()
          }),
          comment_info: Joi.object().keys({
            comment_id: Joi.string().alphanum().lowercase(),
            text: Joi.string()
          }),
          use_info: Joi.object().keys({
            target_id: Joi.string().alphanum().lowercase(),
            target_name: Joi.string()
          }),
          react_type: Joi.string(),
          rate_type: Joi.string()
        }).requiredKeys('content_id', 'user_id', 'activity_type', 'subscribed_user_id'),
      },
      tags: ['api'],
      description: 'Replace an notification'
    }
  });

  //Delete notification with id id (by payload). Validate payload
  server.route({
    method: 'DELETE',
    path: '/notification/delete',
    handler: handlers.deleteNotification,
    config: {
      validate: {
        payload: {
          id: Joi.string().alphanum().lowercase()
        },
      },
      tags: ['api'],
      description: 'Delete a notification'
    }
  });

  //Delete notifications with subscribed_user_id id (by payload). Validate payload
  server.route({
    method: 'DELETE',
    path: '/notifications/delete',
    handler: handlers.deleteNotifications,
    config: {
      validate: {
        payload: {
          content_id: Joi.string().alphanum().lowercase()
        },
      },
      tags: ['api'],
      description: 'Delete all notifications for the subscribed user (example id: 112233445566778899000001)'
    }
  });
};
