// example unit tests
/* eslint dot-notation: 0 */
'use strict';

//Mocking is missing completely TODO add mocked objects

describe('Database', () => {

  let expect, db, result, i = 0;
  let insert = () => result = db.insert({
    id: i,
    name: 'example'
  });
  let get = () => result = db.get((i));

  beforeEach((done) => {
    //Clean everything up before doing new tests
    Object.keys(require.cache).forEach((key) => delete require.cache[key]);
    require('chai').should();
    expect = require('chai').expect;
    db = require('../database/dbimitation.js');
    done();
  });

  context('when inserting a slide it', () => {
    it('should reply it', () => {
      expect(insert).to.not.throw(Error);
      result.should.be.an('object').and.contain.keys('id', 'name');
      result.id.should.be.a('number').and.equal(0);
      result.name.should.be.a('string').and.equal('example');
    });

    it('should throw an error when there is already that slide', () => {
      insert();
      expect(insert).to.throw(Error);
    });
  });

  context('when requesting a slide it', () => {
    it('should throw an error when there is no such slides', () => {
      expect(get).to.throw(Error);
    });

    it('should reply an inserted slide', () => {
      insert();
      expect(get).to.not.throw(Error);
      result.should.be.an('object').and.contain.keys('id', 'name');
      result.id.should.be.a('number').and.equal(0);
      result.name.should.be.a('string').and.equal('example');
    });
  });

  context('when removing a slide it', () => {
    let remove = () => db.remove(i);
    it('should not throw an error, even when there is no slide', () => {
      expect(remove).to.not.throw(Error);
    });

    it('should throw an error, when a requested slide was removed', () => {
      insert();
      expect(remove).to.not.throw(Error);
      expect(get).to.throw(Error);
    });
  });

  context('when updating a slide it', () => {
    let update = () => result = db.update({
      id: (db.getNewID() - i),
      name: 'fancy'
    });

    it('should insert a new slide, even when there is no slide to update', () => {
      expect(update).to.not.throw(Error);
      result.should.be.an('object').and.contain.keys('id', 'name');
      result.id.should.be.a('number').and.equal(0);
      result.name.should.be.a('string').and.equal('fancy');
    });

    it('should reply the updated slide when there is an updateable slide', () => {
      insert();
      i = 1;
      expect(update).to.not.throw(Error);
      result.should.be.an('object').and.contain.keys('id', 'name');
      result.id.should.be.a('number').and.equal(0);
      result.name.should.be.a('string').and.equal('fancy');
    });
  });
});
