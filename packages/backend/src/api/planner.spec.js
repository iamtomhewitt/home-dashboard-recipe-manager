const express = require('express');
const fetch = require('node-fetch');
const request = require('supertest');

const expressLoader = require('../loaders/express');
const firebaseMock = require('../mocks/firebase.json');

jest.mock('node-fetch');

describe('planner', () => {
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

  it('should get a planner', async () => {
    const response = await request(mockServer).get('/api/planner/12345');
    expect(response.body.plan).not.toBeNull();
    expect(response.statusCode).toBe(200);
  });

  it('should return an error when trying to get a planner', async () => {
    fetch.mockRejectedValue(new Error('test error'));
    const response = await request(mockServer).get('/api/planner/12345');
    expect(response.body.message).toEqual('test error');
    expect(response.statusCode).toBe(500);
  });
});
