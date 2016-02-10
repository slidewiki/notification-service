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
var reply = (a) => {
  //console.log(a);
  static__ = a;
};


test('Save a new slide',  (t) => {
  var dummySlide = {};

  t.doesNotThrow( () => {
    handlers.newSlide({payload: dummySlide}, reply);
  });

  t.equal(0, static__.id, 'correct id');
  t.end();
});

test('Get not existing slide',  (t) => {
  t.doesNotThrow( () => {
    handlers.getSlide({params: {id: 1}}, reply);
  });

  t.notEqual(1, static__.id, 'id is not existing');
  t.equal(404, static__.output.statusCode, 'status');
  t.end();
});

test('Create and get slide',  (t) => {
  var dummySlide = {};

  t.doesNotThrow( () => {
    handlers.newSlide({payload: dummySlide}, reply);
  });
  t.equal(1, static__.id, 'correct new id');

  t.doesNotThrow( () => {
    handlers.getSlide({params: {id: 0}}, reply);
  });
  t.equal(0, static__.id, 'correct id of getted slide');
  t.equal(undefined, static__.output, 'empty attributes');
  t.end();
});

test('Update new slide',  (t) => {
  //get old one
  t.doesNotThrow( () => {
    handlers.newSlide({payload: {id: 2}}, reply);
  }, 'get old one without failure');
  t.equal(2, static__.id, 'correct new id');

  //update
  t.doesNotThrow( () => {
    handlers.updateSlide({payload: {id: 2, dummy: 'null'}}, reply);
  }, 'update without failure');

  //get again
  t.doesNotThrow( () => {
    handlers.getSlide({params: {id: 2}}, reply);
  }, 'get updated one without failure');
  t.equal(2, static__.id, 'id is still correct');
  t.equal(undefined, static__.output, 'empty attributes');
  t.notEqual(undefined, static__.dummy, 'empty attributes #2');
  t.end();
});
