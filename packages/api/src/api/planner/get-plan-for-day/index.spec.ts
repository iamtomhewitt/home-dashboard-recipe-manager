import fetch from 'node-fetch';

import firebaseMock from '../../../mocks/firebase.json';
import { handler } from './';

jest.mock('node-fetch');

describe('planner/day', () => {
  beforeEach(() => {
    fetch.mockResolvedValue({ json: () => firebaseMock });
  });

  it('should get a plan for a day', async () => {
    const response = await handler({
      queryStringParameters: {
        id: '12345',
        day: 'Monday',
      },
    });

    expect(apiResponse.statusCode).toEqual(200);
    expect(JSON.parse(apiResponse.body)).toEqual({
      day: 'Monday',
      recipe: 'MOCK Bacon And Leek Risotto',
    });
  });

  it('should return bad request if no day or id', async () => {
    const response = await handler({
      queryStringParameters: {
        id: '12345',
      },
    });

    expect(apiResponse.statusCode).toEqual(400);
    expect(JSON.parse(apiResponse.body)).toEqual({
      message: 'No "id" or "day" params supplied',
    });
  });

  it('should return an error', async () => {
    const response = await handler({});

    expect(apiResponse.statusCode).toEqual(500);
  });
});
