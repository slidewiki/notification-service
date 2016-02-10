//simple api tests

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

test("GET /slide/{id}", function(t) {
    //try to get not existing one
    var options = {
        method: "GET",
        url: "/slide/199"
    };
    server.inject(options, function(response) {
        t.equal(response.statusCode, 404, "get data - not existing - status");
    });

    //try to get created one
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
        t.equal(response.statusCode, 200, "get data - creation of a new one - status");
        payload = JSON.parse(response.payload);
    });
    //console.log(payload);
    options = {
        method: "GET",
        url: "/slide/" + payload.id
    };
    server.inject(options, function(response) {
        t.equal(response.statusCode, 200, "get data - status");
        server.stop(t.end);
    });
});
