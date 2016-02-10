'use strict';

//Boom gives us some predefined http codes and proper responses
const boom = require('boom');
//Some self defined common functions
const co = require('../common');
//This is a simple database imitation that has to be exchanged in the future
const db = require('../database/dbimitation');

//simple database connection
let MongoClient = require('mongodb').MongoClient;
let url = require('../configuration.js').MongoDB.connection;
MongoClient.connect(url, (err, db) => {
  console.log('Connected correctly to server: ', err);
  if (db)
    db.close();
});

module.exports = {
  //Get Slide from database or return NOT FOUND
  getSlide: function(request, reply) {
    try {
      reply(db.get(encodeURIComponent(request.params.id)));
    } catch (e) {
      reply(boom.notFound());
    }
  },

  //Create Slide with new id and payload or return INTERNAL_SERVER_ERROR
  newSlide: function(request, reply) {
    try {
      let slide = request.payload;
      slide.id = db.getNewID();
      reply(db.insert(slide));
    } catch (e) {
      reply(boom.badImplementation('Something strange happend...try to contact Santa to solve the problem...'));
    }
  },

  //Update Slide with id id and payload or return INTERNAL_SERVER_ERROR
  updateSlide: function(request, reply) {
    try {
      reply(db.update(request.payload));
    } catch (e) {
      reply(boom.badImplementation('Something strange happend...try to contact Santa to solve the problem...'));
    }
  }
};
