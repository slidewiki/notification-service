/*
These are routes as defined in https://docs.google.com/document/d/1337m6i7Y0GPULKLsKpyHR4NRzRwhoxJnAZNnDFCigkc/edit#
Each route implementes a basic parameter/payload validation and a swagger API documentation description
*/
'use strict';

const Joi = require('joi'),
  handlers = require('./controllers/handler');

module.exports = function(server) {
  //Get notifications with subscribed_user_id userid from database and return the entire list (when not available, return NOT FOUND). Validate id
  server.route({
    method: 'GET',
    path: '/notifications/{userid}',
    handler: handlers.getNotifications,
    config: {
      validate: {
        params: {
          userid: Joi.string().description('The id of the user')
        },
        query: {
          metaonly: Joi.string().description('Set to true to return only metadata without the list of notifications')
        }
      },
      tags: ['api'],
      description: 'Get a list of notifications'
    }
  });

  //Mark notification as read or unread
  server.route({
    method: 'PUT',
    path: '/notification/mark/{id}',
    handler: handlers.markNotification,
    config: {
      validate: {
        params: {
          id: Joi.string().description('The id of the notification')
        },
        payload: Joi.object().keys({
          read: Joi.boolean().description('Set to true to mark the notification as read')
        })

      },
      tags: ['api'],
      description: 'Mark notification as read'
    }
  });

  //Mark notification as read or unread
  server.route({
    method: 'PUT',
    path: '/notifications/markall/{userid}',
    handler: handlers.markAllNotifications,
    config: {
      validate: {
        params: {
          userid: Joi.string().description('The id of the user')
        },
        payload: Joi.object().keys({
          read: Joi.boolean().description('Set to true to mark notifications as read')
        })

      },
      tags: ['api'],
      description: 'Mark all notifications as read'
    }
  });

  //Get notification with id id from database and return it (when not available, return NOT FOUND). Validate id
  // server.route({
  //   method: 'GET',
  //   path: '/notification/{id}',
  //   handler: handlers.getNotification,
  //   config: {
  //     validate: {
  //       params: {
  //         id: Joi.string()
  //       },
  //     },
  //     tags: ['api'],
  //     description: 'Get the notification'
  //   }
  // });

  //Create new notification (by payload) and return it (...). Validate payload
  server.route({
    method: 'POST',
    path: '/notification/new',
    handler: handlers.newNotification,
    config: {
      validate: {
        payload: Joi.object().keys({
          activity_id: Joi.string(),
          activity_type: Joi.string(),
          user_id: Joi.string(),
          content_id: Joi.string(),
          content_kind: Joi.string().valid('deck', 'slide', 'group'),
          content_name: Joi.string(),
          content_owner_id: Joi.string(),
          subscribed_user_id: Joi.string(),
          translation_info: Joi.object().keys({
            content_id: Joi.string(),
            language: Joi.string()
          }),
          share_info: Joi.object().keys({
            // postURI: Joi.string(),
            platform: Joi.string()
          }),
          comment_info: Joi.object().keys({
            comment_id: Joi.string(),
            text: Joi.string()
          }),
          use_info: Joi.object().keys({
            target_id: Joi.string(),
            target_name: Joi.string().allow('')
          }),
          fork_info: Joi.object().keys({
            content_id: Joi.string()
          }),
          delete_info: Joi.object().keys({
            content_id: Joi.string(),
            content_kind: Joi.string().valid('deck', 'slide', 'group'),
            content_name: Joi.string()
          }),
          react_type: Joi.string(),
          rate_type: Joi.string()
        }).requiredKeys('content_id', 'user_id', 'activity_id', 'activity_type', 'subscribed_user_id'),
      },
      tags: ['api'],
      description: 'Create a new notification'
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
          id: Joi.string()
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
          subscribed_user_id: Joi.string()
        },
      },
      tags: ['api'],
      description: 'Delete all notifications for the subscribed user'
    }
  });
};
