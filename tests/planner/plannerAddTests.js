const request = require('supertest');
const assert = require('assert');
const {
  CREATED, BAD_REQUEST, UNAUTHORISED,
} = require('../../responses/codes');

const ROUTE = '/planner/add';
const {
  BODY, BODY_EMPTY, BODY_API_KEY_INCORRECT, BODY_INCORRECT_DAY, BODY_NO_API_KEY,
} = require('./testData');

describe('Add to planner tests', () => {
  let server;

  before(() => {
    server = require('../../app').listen(3002);
  });

  after(() => {
    server.close();
  });

  it('should create a recipe', (done) => {
    request(server)
      .post(ROUTE)
      .send(BODY(process.env.API_KEY))
      .expect(CREATED)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.equal(response.body.message, "Recipe 'Some recipe' added");
        return done();
      });
  });

  it('should give a bad request when no json in payload', (done) => {
    request(server)
      .post(ROUTE)
      .send(BODY_EMPTY(process.env.API_KEY))
      .expect(BAD_REQUEST)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        const expected = `Planner could not be updated, missing data from JSON body. Expected: {"day":"<day>","recipe":"<recipe>","plannerId":"<plannerId>"} Got: {"apiKey":"${process.env.API_KEY}"}`;
        assert.equal(response.body.message, expected);
        return done();
      });
  });

  it('should give a bad request if no api key specified', (done) => {
    request(server)
      .post(ROUTE)
      .send(BODY_NO_API_KEY)
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
      .post(ROUTE)
      .send(BODY_API_KEY_INCORRECT)
      .expect(UNAUTHORISED)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.equal(response.body.message, 'API key is incorrect');
        return done();
      });
  });

  it('should give a bad request if the day is not a valid day', (done) => {
    request(server)
      .post(ROUTE)
      .send(BODY_INCORRECT_DAY(process.env.API_KEY))
      .expect(BAD_REQUEST)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.equal(response.body.message, "Planner could not be updated: 'MadeupDay' not a valid day");
        return done();
      });
  });
});
