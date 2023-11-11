import fetch from 'node-fetch';

import firebaseMock from '../../../mocks/firebase.json';
import { handler } from './';

jest.mock('node-fetch');

describe('planner/update-planner', () => {
  beforeEach(() => {
    fetch.mockResolvedValue({ json: () => firebaseMock });
  });

  it('should update a planner', async () => {
    const response = await handler({
      queryStringParameters: {
        id: '12345',
      },
      body: JSON.stringify({
        day: 'Monday',
        recipe: 'Some recipe',
      }),
    });

    expect(apiResponse.statusCode).toEqual(200);
    expect(JSON.parse(apiResponse.body)).toEqual({
      message: 'Planner updated!',
    });
  });

  it('should return bad request', async () => {
    const response = await handler({
      queryStringParameters: {
        id: '12345',
      },
      body: JSON.stringify({}),
    });

    expect(apiResponse.statusCode).toEqual(400);
    expect(JSON.parse(apiResponse.body)).toEqual({
      message: 'Missing "id", "day" or "recipe"',
    });
  });

  it('should return an error', async () => {
    const response = await handler({});

    expect(apiResponse.statusCode).toEqual(500);
  });
});
