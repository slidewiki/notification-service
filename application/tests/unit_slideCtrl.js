// example unit tests
/* eslint dot-notation: 0 */
'use strict';

//Mocking is missing completely TODO add mocked objects

describe('slideCtrl', () => {
  let expect, slideCtrl, database_helper;

  const exampleSlides = [{
    'title': 'Fancy title',
    'parent_deck_id': 56,
    'position': 3,
    'user_id': 2,
    'root_deck_id': 56,
    'language': 'de_DE'
  }, {
    'title': 'Fancy title 2',
    'parent_deck_id': 56,
    'position': 2,
    'user_id': 2,
    'root_deck_id': 57,
    'language': 'de_DE'
  }, {
    'title': 'Fancy title 3',
    'parent_deck_id': 22,
    'position': 1,
    'user_id': 2,
    'root_deck_id': 12,
    'language': 'en_EN'
  }];

  //get modules
  beforeEach((done) => {
    require('chai').should();
    expect = require('chai').expect;
    slideCtrl = require('../controllers/slideCtrl.js');
    database_helper = require('../database/helper.js');

    //cleanup the changed databases
    database_helper.cleanDatabase()
      .then(() => {
        done();
      })
      .catch((error) => {
        console.log('ERROR', error);
        done();
      });
  });

  context('when reading slides from an empty database', () => {
    it('should return an empty array of slides', () => {
      return slideCtrl.getAllSlides()
        .then((docs) => {
          expect(docs).to.not.equal(null);
          expect(docs.length).to.equal(0);
        }, (error) => {
          console.log(error);
          expect.fail('something went wrong');
        });
    });
  });

  context('when reading slides from an filled database', () => {
    it('should return the array of slides', function() {
      this.timeout(30000);

      //fill and read
      return database_helper.connectToDatabase()
        .then((db) => {
          return db.collection('slides').insert(exampleSlides)
            .then((result) => {
              expect(result.insertedCount).to.equal(3);

              db.close();

              return slideCtrl.getAllSlides()
                .then((docs) => {
                  expect(docs).to.not.equal(null);
                  expect(docs.length).to.equal(3);
                  return;
                }, (error) => {
                  console.log(error);
                  expect.fail('something went wrong');
                });
            },
          (error) => {
            db.close();
            expect.fail('connection could not established');
          });
        }, (error) => {
          expect.fail('connection could not established');
        });
    });
  });
});
