import fetch from 'node-fetch';

import firebaseMock from '../../../mocks/firebase.json';
import { handler } from './';

jest.mock('node-fetch');

describe('recipe/update-recipe', () => {
  beforeEach(() => {
    fetch.mockResolvedValue({ json: () => firebaseMock });
  });

  it('should update a recipe', async () => {
    const response = await handler({
      queryStringParameters: {
        id: '12345',
      },
      body: JSON.stringify({
        ingredients: [],
        name: 'A recipe',
        steps: [],
        originalName: 'Original',
      }),
    });

    expect(apiResponse.statusCode).toEqual(200);
    expect(JSON.parse(apiResponse.body)).toEqual({
      message: 'A recipe updated!',
    });
  });

  it('should return bad request', async () => {
    const response = await handler({
      queryStringParameters: {},
      body: JSON.stringify({}),
    });

    expect(apiResponse.statusCode).toEqual(400);
    expect(JSON.parse(apiResponse.body)).toEqual({
      message: '"id" is missing from query parameter',
    });
  });

  it('should return an error', async () => {
    const response = await handler({});

    expect(apiResponse.statusCode).toEqual(500);
  });
});
