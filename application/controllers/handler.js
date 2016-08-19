/*
Handles the requests by executing stuff and replying to the client. Uses promises to get stuff done.
*/

'use strict';

const boom = require('boom'), //Boom gives us some predefined http codes and proper responses
  notificationsDB = require('../database/notificationsDatabase'), //Database functions specific for notifications
  co = require('../common');

module.exports = {
  //Get notification from database or return NOT FOUND
  getNotification: function(request, reply) {
    notificationsDB.get(encodeURIComponent(request.params.id)).then((notification) => {
      if (co.isEmpty(notification))
        reply(boom.notFound());
      else {
        notification.author = authorsMap.get(notification.user_id);//insert author data
        if (notification.author === undefined) {
          notification.author = authorsMap.get('112233445566778899000000');
        }
        reply(co.rewriteID(notification));
      }
    }).catch((error) => {

      request.log('error', error);
      reply(boom.badImplementation());
    });
  },

  //Create notification with new id and payload or return INTERNAL_SERVER_ERROR
  newNotification: function(request, reply) {
    notificationsDB.insert(request.payload).then((inserted) => {
      //console.log('inserted: ', inserted);
      if (co.isEmpty(inserted.ops) || co.isEmpty(inserted.ops[0]))
        throw inserted;
      else {
        inserted.ops[0].author = authorsMap.get(inserted.ops[0].user_id);//insert author data
        reply(co.rewriteID(inserted.ops[0]));
      }
    }).catch((error) => {
      request.log('error', error);
      reply(boom.badImplementation());
    });
  },

  //Update notification with id id and payload or return INTERNAL_SERVER_ERROR
  updateNotification: function(request, reply) {
    notificationsDB.replace(encodeURIComponent(request.params.id), request.payload).then((replaced) => {
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
    notificationsDB.delete(encodeURIComponent(request.payload.id)).then(() =>
      reply({'msg': 'notification is successfully deleted...'})
    ).catch((error) => {
      request.log('error', error);
      reply(boom.badImplementation());
    });
  },

  //Delete notifications with subscribed_user_id
  deleteNotifications: function(request, reply) {
    notificationsDB.deleteAllWithSubscribedUserID(encodeURIComponent(request.payload.subscribed_user_id)).then(() =>
      reply({'msg': 'notifications were successfully deleted...'})
    ).catch((error) => {
      request.log('error', error);
      reply(boom.badImplementation());
    });
  },

  //Get All notifications from database for the id in the request
  getNotifications: function(request, reply) {
    //Clean collection and insert mockup notifications - only if request.params.id === 0
    initMockupData(request.params.id)
      .then(() => notificationsDB.getAllFromCollection()//TODO call getAllWithSubscribedUserID(identifier)
      // .then(() => notificationsDB.getAllWithSubscribedUserID(encodeURIComponent(request.params.id))
      .then((notifications) => {
        insertAuthorData(notifications);

        let jsonReply = JSON.stringify(notifications);
        reply(jsonReply);

      })).catch((error) => {
        request.log('error', error);
        reply(boom.badImplementation());
      });
  },

  //Get All notifications from database
  getAllNotifications: function(request, reply) {
    notificationsDB.getAllFromCollection()
      .then((notifications) => {
        insertAuthorData(notifications);

        let jsonReply = JSON.stringify(notifications);
        reply(jsonReply);

      }).catch((error) => {
        request.log('error', error);
        reply(boom.badImplementation());
      });
  }
};

//Delete all and insert mockup data
function initMockupData(identifier) {
  if (identifier === '000000000000000000000000') {//create collection, delete all and insert mockup data only if the user has explicitly sent 000000000000000000000000
    return notificationsDB.createCollection()
      .then(() => notificationsDB.deleteAll())
      .then(() => insertMockupData());
  }
  return new Promise((resolve) => {resolve (1);});
}

function insertAuthorData(notifications) {
  notifications.forEach((notification) => {
    co.rewriteID(notification);
    notification.author = authorsMap.get(notification.user_id);//insert author data
  });
}

// function getFirstTwoActivities() {
//   let http = require('http');
//   const Microservices = require('../configs/microservices');
//   let options = {
//     //CHANGES FOR LOCALHOST IN PUPIN (PROXY)
//     // host: 'proxy.rcub.bg.ac.rs',
//     // port: 8080,
//     // path: 'http://activitiesservice.manfredfris.ch/activity/new',
//     // path: 'http://' + Microservices.activities.uri + '/activity/new',
//
//     // host: 'activitiesservice.manfredfris.ch',
//     host: Microservices.activities.uri,
//     port: 80,
//     path: '/activities/8',
//   };
//
//   let req = http.get(options, (res) => {
//     // console.log('STATUS: ' + res.statusCode);
//     // console.log('HEADERS: ' + JSON.stringify(res.headers));
//     let body = '';
//     res.on('data', (chunk) => {
//       body += chunk;
//     });
//     res.on('end', () => {
//       let data = JSON.parse(body);
//       console.log(data);
//       return data;
//     });
//   });
//   req.on('error', (e) => {
//     console.log('problem with request: ' + e.message);
//   });
//
// }
//Insert mockup data to the collection
function insertMockupData() {
  //get real ids for the first 2 activities
  // const firstTwoActivities = getFirstTwoActivities();
  const firstTwoActivities = [
    {activity_id: '57b6c4eb000eee001048bd26'},
    {activity_id: '57b6c4eb000eee001048bd25'}
  ];
  let notification1 = {
    activity_id: firstTwoActivities[0].activity_id,
    activity_type: 'react',
    content_id: '8',
    content_kind: 'slide',
    content_name: 'Introduction',
    user_id: '112233445566778899000002',
    react_type: 'like',
    subscribed_user_id: '112233445566778899000001'
  };
  let ins1 = notificationsDB.insert(notification1);
  let notification2 = {
    activity_id: firstTwoActivities[1].activity_id,
    activity_type: 'download',
    content_id: '8',
    content_kind: 'slide',
    content_name: 'Introduction',
    user_id: '112233445566778899000001',
    subscribed_user_id: '112233445566778899000001'
  };
  let ins2 = ins1.then(() => notificationsDB.insert(notification2));

  return ins2;
}

let authorsMap = new Map([
  ['112233445566778899000001', {
    id: 7,
    username: 'Dejan P.',
    avatar: '/assets/images/mock-avatars/deadpool_256.png'
  }],
  ['112233445566778899000002', {
    id: 8,
    username: 'Nikola T.',
    avatar: '/assets/images/mock-avatars/man_512.png'
  }],
  ['112233445566778899000003', {
    id: 9,
    username: 'Marko B.',
    avatar: '/assets/images/mock-avatars/batman_512.jpg'
  }],
  ['112233445566778899000004', {
    id: 10,
    username: 'Valentina J.',
    avatar: '/assets/images/mock-avatars/ninja-simple_512.png'
  }],
  ['112233445566778899000005', {
    id: 11,
    username: 'Voice in the crowd',
    avatar: '/assets/images/mock-avatars/anon_256.jpg'
  }],
  ['112233445566778899000006', {
    id: 12,
    username: 'SlideWiki FTW',
    avatar: '/assets/images/mock-avatars/spooky_256.png'
  }],
  ['112233445566778899000000', {
    id: 13,
    username: 'Dutch',
    avatar: '/assets/images/mock-avatars/dgirl.jpeg'
  }]
]);
