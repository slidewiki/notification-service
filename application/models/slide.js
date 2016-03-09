'use strict';

//require
var Ajv = require('ajv');
var ajv = Ajv({
  verbose: true
}); // options can be passed, e.g. {allErrors: true}

//build schema
const objectid = {
  type: 'string',
  maxLength: 24,
  minLength: 24
};
const slide = {
  type: 'object',
  properties: {
    title: {
      type: 'string'
    },
    body: {
      type: 'string'
    },
    user_id: {
      type: 'string' //TODO check lowercase
    },
    root_deck_id: {
      type: 'string'
    },
    parent_deck_id: {
      type: 'string'
    },
    no_new_revision: {
      type: 'boolean'
    },
    position: {
      type: 'number',
      minimum: 0,
      maximum: 99
    },
    language: {
      type: 'string'
    }
  },
  required: ['title', 'body']
};

//export
module.exports = ajv.compile(slide);
