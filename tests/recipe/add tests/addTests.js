const request = require('supertest');
const assert = require('assert');
const {
  BAD_REQUEST, UNAUTHORISED, CREATED, SERVER_ERROR,
} = require('../../../responses/codes');
const {
  RECIPE_CREATED, RECIPE_BAD_REQUEST, RECIPE_EXISTS, RECIPE_API_KEY_INCORRECT, RECIPE_NO_API_KEY,
} = require('./responseData');
const { ADD_RECIPE_BODY, ADD_RECIPE_MISSING_INGREDIENTS_BODY } = require('./requestData');

const ROUTE = '/recipes/add';
require('dotenv').config();

describe('Add recipe tests', () => {
  let server;

  before(() => {
    server = require('../../../app').listen(3002);
  });

  after(() => {
    server.close();
  });

  it('should give created when called with json payload', (done) => {
    request(server)
      .post(ROUTE)
      .send(ADD_RECIPE_BODY(process.env.API_KEY))
      .expect(CREATED)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.deepEqual(response.body, RECIPE_CREATED);
        return done();
      });
  });

  it('should give bad request when missing parameters in ingredients', (done) => {
    request(server)
      .post(ROUTE)
      .send(ADD_RECIPE_MISSING_INGREDIENTS_BODY(process.env.API_KEY))
      .expect(BAD_REQUEST)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        // eslint-disable-next-line max-len
        const expectedMessage = `Recipe could not be added, missing data from JSON body. Expected: {"name":"<recipe name>","serves":"<optional>","ingredients":[{"name":"<name>","category":"<category>","amount":"<amount>","weight":"<weight>"}],"steps":["1. Example","2. Example"]} Got: {"name":"Missing","serves":1,"ingredients":[{"name":"pepper"},{"name":"chicken"}],"steps":["1. Do something","2. Do something else"],"apiKey":"${process.env.API_KEY}"}`;
        assert.deepEqual(response.body, RECIPE_BAD_REQUEST(expectedMessage));
        return done();
      });
  });

  it('should give error when adding an existing recipe', (done) => {
    request(server)
      .post(ROUTE)
      .send(ADD_RECIPE_BODY(process.env.API_KEY))
      .expect(SERVER_ERROR)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.deepEqual(response.body, RECIPE_EXISTS);
        return done();
      });
  });

  it('should give bad request when missing data in request body', (done) => {
    request(server)
      .post(ROUTE)
      .send({ apiKey: process.env.API_KEY })
      .expect(BAD_REQUEST)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        // eslint-disable-next-line max-len
        const expectedMessage = `Recipe could not be added, missing data from JSON body. Expected: {"name":"<recipe name>","serves":"<optional>","ingredients":[{"name":"<name>","category":"<category>","amount":"<amount>","weight":"<weight>"}],"steps":["1. Example","2. Example"]} Got: {"apiKey":"${process.env.API_KEY}"}`;
        assert.deepEqual(response.body, RECIPE_BAD_REQUEST(expectedMessage));
        return done();
      });
  });

  it('should give unauthorised if api key is incorrect', (done) => {
    request(server)
      .post(ROUTE)
      .send({ apiKey: 'incorrect' })
      .expect(UNAUTHORISED)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.deepEqual(response.body, RECIPE_API_KEY_INCORRECT);
        return done();
      });
  });

  it('should give bad request if api is not specified', (done) => {
    request(server)
      .post(ROUTE)
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
});
