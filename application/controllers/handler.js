/*
Handles the requests by executing stuff and replying to the client. Uses promises to get stuff done.
*/
/* eslint promise/always-return: "off" */

'use strict';

const boom = require('boom'), //Boom gives us some predefined http codes and proper responses
  notificationsDB = require('../database/notificationsDatabase'), //Database functions specific for notifications
  oid = require('mongodb').ObjectID,
  notificationModel = require('../models/notification.js'),
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
        if (notification.author !== undefined) {//author is already set (by the activities service)
          reply(co.rewriteID(notification));
        } else {
          return insertAuthor(notification).then((notification) => {
            reply(co.rewriteID(notification));
          }).catch((error) => {
            tryRequestLog(request, 'error', error);
            reply(boom.badImplementation());
          });
        }
      }
    }).catch((error) => {

      tryRequestLog(request, 'error', error);
      reply(boom.badImplementation());
    });
  },

  //Create notification with new id and payload or return INTERNAL_SERVER_ERROR
  newNotification: function(request, reply) {
    if (request.payload.new === undefined) {
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

  //Create notification with new id and payload or return INTERNAL_SERVER_ERROR
  newNotifications: function(request, reply) {
    let payloadNotifications = request.payload;
    let notifications = [];
    payloadNotifications.forEach((notification) => {
      if (notification.new === undefined) {
        notification.new = true;
      }
      if (!notification.timestamp) {//if timestamp has not already been defined
        notification.timestamp = new Date();
      } else {
        notification.timestamp = new Date(notification.timestamp);
      }
      let user_ids = notification.subscribed_user_ids;
      user_ids.forEach((user_id) => {
        let newNotification = {
          activity_type: notification.activity_type,
          new: notification.new,
          timestamp: notification.timestamp,
          user_id: notification.user_id,
          content_id: notification.content_id,
          content_kind: notification.content_kind,
          content_root_id: notification.content_root_id,
          content_owner_id: notification.content_owner_id,
          activity_id: notification.activity_id,
          subscribed_user_id: user_id
        };

        if (notification.content_name !== undefined && notification.content_name !== null) {
          newNotification.content_name = notification.content_name;
        }
        if (notification.translation_info !== undefined && notification.translation_info !== null) {
          newNotification.translation_info = notification.translation_info;
        }
        if (notification.share_info !== undefined && notification.share_info !== null) {
          newNotification.share_info = notification.share_info;
        }
        if (notification.comment_info !== undefined && notification.comment_info !== null) {
          newNotification.comment_info = notification.comment_info;
        }
        if (notification.use_info !== undefined && notification.use_info !== null) {
          newNotification.use_info = notification.use_info;
        }
        if (notification.react_type !== undefined && notification.react_type !== null) {
          newNotification.react_type = notification.react_type;
        }
        if (notification.rate_type !== undefined && notification.rate_type !== null) {
          newNotification.rate_type = notification.rate_type;
        }
        let valid = false;
        try {
          valid = notificationModel(newNotification);
          if (!valid) {
            return notificationModel.errors;
          }
          notifications.push(newNotification);
        } catch (e) {
          console.log('validation failed', e);
        }
      });
    });

    return notificationsDB.insertMany(notifications).then((inserted) => {
      //console.log('inserted: ', inserted);
      if (co.isEmpty(inserted.ops) || co.isEmpty(inserted.ops[0]))
        throw inserted;
      else {
        reply({'msg': 'notifications are successfully added...'});
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
        new: !markAsRead
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
      subscribed_user_id: encodeURIComponent(request.params.userid)
    };

    return notificationsDB.partlyUpdate(query, {
      $set: {
        new: !markAsRead
      }
    }, {multi: true} ).then(() => {
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
      const activityTypeArray = ['view', 'exam'];
      return notificationsDB.deleteAllOfType(activityTypeArray).then(() => {

      }).catch((error) => {
        console.log('notifications service problem with deletion of notifications: ' + error);
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
          let countNew = 0;
          notifications.forEach((notification) => {
            if (notification.new) {
              countNew++;
            }
            co.rewriteID(notification);
          });
          insertAuthors(notifications).then((notifications) => {
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
        notifications.forEach((notification) => {
          co.rewriteID(notification);
        });

        insertAuthors(notifications).then((notifications) => {
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

    if (notification.user_id === '0') {
      notification.author = {
        id: '0',
        username: 'Guest'
      };
      resolve(notification);
    } else if (notification.user_id === undefined || notification.user_id === 'undefined') {
      console.log('Error user_id', notification.user_id);
      notification.author = {
        id: 'undefined',
        username: 'unknown'
      };
      resolve(notification);
    } else {
      rp.get({uri: Microservices.user.uri + '/user/' + notification.user_id}).then((res) => {
        let username = '';
        let displayName = undefined;
        try {
          let parsed = JSON.parse(res);
          username = parsed.username;
          displayName = parsed.displayName;
        } catch(e) {
          console.log(e);
          notification.author = {
            id: notification.user_id,
            username: 'user ' + notification.user_id
          };
          resolve(notification);
        }

        notification.author = {
          id: notification.user_id,
          username: username,
          displayName: displayName
        };
        resolve(notification);

      }).catch((err) => {
        console.log('Error', err);
        notification.author = {
          id: notification.user_id,
          username: 'user ' + notification.user_id
        };
        resolve(notification);
      });
    }
  });

  return myPromise;
}

//insert author data to an array of notifications using user microservice
function insertAuthors(notifications) {
  let myPromise = new Promise((resolve, reject) => {

    //Create array of user ids
    let arrayOfUserIds = [];
    notifications.forEach((notification) => {
      if (notification.user_id !== undefined && notification.user_id !== '0' && notification.user_id !== null) {
        const id = parseInt(notification.user_id);
        if (id !== null && id > 0 && id !== undefined && !arrayOfUserIds.includes(id)) {
          arrayOfUserIds.push(id);
        }
      }
    });

    if (arrayOfUserIds.length === 0) {
      notifications.forEach((notification) => {
        notification.author = {
          id: '0',
          username: 'Guest'
        };
      });
      resolve(notifications);
    } else {

      let data = JSON.stringify(arrayOfUserIds);
      rp.post({uri: Microservices.user.uri + '/users', body:data}).then((res) => {
        try {
          let userDataArray = JSON.parse(res);

          userDataArray.forEach((userData) => {
            let userId = userData._id;
            let username = userData.username;
            let displayName = userData.displayName;
            notifications.forEach((notification) => {
              if (parseInt(notification.user_id) === userId) {
                notification.author = {
                  id: notification.user_id,
                  username: username,
                  displayName: displayName
                };
              }
            });
          });

          notifications.forEach((notification) => {
            if (notification.author === undefined) {
              notification.author = {
                id: notification.user_id,
                username: 'Guest'
              };
            }
          });
          resolve(notifications);

        } catch(e) {
          console.log(e);
          notifications.forEach((notification) => {
            notification.author = {
              id: notification.user_id,
              username: 'user ' + notification.user_id
            };
          });
          resolve(notifications);
        }

      }).catch((err) => {
        console.log('Error', err);
        notifications.forEach((notification) => {
          notification.author = {
            id: notification.user_id,
            username: 'user ' + notification.user_id
          };
        });
        resolve(notifications);
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
