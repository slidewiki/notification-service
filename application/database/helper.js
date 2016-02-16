'use strict';

const Db = require('mongodb').Db,
  Server = require('mongodb').Server,
  MongoClient = require('mongodb').MongoClient,
  config = require('../configuration.js').MongoDB;

const _createDatabase_ = function(dbname, resolve, reject) {
  dbname = typeof dbname !== 'undefined' ? dbname : 'slidewikitest';

  let db = new Db(dbname,
    new Server(config.HOST,
      config.PORT));
  db.open((err, db) => {
    if (err)
      reject(err);
    else {
      db.collection('test').insertOne({id: 1, data: {}});
      resolve(db);
    }
  });
};

const _dropDatabase_ = function(db, resolve, reject) {
  try {
    const DatabaseCleaner = require('database-cleaner');
    const databaseCleaner = new DatabaseCleaner('mongodb');

    databaseCleaner.clean(db, resolve);
  }
  catch(error) {
    reject(error);
  }
};

const _connectToDatabase_ = function(dbname, resolve, reject) {
  dbname = typeof dbname !== 'undefined' ? dbname : 'slidewikitest';

  MongoClient.connect('mongodb://' + config.HOST + ':' + config.PORT + '/' + dbname, (err, db) => {
    if (err)
      reject(err);
    if (db) {
      if (db.s.databaseName !== dbname)
        reject(Error('Wrong Database!'));

      resolve(db);
    }
  });
};

module.exports = {
  createDatabase: function(dbname) {
    return new Promise((resolve, reject) => {
      _createDatabase_(dbname, resolve, reject);
    });
  },
  cleanDatabase: function(db, dbname) {
    return new Promise((resolve, reject) => {
      if (db)
        _dropDatabase_(db, resolve, reject);
      else {
        module.exports.connectToDatabase(dbname)
        .then((db2) => {
          _dropDatabase_(db2, resolve, reject);
        })
        .catch((error) => {
          reject(error);
        });
      }
    });
  },
  connectToDatabase: function(dbname) {
    return new Promise((resolve, reject) => {
      _connectToDatabase_(dbname, resolve, reject);
    });
  }
};
