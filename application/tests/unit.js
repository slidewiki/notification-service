// example unit tests

//Small and simple testing module
var test = require('tape');
//Improves tape with a nice terminal output
var tapSpec = require('tap-spec');
test.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout);

var handlers = require('../controllers/handler.js');

//static stuff
var static__ = {};
var reply = function(a) {
  //console.log(a);
  static__ = a;
};


test('Save a new slide', function (t) {
  var dummySlide = {};

  t.doesNotThrow(function () {
    handlers.newSlide({payload: dummySlide}, reply);
  });

  t.equal(0, static__.id);
  t.end();
});

test('Get not existing slide', function (t) {
  t.doesNotThrow(function () {
    handlers.getSlide({params: {id: 1}}, reply);
  });

  t.notEqual(1, static__.id);
  t.equal(404, static__.output.statusCode);
  t.end();
});

test('Create and get slide', function (t) {
  var dummySlide = {};

  t.doesNotThrow(function () {
    handlers.newSlide({payload: dummySlide}, reply);
  });
  t.equal(1, static__.id);

  t.doesNotThrow(function () {
    handlers.getSlide({params: {id: 0}}, reply);
  });
  t.equal(0, static__.id);
  t.equal(undefined, static__.output);
  t.end();
});

test('Update new slide', function (t) {
  //get old one
  t.doesNotThrow(function () {
    handlers.newSlide({payload: {id: 2}}, reply);
  });
  t.equal(2, static__.id);

  //update
  t.doesNotThrow(function () {
    handlers.updateSlide({payload: {id: 2, dummy: "null"}}, reply);
  });

  //get again
  t.doesNotThrow(function () {
    handlers.getSlide({params: {id: 2}}, reply);
  });
  t.equal(2, static__.id);
  t.equal(undefined, static__.output);
  t.notEqual(static__.dummy, undefined);
  t.end();
});
