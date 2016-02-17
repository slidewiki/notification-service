'use strict';

const database_helper = require('../database/helper.js'),
  config = require('../configuration.js').MongoDB;

module.exports = {
  getAllSlides: function() {
    return new Promise((resolve, reject) => {
      database_helper.connectToDatabase(config.SLIDEWIKIDATABASE)
        .then((db) => {
          return db.collection('slides', function(err, col) {
            if (err) {
              db.close();
              reject(err);
            }
            else {
              col.find().toArray(function(err, docs) {
                if (err) {
                  db.close();
                  reject(err);
                }
                else {
                  db.close();
                  resolve(docs);
                }
              });
            }
          });
        })
        .catch((error) => {
          reject({cause: 'connection failed', error: error});
        });
    });
  }
};
