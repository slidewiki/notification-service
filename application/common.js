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
        let key = beautifyKey((curr.dataPath !== '') ? curr.dataPath : curr.schemaPath);
        if (curr.dataPath === '' && curr.params.key)
          key += ' with key ' + curr.params.key;

        if (prev.wrong[key]) {
          //already given so increment counter
          prev.wrong[key].occurences = 1 + prev.wrong[key].occurences;
        } else {
          curr.occurences = 1;
          prev.wrong[key] = curr;
        }
      }
      return prev;
    }, {
      missing: {},
      wrong: {}
    });
  }
};
