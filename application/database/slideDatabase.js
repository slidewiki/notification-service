/*
Controller for handling mongodb and the data model slide while providing CRUD'ish.
*/

'use strict';

const helper = require('./helper'),
  slideModel = require('../models/slide.js');

module.exports = {
  get: function (identifier) {
    return helper.connectToDatabase()
      .then((db) => db.collection('slides'))
      .then((col) => col.findOne({
        _id: identifier
      }));
  },

  insert: function (slide) {
    //TODO check for root and parent deck ids to be existant, otherwise create these
    return helper.connectToDatabase()
      .then((db) => helper.insertWithAutoincrementId(db, 'slides'))
      .then((newId) => {
        // console.log('newId', newId);
        return helper.connectToDatabase() //db connection have to be accessed again in order to work with more than one collection
          .then((db2) => db2.collection('slides'))
          .then((col) => {
            let valid = false;
            slide._id = newId;
            try {
              valid = slideModel(slide);
              // console.log('validated slidemodel', valid);
              if (!valid) {
                return slideModel.errors;
              }
              return col.insertOne(slide);
            } catch (e) {
              console.log('validation failed', e);
            }
            return;
          }); //id is created and concatinated automatically
      });
  },

  replace: function (id, slide) {
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
            _id: id
          }, slide);
        } catch (e) {
          console.log('validation failed', e);
        }
        return;
      });
  }
};
