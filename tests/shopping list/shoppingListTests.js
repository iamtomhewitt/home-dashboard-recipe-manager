const request = require('supertest');
const { SUCCESS, BAD_REQUEST } = require('../../responses/codes');

const plannerId = 'test-planner';
const plannerIdIncorrect = 'invalid';

describe('Shopping list tests', () => {
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
