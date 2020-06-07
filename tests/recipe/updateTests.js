const request = require('supertest');
const assert = require('assert');

const ROUTE = '/recipes/update';
const { BODY_UPDATE_RECIPE } = require('./testData');
const {
  BAD_REQUEST, UNAUTHORISED, CREATED, SUCCESS,
} = require('../../responses/codes');
require('dotenv').config();

describe('Update recipe tests', () => {
  let server;

  before(() => {
    server = require('../../app').listen(3002);
  });

  after(() => {
    server.close();
  });

  it('should create a recipe if trying to update a recipe that does not exist', (done) => {
    request(server)
      .put(ROUTE)
      .send(BODY_UPDATE_RECIPE(process.env.API_KEY))
      .expect(CREATED)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.equal(response.body.message, "'test' could not be updated as it does not exist, so it was created instead");
        return done();
      });
  });

  it('should update an existing recipe', (done) => {
    request(server)
      .put(ROUTE)
      .send(BODY_UPDATE_RECIPE(process.env.API_KEY))
      .expect(SUCCESS)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.equal(response.body.message, "'testNew' successfully updated");
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

        assert.equal(response.body.message, 'No API key specified');
        return done();
      });
  });

  it('should give unauthorised if api key is incorrect', (done) => {
    request(server)
      .put(ROUTE)
      .send(BODY_UPDATE_RECIPE('incorrect'))
      .expect(UNAUTHORISED)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.equal(response.body.message, 'API key is incorrect');
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
        assert.equal(response.body.message, expectedMessage);
        return done();
      });
  });
});
