'use strict';

/*
Example of an model validation with ajv.
*/

//require
let Ajv = require('ajv');
let ajv = Ajv({
  verbose: true,
  allErrors: true
}); // options can be passed, e.g. {allErrors: true}

//build schema
const objectid = {
  type: 'integer',
  maxLength: 24,
  minLength: 1
};

const template = {
  type: 'object',
  properties: {
    _id: objectid,
    title: {
      type: 'string'
    },
    body: {
      type: 'string'
    },
    user_id: objectid
  },
  required: ['_id', 'title', 'body', 'user_id']
};

//export
module.exports = ajv.compile(template);
