//simple api tests

var server = require('../server.js');
//Small and simple testing module
var test = require('tape');
//Improves tape with a nice terminal output
var tapSpec = require('tap-spec');
test.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout);

test("PUT /slide/{id}", function(t) {
    //try to update not existing one
    var options = {
        method: "PUT",
        url: "/slide/199",
        payload: {
          dummy: 0
        }
    };
    server.inject(options, function(response) {
        t.equal(response.statusCode, 404, "update not existing - status");
    });

    //try to update created one
    var slide = {
      title: "Dummy",
      language: "en"
    };
    options = {
        method: "POST",
        url: "/slide/new",
        payload: slide,
        headers: {
          'Content-Type': 'application/json'
        }
    };
    var payload = {};
    server.inject(options, function(response) {
        t.equal(response.statusCode, 200, "update - creation of a new one - status");
        payload = JSON.parse(response.payload);
    });
    console.log(payload);

    slide.user_id = 1;
    slide.id = payload.id;
    options = {
        method: "PUT",
        url: "/slide/" + payload.id,
        payload: slide
    };
    server.inject(options, function(response) {
        t.equal(response.statusCode, 200, "update - status");
        server.stop(t.end);
    });
});
