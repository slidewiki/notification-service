/* eslint dot-notation: 0, no-unused-vars: 0 */
'use strict';

//Mocking is missing completely TODO add mocked objects

describe('REST API', () => {

  let server;

  beforeEach((done) => {
    //Clean everything up before doing new tests
    Object.keys(require.cache).forEach((key) => delete require.cache[key]);
    require('chai').should();
    let hapi = require('hapi');
    server = new hapi.Server();
    server.connection({
      host: 'localhost',
      port: 3000
    });
    require('../routes.js')(server);
    done();
  });

  let notification = {
    activity_id: '',
    activity_type: 'add',
    content_id: '112233445566778899000671',
    content_kind: 'slide',
    user_id: '000000000000000000000000',
    subscribed_user_id: '000000000000000000000000'
  };
  let options = {
    method: 'POST',
    url: '/notification/new',
    payload: notification,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  context('when creating a notification it', () => {
    it('should reply it', (done) => {
      server.inject(options, (response) => {
        response.should.be.an('object').and.contain.keys('statusCode','payload');
        console.log(response);
        response.statusCode.should.equal(200);
        response.payload.should.be.a('string');
        let payload = JSON.parse(response.payload);
        payload.should.be.an('object').and.contain.keys('content_id', 'timestamp', 'user_id', 'subscribed_user_id');
        payload.content_id.should.equal('112233445566778899000671');
        payload.subscribed_user_id.should.equal('000000000000000000000000');
        done();
      });
    });
  });
});
