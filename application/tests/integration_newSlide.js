/* eslint dot-notation: 0 */
'use strict';

//Mocking is missing completely TODO add mocked objects

describe('REST API', () => {

  let expect, server;

  beforeEach((done) => {
    //Clean everything up before doing new tests
    Object.keys(require.cache).forEach((key) => delete require.cache[key]);
    require('chai').should();
    expect = require('chai').expect;
    let hapi = require('hapi');
    let myRoutes = require('../routes.js');
    server = new hapi.Server();
    server.connection({
      host: 'localhost',
      port: 3000
    });
    myRoutes(server);
    done();
  });

  let slide = {
    title: 'Dummy',
    language: 'en'
  };
  let options = {
    method: 'POST',
    url: '/slide/new',
    payload: slide,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  context('when creating a slide it', () => {
    it('should reply it', (done) => {
      server.inject(options, (response) => {
        response.should.be.an('object').and.contain.keys('statusCode','payload');
        response.statusCode.should.equal(200);
        response.payload.should.be.a('string');
        let payload = JSON.parse(response.payload);
        payload.should.be.an('object').and.contain.keys('title', 'language');
        payload.title.should.equal('Dummy');
        payload.language.should.equal('en');
        done();
      });
    });
  });
});
