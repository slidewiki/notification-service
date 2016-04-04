/*
Controller for handling mongodb and the data model slide while providing CRUD'ish.
*/

'use strict';

const helper = require('./helper'),
  slideModel = require('../models/slide.js'),
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
      .then((col) => {
        let valid = false;
        try {
          valid = slideModel(slide);
          if (!valid) {
            return slideModel.errors;
          }
          return col.insertOne(slide);
        } catch (e) {
          console.log('validation failed', e);
        }
        return;
      }); //id is created and concatinated automatically
  },

  replace: function(id, slide) {
    return helper.connectToDatabase()
      .then((db) => db.collection('slides'))
      .then((col) => {
        let valid = false;
        try {
          valid = slideModel(slide);
          if (!valid) {
            return slideModel.errors;
          }
          return col.findOneAndReplace({
            _id: oid(id)
          }, slide);
        } catch (e) {
          console.log('validation failed', e);
        }
        return;
      });
  }
};
