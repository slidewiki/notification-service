/*
Handles the requests by executing stuff and replying to the client. Uses promises to get stuff done.
*/
/* eslint promise/always-return: "off" */

'use strict';

const boom = require('boom'), //Boom gives us some predefined http codes and proper responses
  templateDB = require('../database/templateDatabase'), //Database functions specific for slides
  co = require('../common');

module.exports = {
  //Get template from database or return NOT FOUND
  getTemplate: function(request, reply) {
    templateDB.get(encodeURIComponent(request.params.id)).then((template) => {
      if (co.isEmpty(template))
        reply(boom.notFound());
      else
        reply(co.rewriteID(template));
    }).catch((error) => {
      request.log('error', error);
      reply(boom.badImplementation());
    });
  },

  //Create Template with new id and payload or return INTERNAL_SERVER_ERROR
  newTemplate: function(request, reply) {
    templateDB.insert(request.payload).then((inserted) => {
      if (co.isEmpty(inserted.ops[0]))
        throw inserted;
      else
        reply(co.rewriteID(inserted.ops[0]));
    }).catch((error) => {
      request.log('error', error);
      reply(boom.badImplementation());
    });
  },

  //Update Slide with id id and payload or return INTERNAL_SERVER_ERROR
  replaceTemplate: function(request, reply) {
    templateDB.replace(encodeURIComponent(request.params.id), request.payload).then((replaced) => {
      if (co.isEmpty(replaced.value))
        throw replaced;
      else
        reply(replaced.value);
    }).catch((error) => {
      request.log('error', error);
      reply(boom.badImplementation());
    });
  },
};
