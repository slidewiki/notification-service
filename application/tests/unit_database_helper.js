// example unit tests
'use strict';

//Mocking is missing completely TODO add mocked objects

describe('Database', () => {
  let helper, tempDatabase = 'AwesomeMoo3000';

  //get modules
  beforeEach((done) => {
    Object.keys(require.cache).forEach((key) => delete require.cache[key]);
    helper = require('../database/helper.js');
    require('chai').should();
    let chai = require('chai');
    let chaiAsPromised = require('chai-as-promised');
    chai.use(chaiAsPromised);
    helper.cleanDatabase(tempDatabase)
      .then(() => done())
      .catch((error) => done(error));
  });

  context('when connecting to an existing database', () => {
    it('should return the correct connection object', () => {

      let db = helper.connectToDatabase('local');
      return Promise.all([
        db.should.be.fulfilled,
        db.should.eventually.not.be.empty,
        db.should.eventually.have.property('s').that.is.not.empty,
        db.should.eventually.have.deep.property('s.databaseName', 'local')
      ]);
    });

    it('should be possible to call cleanup', () => {
      return helper.cleanDatabase('local').should.be.fulfilled;
    });
  });

  context('when connecting to a not existing database', () => {
    it('should be an empty database', () => {
      let col = helper.connectToDatabase('AwesomeMoo2000').then((db) => db.collections());
      return Promise.all([
        col.should.be.fulfilled,
        col.should.eventually.have.property('length', 0)
      ]);
    });
  });

  context('when creating a new database', () => {
    it('should contain only one collection with one object', () => {
      let cols = helper.createDatabase(tempDatabase).then((db) => db.collections);
      let col = helper.createDatabase(tempDatabase).then((db) => db.collection('test'));
      return Promise.all([
        cols.should.be.fulfilled,
        cols.should.eventually.have.property('length', 1),
        col.should.be.fulfilled,
        col.then((col) => col.count()).should.eventually.not.equal(0)
      ]);
    });
  });
});
