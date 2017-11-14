/*
Handles the requests by executing stuff and replying to the client. Uses promises to get stuff done.
*/
/* eslint promise/always-return: "off" */

'use strict';

const boom = require('boom'), //Boom gives us some predefined http codes and proper responses
  notificationsDB = require('../database/notificationsDatabase'), //Database functions specific for notifications
  oid = require('mongodb').ObjectID,
  co = require('../common');

const Microservices = require('../configs/microservices');
// let http = require('http');
let rp = require('request-promise-native');
let self = module.exports = {
  //Get notification from database or return NOT FOUND
  getNotification: function(request, reply) {
    return notificationsDB.get(encodeURIComponent(request.params.id)).then((notification) => {
      if (co.isEmpty(notification))
        reply(boom.notFound());
      else {
        return insertAuthor(notification).then((notification) => {
          reply(co.rewriteID(notification));
        }).catch((error) => {
          tryRequestLog(request, 'error', error);
          reply(boom.badImplementation());
        });
      }
    }).catch((error) => {

      tryRequestLog(request, 'error', error);
      reply(boom.badImplementation());
    });
  },

  //Create notification with new id and payload or return INTERNAL_SERVER_ERROR
  newNotification: function(request, reply) {
    if (!request.payload.new) {
      request.payload.new = true;
    }
    return notificationsDB.insert(request.payload).then((inserted) => {
      //console.log('inserted: ', inserted);
      if (co.isEmpty(inserted.ops) || co.isEmpty(inserted.ops[0]))
        throw inserted;
      else {
        return insertAuthor(inserted.ops[0]).then((notification) => {
          reply(co.rewriteID(notification));
        }).catch((error) => {
          tryRequestLog(request, 'error', error);
          reply(boom.badImplementation());
        });
      }
    }).catch((error) => {
      tryRequestLog(request, 'error', error);
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
      tryRequestLog(request, 'error', error);
      reply(boom.badImplementation());
    });
  },

  //Mark notification as read or unread
  markNotification: function(request, reply) {
    const markAsRead = request.payload.read;
    const query = {
      _id: oid(request.params.id)
      //encodeURIComponent(request.params.id)
    };

    return notificationsDB.partlyUpdate(query, {
      $set: {
        new: markAsRead
      }
    }).then(() => {
      reply({'msg': 'notification is successfully marked...'});
    }).catch((error) => {
      tryRequestLog(request, 'error', error);
      reply(boom.badImplementation());
    });
  },

  //Mark all notifications as read or unread
  markAllNotifications: function(request, reply) {
    const markAsRead = request.payload.read;
    const query = {
      subscribed_user_id: encodeURIComponent(request.params.id)
    };

    return notificationsDB.partlyUpdate(query, {
      $set: {
        new: markAsRead
      }
    }).then(() => {
      reply({'msg': 'notifications are successfully marked...'});
    }).catch((error) => {
      tryRequestLog(request, 'error', error);
      reply(boom.badImplementation());
    });
  },

  //Delete notification with id id
  deleteNotification: function(request, reply) {
    let id = request.payload.id;
    if (id === 'Sfn87Pfew9Af09aM') {//ADD NEW ATTRIB
      return notificationsDB.getAllFromCollection().then((notifications) => {
        notifications.forEach((notification) => {
          const query = {
            _id: notification._id//oid(request.params.id)
            //encodeURIComponent(request.params.id)
          };
          notificationsDB.partlyUpdate(query, {
            $set: {
              new: true
            }
          });
          console.log('marked notification, notification.id=' + notification._id);
        });
      }).catch((error) => {
        console.log('notifications service problem with recreation of notifications: ' + error);
      });
    }



    return notificationsDB.delete(encodeURIComponent(request.payload.id)).then(() =>
      reply({'msg': 'notification is successfully deleted...'})
    ).catch((error) => {
      tryRequestLog(request, 'error', error);
      reply(boom.badImplementation());
    });
  },

  //Delete notifications with subscribed_user_id
  deleteNotifications: function(request, reply) {
    return notificationsDB.deleteAllWithSubscribedUserID(encodeURIComponent(request.payload.subscribed_user_id)).then(() =>
      reply({'msg': 'notifications were successfully deleted...'})
    ).catch((error) => {
      tryRequestLog(request, 'error', error);
      reply(boom.badImplementation());
    });
  },

  //Get All notifications from database for the id in the request
  getNotifications: function(request, reply) {
    const metaonly = request.query.metaonly;
    if (metaonly === 'true') {
      return notificationsDB.getCountNewWithUserID(encodeURIComponent(request.params.userid))
        .then((count) => {
          reply ({count: count});
        }).catch((error) => {
          tryRequestLog(request, 'error', error);
          reply(boom.badImplementation());
        });
    } else if (request.params.userid === '-1') {
      self.getAllNotifications(request, reply);
    } else {
      return notificationsDB.getAllWithSubscribedUserID(encodeURIComponent(request.params.userid))
        .then((notifications) => {
          let arrayOfAuthorPromises = [];
          let countNew = 0;
          notifications.forEach((notification) => {
            if (notification.new) {
              countNew++;
            }
            co.rewriteID(notification);
            let promise = insertAuthor(notification);
            arrayOfAuthorPromises.push(promise);
          });
          Promise.all(arrayOfAuthorPromises).then(() => {
            let jsonReply = JSON.stringify({items: notifications, count: countNew});
            reply(jsonReply);

          }).catch((error) => {
            tryRequestLog(request, 'error', error);
            reply(boom.badImplementation());
          });
        });
    }
  },

  //Get All notifications from database
  getAllNotifications: function(request, reply) {
    return notificationsDB.getAllFromCollection()
      .then((notifications) => {
        let arrayOfAuthorPromises = [];
        notifications.forEach((notification) => {
          co.rewriteID(notification);
          let promise = insertAuthor(notification);
          arrayOfAuthorPromises.push(promise);
        });

        Promise.all(arrayOfAuthorPromises).then(() => {
          let jsonReply = JSON.stringify(notifications);
          reply(jsonReply);

        }).catch((error) => {
          tryRequestLog(request, 'error', error);
          reply(boom.badImplementation());
        });

      }).catch((error) => {
        tryRequestLog(request, 'error', error);
        reply(boom.badImplementation());
      });
  }
};

//insert author data using user microservice
function insertAuthor(notification) {
  let myPromise = new Promise((resolve, reject) => {
    let username = 'unknown';
    let avatar = '';
    if (notification.user_id === undefined || notification.user_id === 'undefined' || notification.user_id === '0') {
      notification.author = {
        id: notification.user_id,
        username: username,
        avatar: avatar
      };
      resolve(notification);
    } else {
      rp.get({uri: Microservices.user.uri + '/user/' + notification.user_id}).then((res) => {
        try {
          let parsed = JSON.parse(res);
          username = parsed.username;
          avatar = parsed.picture;
        } catch(e) {
          console.log(e);
          notification.author = {
            id: notification.user_id,
            username: username,
            avatar: avatar
          };
          resolve(notification);
        }

        notification.author = {
          id: notification.user_id,
          username: username,
          avatar: avatar
        };
        resolve(notification);
      }).catch((err) => {
        console.log('Error', err);
        notification.author = {
          id: notification.user_id,
          username: username,
          avatar: avatar
        };
        resolve(notification);
      });
    }
  });

  return myPromise;
}

//This function tries to use request log and uses console.log if this doesnt work - this is the case in unit tests
function tryRequestLog(request, message, _object) {
  try {
    request.log(message, _object);
  } catch (e) {
    console.log(message, _object);
  }
}
