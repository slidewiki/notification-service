'use strict';

const helper = require('./helper');

// this function should include commands that create indexes (if any)
// for any collections that the service may be using

// it should always return a promise
module.exports = function() {


  return helper.getCollection('templates').then((templates) => {
    return templates.createIndexes([
      { key: {'_id': 1, 'user_id': 1} }
    ]);
  });

};
