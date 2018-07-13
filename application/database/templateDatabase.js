/*
Controller for handling mongodb and the data model slide while providing CRUD'ish.
*/

'use strict';

const helper = require('./helper'),
  templateModel = require('../models/template.js');

const templateCol = 'templates';

module.exports = {
  get: function (identifier) {
    return helper.connectToDatabase()
      .then((db) => db.collection(templateCol))
      .then((col) => {
        return col.findOne({
          _id: parseInt(identifier)
        });
      });
  },

  insert: function (template) {
    return helper.connectToDatabase()
      .then((db) => helper.getNextIncrementationValueForCollection(db, templateCol))
      .then((newId) => {

        return helper.connectToDatabase() //db connection have to be accessed again in order to work with more than one collection
          .then((db2) => db2.collection(templateCol))
          .then((col) => {
            let valid = false;
            template._id = newId;
            template.user_id = parseInt(template.user_id);
            try {
              valid = templateModel(template);
              if (!valid) {
                return templateModel.errors;
              }
              return col.insertOne(template);
            } catch (e) {
              console.log('validation failed', e);
            }
            return;
          }); //id is created and concatinated automatically
      });
  },

  replace: function (id, template) {
    return helper.connectToDatabase()
      .then((db) => db.collection(templateCol))
      .then((col) => {
        let valid = false;
        try {
          template._id = parseInt(id);
          template.user_id = parseInt(template.user_id);
          valid = templateModel(template);
          if (!valid) {
            return template.errors;
          }
          return col.findOneAndReplace({
            _id: template._id
          }, template);
        } catch (e) {
          console.log('validation failed', e);
        }
        return;
      });
  }
};
