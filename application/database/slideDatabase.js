'use strict';

const helper = require('./helper'),
  oid = require('mongodb').ObjectID;

module.exports = {
  get: function(identifier) {
    return helper.connectToDatabase()
      .then((db) => db.collection('slides'))
      .then((col) => col.findOne({
        _id: oid(identifier)
      }));
  },

  insert: function(slide) {
    //TODO check for root and parent deck ids to be existant, otherwise create these
    return helper.connectToDatabase()
      .then((db) => db.collection('slides'))
      .then((col) => col.insertOne(slide)); //id is created and concatinated automagically
  },

  replace: function(id, slide) {
    return helper.connectToDatabase()
      .then((db) => db.collection('slides'))
      .then((col) => col.findOneAndReplace({
        _id: oid(id)
      }, slide));
  }
};
