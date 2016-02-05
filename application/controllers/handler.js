'use strict';

//Boom gives us some predefined http codes and proper responses
const boom = require('boom');
//Some self defined common functions
const co = require('../common');
//This is a simple database imitation that has to be exchanged in the future
let db = require("../database/dbimitation");

module.exports = {
  getSlide: function(request, reply) {
    try {
      reply(db.get(encodeURIComponent(request.params.id)));
    } catch (e) {
      reply(boom.notFound());
    }
  },

  newSlide: function(request, reply) {
    try {
      let slide = request.payload;
      slide.id = db.getNewID();
      reply(db.insert(slide));
    } catch (e) {
      reply(boom.badImplementation('Someting strange happend...try to contact Santa to solve the problem...'));
    }
  },

  updateSlide: function(request, reply) {
    try {
      reply(db.update(request.payload));
    } catch (e) {
      reply(boom.badImplementation('Someting strange happend...try to contact Santa to solve the problem...'));
    }
  }
};
