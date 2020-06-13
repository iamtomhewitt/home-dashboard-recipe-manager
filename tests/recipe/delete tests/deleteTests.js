const request = require('supertest');
const assert = require('assert');

const ROUTE = '/recipes/delete';
const INVALID_NAME = 'invalid';
const NAME = 'New';

const {
  BAD_REQUEST, UNAUTHORISED, SUCCESS, NOT_FOUND,
} = require('../../../responses/codes');

const {
  RECIPE_API_KEY_INCORRECT, RECIPE_NO_API_KEY, RECIPE_NOT_FOUND, RECIPE_DELETED,
} = require('./responseData');
require('dotenv').config();

describe('Delete recipe tests', () => {
  let server;

  before(() => {
    server = require('../../../app').listen(3002);
  });

  after(() => {
    server.close();
  });

  it('should give bad request if no api key specified', (done) => {
    request(server)
      .delete(ROUTE)
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
      .delete(ROUTE)
      .send({
        name: INVALID_NAME,
        apiKey: 'incorrect',
      })
      .expect(UNAUTHORISED)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.deepEqual(response.body, RECIPE_API_KEY_INCORRECT);
        return done();
      });
  });

  it('should give not found if cannot find recipe', (done) => {
    request(server)
      .delete(ROUTE)
      .send({
        name: INVALID_NAME,
        apiKey: process.env.API_KEY,
      })
      .expect(NOT_FOUND)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.deepEqual(response.body, RECIPE_NOT_FOUND);
        return done();
      });
  });

  it('should delete a recipe', (done) => {
    request(server)
      .delete(ROUTE)
      .send({
        name: NAME,
        apiKey: process.env.API_KEY,
      })
      .expect(SUCCESS)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.deepEqual(response.body, RECIPE_DELETED);
        return done();
      });
  });
});
