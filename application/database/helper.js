'use strict';

//Simple module which provides promises for a basic usage of the MongoDB
/* eslint promise/always-return: 0*/

//modules
const Db = require('mongodb').Db,
  Server = require('mongodb').Server,
  MongoClient = require('mongodb').MongoClient,
  config = require('../configuration.js').MongoDB;

//private functions
const _createDatabase_ = function(dbname, resolve, reject) {
  dbname = typeof dbname !== 'undefined' ? dbname : config.SLIDEWIKIDATABASE;

  let db = new Db(dbname,
    new Server(config.HOST,
      config.PORT));
  db.open((err, db) => {
    if (err)
      reject(err);
    else {
      //insert the first object to know that the database is properly created
      db.collection('test').insertOne({
        id: 1,
        data: {}
      });
      resolve(db);
    }
  });
};

const _dropDatabase_ = function(db, resolve, reject) {
  try {
    const DatabaseCleaner = require('database-cleaner');
    const databaseCleaner = new DatabaseCleaner('mongodb');

    databaseCleaner.clean(db, resolve);
  } catch (error) {
    reject(error);
  }
};

const _connectToDatabase_ = function(dbname, resolve, reject) {
  dbname = typeof dbname !== 'undefined' ? dbname : config.SLIDEWIKIDATABASE;

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

//create module as promise collection
module.exports = {
  createDatabase: function(dbname) {
    return new Promise((resolve, reject) => {
      _createDatabase_(dbname, resolve, reject);
    });
  },
  cleanDatabase: function(db, dbname) {
    return new Promise((resolve, reject) => {
      //use db connection or database name
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
