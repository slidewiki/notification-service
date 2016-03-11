/* some common functions that can be used everywhere inside the program*/
'use strict';

module.exports = {
  isEmpty: function(toTest) {
    return (toTest === undefined ||
      toTest === null ||
      toTest === '' ||
      (toTest instanceof Object && Object.keys(toTest).length === 0) ||
      (toTest instanceof Array && toTest.length === 0));
  },

  rewriteID: function(o){
    if(!this.isEmpty(o)){
      o.id = o._id;
      delete o._id;
    }
    return o;
  },

  parseAjvValidationErrors: function(array) {
    const beautifyKey = (key) => {
      if (key.startsWith('.'))
        key = key.substring(1, key.length);
      if (key.endsWith(']') && key.indexOf('[') !== -1)
        key = key.substring(0, key.indexOf('['));
      return key;
    };

    if (this.isEmpty(array))
      return null;

    return array.reduce((prev, curr) => {
      if (curr.keyword === 'required') {
        prev.missing[beautifyKey(curr.params.missingProperty)] = curr;
      } else {
        prev.wrong[beautifyKey(curr.dataPath)] = curr;
      }
      return prev;
    }, {
      missing: {},
      wrong: {}
    });
  }
};
