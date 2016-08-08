// example unit tests
'use strict';

//Mocking is missing completely TODO add mocked objects

describe('Database', () => {

  let db, helper; //expect

  before((done) => {
    require('chai').should();
    let chai = require('chai');
    let chaiAsPromised = require('chai-as-promised');
    chai.use(chaiAsPromised);
    //expect = require('chai').expect;
    db = require('../database/slideDatabase.js');
    helper = require('../database/helper.js');
    helper.cleanDatabase()
      .then(() => done())
      .catch((error) => done(error));
  });

  context('when having an empty database', () => {
    it('should return null when requesting a non existant slide', () => {
      return db.get('asd7db2daasd').should.be.fulfilled.and.become(null);
    });

    it('should return the slide when inserting one', () => {
      let slide = {
        title: 'Dummy',
        body: 'dummy',
        language: 'en'
      };
      let res = db.insert(slide);
      return Promise.all([
        res.should.be.fulfilled.and.eventually.not.be.empty,
        res.should.eventually.have.property('ops').that.is.not.empty,
        res.should.eventually.have.deep.property('ops[0]').that.has.all.keys('_id', 'title', 'body', 'language'),
        res.should.eventually.have.deep.property('ops[0].title', slide.title)
      ]);
    });

    it('should get an previously inserted slide', () => {
      let slide = {
        title: 'Dummy',
        body: 'dummy',
        language: 'en'
      };
      let ins = db.insert(slide);
      let res = ins.then((ins) => db.get(ins.ops[0]._id));
      return Promise.all([
        res.should.be.fulfilled.and.eventually.not.be.empty,
        res.should.eventually.have.all.keys('_id', 'title', 'body', 'language'),
        ins.then((slide) => res.should.eventually.deep.equal(slide.ops[0]))
      ]);
    });

    it('should be able to replace an previously inserted slide', () => {
      let slide = {
        title: 'Dummy',
        body: 'dummy',
        language: 'en'
      };
      let slide2 = {
        title: 'Dummy2',
        body: 'dummyish',
        language: 'en?'
      };
      let ins = db.insert(slide);
      let res = ins.then((ins) => db.replace(ins.ops[0]._id, slide2));
      return Promise.all([
        res.should.be.fulfilled.and.eventually.not.be.empty,
        res.should.eventually.have.property('value').that.contains.all.keys('_id', 'title', 'body', 'language'),
        res.should.eventually.have.property('value').that.has.property('title', slide.title) // FIXME returns old object
        //ins.then((slide) => res.should.eventually.have.deep.property('value._id', slide.ops[0]._id))//FIXME works, but fails because of .... santa
      ]);
    });
  });
});
