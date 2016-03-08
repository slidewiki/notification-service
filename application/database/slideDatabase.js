'use strict';

const helper = require('./helper'),
  slideModel = require('../models/slide.js');

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
        let validated = {};
        try {
          validated = slideModel(slide);
          console.log('validated:', validated);
          console.log('errors:', slideModel.errors);

          if (!validated) {
            return;
          }

          return col.insertOne(slide);
        } catch (e) {
          console.log('validation failed', e);
        }
        return;
      }); //id is created and concatinated automagically
  },

  replace: function(id, slide) {
    return helper.connectToDatabase()
      .then((db) => db.collection('slides'))
      .then((col) => col.findOneAndReplace({
        _id: oid(id)
      }, slide));
  }
};
