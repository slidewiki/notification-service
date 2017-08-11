'use strict';

//require
let Ajv = require('ajv');
let ajv = Ajv({
  verbose: true,
  allErrors: true
    //v5: true  //enable v5 proposal of JSON-schema standard
}); // options can be passed, e.g. {allErrors: true}

//build schema
const objectid = {
  type: 'string',
  maxLength: 24,
  minLength: 1
};
const notification = {
  type: 'object',
  properties: {
    activity_id: objectid,
    activity_type: {
      type: 'string',
      enum: ['translate', 'share', 'add', 'edit', 'comment', 'reply', 'use', 'react', 'rate', 'download', 'fork', 'delete', 'joined', 'left']
    },
    timestamp: {
      type: 'object'
    },
    user_id: objectid,
    content_id: {
      type: 'string'
    },
    content_kind: {
      type: 'string',
      enum: ['deck', 'slide', 'group']
    },
    content_name: {
      type: 'string'
    },
    content_owner_id: objectid,
    subscribed_user_id: objectid,
    translation_info: {
      content_id: {
        type: 'string'
      },
      language: {
        type: 'string'
      }
    },
    share_info: {
      // postURI: {
      //   type: 'string'
      // },
      platform: {
        type: 'string'
      }
    },
    comment_info: {
      comment_id: objectid,
      text: {
        type: 'string'
      }
    },
    use_info: {
      target_id: {
        type: 'string'
      },
      target_name: {
        type: 'string'
      }
    },
    react_type: {
      type: 'string'
    },
    rate_type:  {
      type: 'string'
    },
    delete_info: {
      content_id: {
        type: 'string'
      },
      content_kind: {
        type: 'string',
        enum: ['deck', 'slide', 'group']
      },
      content_name: {
        type: 'string'
      }
    }
  },
  required: ['content_id', 'user_id', 'activity_id', 'activity_type', 'subscribed_user_id']
};

//export
module.exports = ajv.compile(notification);
