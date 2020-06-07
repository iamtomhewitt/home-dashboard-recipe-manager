const request = require('supertest');
const assert = require('assert');
const {
  SUCCESS, BAD_REQUEST, UNAUTHORISED, SERVER_ERROR,
} = require('../../responses/codes');
const {
  constructRoute,
} = require('./testData');

describe('Planner tests', () => {
  let server;

  before((done) => {
    server = require('../../app').listen(3002);
    setTimeout(() => {
      done();
    }, 1000);
  });

  after(() => {
    server.close();
  });

  it('should fetch a planner', (done) => {
    request(server)
      .get(constructRoute(null, process.env.API_KEY, 'test-planner'))
      .expect(SUCCESS)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.notEqual(response.body.planner, undefined);

        return done();
      });
  });

  it('should return an error when fetching a non-existant planner', (done) => {
    request(server)
      .get(constructRoute(null, process.env.API_KEY, 'wrong'))
      .expect(SERVER_ERROR)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.equal(response.body.code, 500);
        assert.equal(response.body.message, "Planner ID 'wrong' could not be found");

        return done();
      });
  });

  it('should return a recipe for a given day', (done) => {
    request(server)
      .get(constructRoute('Monday', process.env.API_KEY, 'test-planner'))
      .expect(SUCCESS)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.equal(response.body.planner.day, 'Monday');
        assert.equal(response.body.message, 'Success');
        return done();
      });
  });

  it('should give unauthorised if api key is incorrect', (done) => {
    request(server)
      .get(constructRoute('Monday', 'incorrect', 'test-planner'))
      .expect(UNAUTHORISED)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.equal(response.body.message, 'API key is incorrect');
        return done();
      });
  });

  it('should give bad request if api key is not specified', (done) => {
    request(server)
      .get(constructRoute('Monday', null, 'test-planner'))
      .expect(BAD_REQUEST)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.equal(response.body.message, 'No API key specified');
        return done();
      });
  });

  it('should give bad request if day is invalid', (done) => {
    request(server)
      .get(constructRoute('invalid', process.env.API_KEY, 'test-planner'))
      .expect(BAD_REQUEST)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.equal(response.body.message, 'Could not get planner: \'invalid\' not a valid day');
        return done();
      });
  });
});
