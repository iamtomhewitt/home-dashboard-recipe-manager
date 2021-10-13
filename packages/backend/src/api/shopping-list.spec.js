const express = require('express');
const fetch = require('node-fetch');
const request = require('supertest');

const expressLoader = require('../loaders/express');
const firebaseMock = require('../mocks/firebase.json');

jest.mock('node-fetch');

describe('shopping list', () => {
  let mockServer;

  beforeEach(async () => {
    const app = express();
    await expressLoader(app);

    mockServer = app.listen(process.env.PORT || 3002, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });

    fetch.mockResolvedValue({ json: () => firebaseMock });
  });

  afterEach(() => {
    mockServer.close();
  });

  it('should get a shopping list', async () => {
    const response = await request(mockServer).get('/api/shoppingList?id=12345');
    expect(response.body).toEqual([
      '3 tablespoon of Soft Cheese',
      '175g of Peas',
      '2 Leek(s)',
      '6 Bacon(s)',
      '250g of Risotto Rice',
      '700 mls of Vegetable Stock',
    ]);
    expect(response.statusCode).toBe(200);
  });
});
