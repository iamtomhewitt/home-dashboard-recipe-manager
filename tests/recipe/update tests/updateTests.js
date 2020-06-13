const request = require('supertest');
const assert = require('assert');

const ROUTE = '/recipes/update';

const {
  BAD_REQUEST, UNAUTHORISED, CREATED, SUCCESS,
} = require('../../../responses/codes');

const {
  RECIPE_CREATED, RECIPE_UPDATED, RECIPE_NO_API_KEY, RECIPE_API_KEY_INCORRECT, RECIPE_BAD_REQUEST,
} = require('./responseData');
const { UPDATE_RECIPE_BODY } = require('./requestData');
require('dotenv').config();

describe('Update recipe tests', () => {
  let server;

  before(() => {
    server = require('../../../app').listen(3002);
  });

  after(() => {
    server.close();
  });

  it('should create a recipe if trying to update a recipe that does not exist', (done) => {
    request(server)
      .put(ROUTE)
      .send(UPDATE_RECIPE_BODY(process.env.API_KEY))
      .expect(CREATED)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.deepEqual(response.body, RECIPE_CREATED);
        return done();
      });
  });

  it('should update an existing recipe', (done) => {
    request(server)
      .put(ROUTE)
      .send(UPDATE_RECIPE_BODY(process.env.API_KEY))
      .expect(SUCCESS)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.deepEqual(response.body, RECIPE_UPDATED);
        return done();
      });
  });

  it('should give bad request if api key not specified', (done) => {
    request(server)
      .put(ROUTE)
      .send({})
      .expect(BAD_REQUEST)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.deepEqual(response.body, RECIPE_NO_API_KEY);
        return done();
      });
  });

  it('should give unauthorised if api key is incorrect', (done) => {
    request(server)
      .put(ROUTE)
      .send(UPDATE_RECIPE_BODY('incorrect'))
      .expect(UNAUTHORISED)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.deepEqual(response.body, RECIPE_API_KEY_INCORRECT);
        return done();
      });
  });

  it('should give bad request if request body is incorrect', (done) => {
    request(server)
      .put(ROUTE)
      .send({
        apiKey: process.env.API_KEY,
      })
      .expect(BAD_REQUEST)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        // eslint-disable-next-line max-len
        const expectedMessage = `Recipe could not be updated, missing data from JSON body. Expected: {"originalName":"<recipe name>","newName":"<recipe name>","serves":"<serves>","ingredients":[{"name":"<name>","category":"<category>","amount":"<amount>","weight":"<weight>"}],"steps":["1. Example","2. Example"]} Got: {"apiKey":"${process.env.API_KEY}"} ('newName' is an optional parameter)`;
        assert.deepEqual(response.body, RECIPE_BAD_REQUEST(expectedMessage));
        return done();
      });
  });
});
