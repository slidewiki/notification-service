/* some common functions that can be used everywhere inside the program*/
'use strict';

module.exports = {
  isEmpty: function(toTest) {
    return (toTest === undefined ||
      toTest === null ||
      toTest === '' ||
      (toTest instanceof Object && Object.keys(toTest).length === 0) ||
      (toTest instanceof Array && toTest.length === 0));
  }
};
