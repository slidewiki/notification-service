// example unit tests
/* eslint dot-notation: 0 */
'use strict';

//Mocking is missing completely TODO add mocked objects

describe('Database', () => {
  let expect, helper, tempDatabase = 'AwesomeMoo3000';

  //get modules
  beforeEach((done) => {
    require('chai').should();
    expect = require('chai').expect;
    helper = require('../database/helper.js');
    done();
  });

  //cleanup the changed databases
  //TODO wait until database is cleaned up
  afterEach((done) => {
    helper.cleanDatabase(null, tempDatabase)
      .then((db) => {
        console.log(tempDatabase + ' cleaned');
        db.close();
      });
    done();
  });

  context('when connecting to an existing database', () => {
    it('should return the correct connection object', () => {
      return helper.connectToDatabase('local')
        .then((db) => {
          expect(db).to.not.equal(undefined);
          expect(db).to.not.equal(null);
          expect(db.s).to.not.equal(undefined);
          expect(db.s.databaseName).to.not.equal(undefined);
          expect(db.s.databaseName).to.equal('local');
          db.close();
        },
        (error) => expect.fail('connection could not established'));
    });

    it('should be possible to call cleanup', () => {
      return helper.cleanDatabase(null, 'local')
        .then(() => {
          //correct
        },
        (error) => expect.fail('connection could not established'));
    });
  });

  context('when connecting to a not existing database', () => {
    it('should be an empty database', (done) => {
      return helper.connectToDatabase('AwesomeMoo2000')
        .then((db) => {
          db.collections(function(err, collections) {
            expect(collections.length).to.equals(0);  //only one collection (standard)
            db.close();
            done();
          });
        },
        (error) => {
          expect.fail('connection could not established');
          done();
        });
    });
  });

  context('when creating a new database', () => {
    it('should contain only one collection with one object', (done) => {
      return helper.createDatabase(tempDatabase)
        .then((db) => {
          db.collections(function(err, collections) {
            expect(collections.length).to.equals(1);
            db.collection('test').count((err, number) => {
              expect(err).to.equals(null);
              expect(number).to.equals(1);
              db.close();
              done();
            });
          });
        },
        (error) => {
          expect.fail('connection to new database could not established');
          done();
        });
    });
  });
});
