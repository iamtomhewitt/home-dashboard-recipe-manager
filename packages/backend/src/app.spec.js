const express = require('express');
const request = require('supertest');

const expressLoader = require('./loaders/express');

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
  });

  afterEach(() => {
    mockServer.close();
  });

  it('should get app info', async () => {
    const response = await request(mockServer).get('/api/health');
    expect(response.body.status).toEqual('UP');
    expect(response.statusCode).toBe(200);
  });
});
