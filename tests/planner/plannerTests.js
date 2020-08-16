const request = require('supertest');
const assert = require('assert');

const {
  SUCCESS, BAD_REQUEST, UNAUTHORISED, SERVER_ERROR,
} = require('../../responses/codes');

const {
  constructRoute,
} = require('./requestData');

const {
  PLANNER_WRONG_ID, PLANNER_API_KEY_INCORRECT, PLANNER_NO_API_KEY, PLANNER_GET_INVALID_DAY, PLANNER_ENTRY,
} = require('./responseData');

const day = 'Monday';
const dayIncorrect = 'invalid';
const plannerId = 'test-planner';
const plannerIdIncorrect = 'invalid';

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
      .get(constructRoute(null, process.env.API_KEY, plannerId))
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
      .get(constructRoute(null, process.env.API_KEY, plannerIdIncorrect))
      .expect(SERVER_ERROR)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.deepEqual(response.body, PLANNER_WRONG_ID);

        return done();
      });
  });

  it('should return a recipe for a given day', (done) => {
    request(server)
      .get(constructRoute(day, process.env.API_KEY, plannerId))
      .expect(SUCCESS)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.deepEqual(response.body, PLANNER_ENTRY);
        return done();
      });
  });

  it('should give unauthorised if api key is incorrect', (done) => {
    request(server)
      .get(constructRoute(day, 'incorrect', plannerId))
      .expect(UNAUTHORISED)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.deepEqual(response.body, PLANNER_API_KEY_INCORRECT);
        return done();
      });
  });

  it('should give bad request if api key is not specified', (done) => {
    request(server)
      .get(constructRoute(day, null, plannerId))
      .expect(BAD_REQUEST)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.deepEqual(response.body, PLANNER_NO_API_KEY);
        return done();
      });
  });

  it('should give bad request if day is invalid', (done) => {
    request(server)
      .get(constructRoute(dayIncorrect, process.env.API_KEY, plannerId))
      .expect(BAD_REQUEST)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.deepEqual(response.body, PLANNER_GET_INVALID_DAY);
        return done();
      });
  });

  it('should give list of ingredients for shopping list', () => {
    request(server)
      .get(`/planner/shoppingList?plannerId=${plannerId}&apiKey=${process.env.API_KEY}`)
      .expect(SUCCESS);
  });

  it('should give bad request for shopping list if api key is incorrect', () => {
    request(server)
      .get(`/planner/shoppingList?plannerId=${plannerId}&apiKey=wrong`)
      .expect(BAD_REQUEST);
  });

  it('should give bad request for shopping list if planner id is incorrect', () => {
    request(server)
      .get(`/planner/shoppingList?plannerId=${plannerIdIncorrect}&apiKey=${process.env.API_KEY}`)
      .expect(BAD_REQUEST);
  });
});
