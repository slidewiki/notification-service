//simple api tests
'use strict';

const hapi = require('hapi');
const myRoutes = require('../routes.js');

//Initiate the webserver
const server = new hapi.Server();
server.connection({
  host: 'localhost',
  port: 3000
});
myRoutes(server);

//Small and simple testing module
var test = require('tape');
//Improves tape with a nice terminal output
var tapSpec = require('tap-spec');
test.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout);

test('POST /slide/new', (t) => {
  //first without data
  var options = {
    method: 'POST',
    url: '/slide/new'
  };
  server.inject(options, (response) => {
    t.equal(response.statusCode, 400, 'Empty data - status');
  });

  //now with data #1
  var slide = {
    title: 'Dummy',
    language: 'en'
  };
  options = {
    method: 'POST',
    url: '/slide/new',
    payload: slide,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  server.inject(options, (response) => {
    t.equal(response.statusCode, 200, 'minimum data - status');
    var payload = JSON.parse(response.payload);
    //console.log(payload);
    t.equal(payload.title, slide.title, 'minimum data - correct response #1');
    t.equal(payload.language, slide.language, 'minimum data - correct response #2');
    t.notEqual(undefined, payload.id, 'minimum data - correct response #3');
  });

  //now with data #2: wrong datatypes
  slide = {
    title: 'Dummy',
    parent_deck_id: -12,
    position: '1',
    user_id: 1,
    root_deck_id: '1',
    language: 'en'
  };
  options = {
    method: 'POST',
    url: '/slide/new',
    payload: slide,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  server.inject(options, (response) => {
    t.notEqual(response.statusCode, 200, 'wrong datatypes - status');
  });

  //now with data #3: all data
  slide = {
    title: 'Dummy',
    parent_deck_id: 12,
    position: 1,
    user_id: 1,
    root_deck_id: 1,
    language: 'en'
  };
  options = {
    method: 'POST',
    url: '/slide/new',
    payload: slide,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  server.inject(options, (response) => {
    t.equal(response.statusCode, 200, 'all data - status');
    var payload = JSON.parse(response.payload);
    t.equal(payload.title, slide.title, 'all data - correct response #1');
    t.equal(payload.language, slide.language, 'all data - correct response #2');
    t.equal(payload.parent_deck_id, slide.parent_deck_id, 'all data - correct response #3');
    t.equal(payload.root_deck_id, slide.root_deck_id, 'all data - correct response #4');
    t.notEqual(undefined, payload.id, 'all data - correct response #5');
    t.end();
  });
});
