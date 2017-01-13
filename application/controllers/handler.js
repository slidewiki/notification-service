/*
Handles the requests by executing stuff and replying to the client. Uses promises to get stuff done.
*/

'use strict';

const boom = require('boom'), //Boom gives us some predefined http codes and proper responses
  notificationsDB = require('../database/notificationsDatabase'), //Database functions specific for notifications
  co = require('../common');

const Microservices = require('../configs/microservices');
let http = require('http');
module.exports = {
  //Get notification from database or return NOT FOUND
  getNotification: function(request, reply) {
    return notificationsDB.get(encodeURIComponent(request.params.id)).then((notification) => {
      if (co.isEmpty(notification))
        reply(boom.notFound());
      else {
        return insertAuthor(notification).then((notification) => {
          reply(co.rewriteID(notification));
        }).catch((error) => {
          request.log('error', error);
          reply(boom.badImplementation());
        });
      }
    }).catch((error) => {

      request.log('error', error);
      reply(boom.badImplementation());
    });
  },

  //Create notification with new id and payload or return INTERNAL_SERVER_ERROR
  newNotification: function(request, reply) {
    return notificationsDB.insert(request.payload).then((inserted) => {
      //console.log('inserted: ', inserted);
      if (co.isEmpty(inserted.ops) || co.isEmpty(inserted.ops[0]))
        throw inserted;
      else {
        return insertAuthor(inserted.ops[0]).then((notification) => {
          reply(co.rewriteID(notification));
        }).catch((error) => {
          request.log('error', error);
          reply(boom.badImplementation());
        });
      }
    }).catch((error) => {
      request.log('error', error);
      reply(boom.badImplementation());
    });
  },

  //Update notification with id id and payload or return INTERNAL_SERVER_ERROR
  updateNotification: function(request, reply) {
    return notificationsDB.replace(encodeURIComponent(request.params.id), request.payload).then((replaced) => {
      //console.log('updated: ', replaced);
      if (co.isEmpty(replaced.value))
        throw replaced;
      else
        reply(replaced.value);
    }).catch((error) => {
      request.log('error', error);
      reply(boom.badImplementation());
    });
  },

  //Delete notification with id id
  deleteNotification: function(request, reply) {
    return notificationsDB.delete(encodeURIComponent(request.payload.id)).then(() =>
      reply({'msg': 'notification is successfully deleted...'})
    ).catch((error) => {
      request.log('error', error);
      reply(boom.badImplementation());
    });
  },

  //Delete notifications with subscribed_user_id
  deleteNotifications: function(request, reply) {
    return notificationsDB.deleteAllWithSubscribedUserID(encodeURIComponent(request.payload.subscribed_user_id)).then(() =>
      reply({'msg': 'notifications were successfully deleted...'})
    ).catch((error) => {
      request.log('error', error);
      reply(boom.badImplementation());
    });
  },

  //Get All notifications from database for the id in the request
  getNotifications: function(request, reply) {
    return notificationsDB.getAllWithSubscribedUserID(encodeURIComponent(request.params.id))
      .then((notifications) => {
        let arrayOfAuthorPromisses = [];
        notifications.forEach((notification) => {
          co.rewriteID(notification);
          let promise = insertAuthor(notification);
          arrayOfAuthorPromisses.push(promise);
        });
        Promise.all(arrayOfAuthorPromisses).then(() => {
          let jsonReply = JSON.stringify(notifications);
          reply(jsonReply);

        }).catch((error) => {
          request.log('error', error);
          reply(boom.badImplementation());
        });
      });
  },

  //Get All notifications from database
  getAllNotifications: function(request, reply) {
    return notificationsDB.getAllFromCollection()
      .then((notifications) => {
        let arrayOfAuthorPromisses = [];
        notifications.forEach((notification) => {
          co.rewriteID(notification);
          let promise = insertAuthor(notification);
          arrayOfAuthorPromisses.push(promise);
        });

        Promise.all(arrayOfAuthorPromisses).then(() => {
          let jsonReply = JSON.stringify(notifications);
          reply(jsonReply);

        }).catch((error) => {
          request.log('error', error);
          reply(boom.badImplementation());
        });

      }).catch((error) => {
        request.log('error', error);
        reply(boom.badImplementation());
      });
  }
};

//insert author data using user microservice
function insertAuthor(notification) {
  let myPromise = new Promise((resolve, reject) => {

    let options = {
      host: Microservices.user.uri,
      port: 80,
      path: '/user/' + notification.user_id
    };

    let req = http.get(options, (res) => {
      if (res.statusCode === '404') {//user not found
        notification.author = {
          id: notification.user_id,
          username: 'unknown',
          avatar: ''
        };
        resolve(notification);
      }
      // console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      let body = '';
      res.on('data', (chunk) => {
        // console.log('Response: ', chunk);
        body += chunk;
      });
      res.on('end', () => {
        let parsed = JSON.parse(body);
        notification.author = {
          id: notification.user_id,
          username: parsed.username,
          avatar: parsed.picture
        };
        resolve(notification);
      });
    });
    req.on('error', (e) => {
      console.log('problem with request: ' + e.message);
      reject(e);
    });
  });

  return myPromise;
}
