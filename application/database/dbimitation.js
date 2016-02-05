'use strict';

let db = [];

module.exports = {
  getNewID: function(){
    return db.length;
  },

  insert: function(slide) {
    if (alreadyPresent(slide.id))
      throw new Error("Element already there");
    else {
      db = db.concat(slide);
      return slide;
    }
  },

  update: function(slide) {
    this.remove(slide.id);
    this.insert(slide);
  },

  remove: function(id) {
    db = db.filter((entry) => entry.id != id);
  },

  get: function(id) {
    let result = db.filter((entry) => entry.id == id);
    if (result.length === 0)
      throw new Error("Element not found");
    else {
      return result[0];
    }
  }
};

function alreadyPresent(id) {
  let isPresent = db.find((entry) => entry.id == id);
  if (isPresent !== undefined)
    return true;
  else
    return false;
}
