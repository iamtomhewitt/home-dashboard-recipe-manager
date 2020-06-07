const request = require('supertest');
const assert = require('assert');
const { constructRecipeRoute } = require('./testData');
const {
  SUCCESS, BAD_REQUEST, UNAUTHORISED,
} = require('../../responses/codes');
require('dotenv').config();

describe('Recipe tests', () => {
  let server;

  before((done) => {
    server = require('../../app').listen(3002);
    setTimeout(() => {
      done();
    }, 500);
  });

  after(() => {
    server.close();
  });

  it('should return recipes', (done) => {
    request(server)
      .get(constructRecipeRoute(process.env.API_KEY))
      .expect(SUCCESS, done);
  });

  it('should give bad request when no api key specified', (done) => {
    request(server)
      .get(constructRecipeRoute(null))
      .expect(BAD_REQUEST)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.equal(response.body.message, 'No API key specified');
        return done();
      });
  });

  it('should give unauthorised when api key is incorrect', (done) => {
    request(server)
      .get(constructRecipeRoute('incorrect'))
      .expect(UNAUTHORISED)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.equal(response.body.message, 'API key is incorrect');
        return done();
      });
  });
});
