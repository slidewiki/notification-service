/*
Controller for handling mongodb and the data model notification while providing CRUD'ish.
*/

'use strict';

const helper = require('./helper'),
  notificationModel = require('../models/notification.js'),
  oid = require('mongodb').ObjectID,
  collectionName = 'notifications';

module.exports = {
  get: function(identifier) {
    return helper.connectToDatabase()
      .then((db) => db.collection(collectionName))
      .then((col) => col.findOne({
        _id: oid(identifier)
      }));
  },

  getAllWithSubscribedUserID: function(identifier) {
    return helper.connectToDatabase()
      .then((db) => db.collection(collectionName))
      .then((col) => col.find({ subscribed_user_id: identifier }))
      .then((stream) => stream.sort({timestamp: -1}))
      .then((stream) => stream.toArray());
  },

  getCountNewWithUserID: function(identifier) {
    return helper.connectToDatabase()
      .then((db) => db.collection(collectionName))
      .then((col) => col.count({ subscribed_user_id: identifier, new: true }));
  },

  getAllFromCollection: function() {
    return helper.connectToDatabase()
      .then((db) => db.collection(collectionName))
      .then((col) => col.find())
      .then((stream) => stream.sort({timestamp: -1}))
      .then((stream) => stream.toArray());
  },

  insert: function(notification) {
    //TODO check for content id, subscribed_user_id to be existant
    return helper.connectToDatabase()
      .then((db) => db.collection(collectionName))
      .then((col) => {
        let valid = false;
        notification.timestamp = new Date();
        try {
          valid = notificationModel(notification);
          if (!valid) {
            return notificationModel.errors;
          }

          return col.insertOne(notification);
        } catch (e) {
          console.log('validation failed', e);
        }
        return;
      }); //id is created and concatenated automatically
  },

  replace: function(id, notification) {
    return helper.connectToDatabase()
      .then((db) => db.collection(collectionName))
      .then((col) => {
        let valid = false;
        notification.timestamp = new Date();
        try {
          valid = notificationModel(notification);

          if (!valid) {
            return notificationModel.errors;
          }

          return col.findOneAndUpdate({_id: oid(id)}, notification, { upsert: true, returnNewDocument: true });
        } catch (e) {
          console.log('validation failed', e);
        }
        return;
      });
  },

  partlyUpdate: (findQuery, updateQuery, params = undefined) => {
    return helper.connectToDatabase()
      .then((db) => db.collection(collectionName))
      .then((col) => col.update(findQuery, updateQuery, params));
  },

  delete: function(identifier) {
    return helper.connectToDatabase()
      .then((db) => db.collection(collectionName))
      .then((col) => col.remove({
        _id: oid(identifier)
      }));
  },

  deleteAllWithSubscribedUserID: function(identifier) {
    return helper.connectToDatabase()
      .then((db) => db.collection(collectionName))
      .then((col) => col.remove({
        subscribed_user_id: identifier
      }));
  },

  deleteAll: function() {
    return helper.connectToDatabase()
      .then((db) => db.collection(collectionName))
      .then((col) => col.remove());
  },

  createCollection: function() {
    return helper.connectToDatabase()
      .then((db) => db.createCollection(collectionName));
  }

};
