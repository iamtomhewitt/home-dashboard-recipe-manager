import fetch from 'node-fetch';

import firebaseMock from '../../../mocks/firebase.json';
import { handler } from './';

jest.mock('node-fetch');

describe('recipe/delete-recipe', () => {
  beforeEach(() => {
    fetch.mockResolvedValue({ json: () => firebaseMock });
  });

  it('should delete a recipe', async () => {
    const response = await handler({
      queryStringParameters: {
        id: '12345',
        name: 'A recipe',
      },
    });

    expect(apiResponse.statusCode).toEqual(200);
    expect(JSON.parse(apiResponse.body)).toEqual({
      message: 'A recipe deleted!',
    });
  });

  it('should return bad request', async () => {
    const response = await handler({
      queryStringParameters: {},
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