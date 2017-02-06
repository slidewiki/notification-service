'use strict';

const co = require('../common');

module.exports = {
  'user': {
    uri: (!co.isEmpty(process.env.SERVICE_URL_USER)) ? process.env.SERVICE_URL_USER : 'http://userservice'
  }
};
