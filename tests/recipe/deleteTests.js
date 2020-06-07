const request = require('supertest');
const assert = require('assert');

const ROUTE = '/recipes/delete';
const {
  BAD_REQUEST, UNAUTHORISED, SUCCESS, NOT_FOUND,
} = require('../../responses/codes');
require('dotenv').config();

describe('Delete recipe tests', () => {
  let server;

  before(() => {
    server = require('../../app').listen(3002);
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

        assert.equal(response.body.message, 'No API key specified');
        return done();
      });
  });

  it('should give unauthorised if api key is incorrect', (done) => {
    request(server)
      .delete(ROUTE)
      .send({
        name: 'invalid',
        apiKey: 'incorrect',
      })
      .expect(UNAUTHORISED)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.equal(response.body.message, 'API key is incorrect');
        return done();
      });
  });

  it('should give not found if cannot find recipe', (done) => {
    request(server)
      .delete(ROUTE)
      .send({
        name: 'invalid',
        apiKey: process.env.API_KEY,
      })
      .expect(NOT_FOUND)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.equal(response.body.message, "Cannot delete recipe: 'invalid' not found");
        return done();
      });
  });

  it('should delete a recipe', (done) => {
    request(server)
      .delete(ROUTE)
      .send({
        name: 'New',
        apiKey: process.env.API_KEY,
      })
      .expect(SUCCESS)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        assert.equal(response.body.message, "'New' successfully deleted");
        return done();
      });
  });
});
