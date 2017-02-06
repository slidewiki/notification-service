'use strict';

const co = require('../common');

module.exports = {
  'deck': {
    uri: (!co.isEmpty(process.env.SERVICE_URL_DECK)) ? process.env.SERVICE_URL_DECK : 'http://deckservice'
  },
  'discussion': {
    uri: (!co.isEmpty(process.env.SERVICE_URL_DISCUSSION)) ? process.env.SERVICE_URL_DISCUSSION : 'http://discussionservice'
  },
  'activities': {
    uri: (!co.isEmpty(process.env.SERVICE_URL_ACTIVITIES)) ? process.env.SERVICE_URL_ACTIVITIES : 'http://activitiesservice'
  },
  'notification': {
    uri: (!co.isEmpty(process.env.SERVICE_URL_NOTIFICATION)) ? process.env.SERVICE_URL_NOTIFICATION : 'http://notificationservice'
  },
  'user': {
    uri: (!co.isEmpty(process.env.SERVICE_URL_USER)) ? process.env.SERVICE_URL_USER : 'http://userservice'
  },
  'search': {
    uri: (!co.isEmpty(process.env.SERVICE_URL_SEARCH)) ? process.env.SERVICE_URL_SEARCH : 'http://searchservice'
  },
  'image': {
    uri: (!co.isEmpty(process.env.SERVICE_URL_IMAGE)) ? process.env.SERVICE_URL_IMAGE : 'http://imageservice'
  },
  'file': {
    uri: (!co.isEmpty(process.env.SERVICE_URL_FILE)) ? process.env.SERVICE_URL_FILE : 'http://fileservice'
  },
  'pdf': {
    uri: (!co.isEmpty(process.env.SERVICE_URL_PDF)) ? process.env.SERVICE_URL_PDF : 'http://pdfservice'
  },
  'import': {
    uri: (!co.isEmpty(process.env.SERVICE_URL_IMPORT)) ? process.env.SERVICE_URL_IMPORT : 'http://importservice'
  }
};
