const fetch = require('node-fetch');

const firebaseMock = require('../../mocks/firebase.json');
const { handler } = require('./delete-recipe');

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

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual({
      message: 'A recipe deleted!',
    });
  });

  it('should return bad request', async () => {
    const response = await handler({
      queryStringParameters: {},
    });

    expect(response.statusCode).toEqual(400);
    expect(JSON.parse(response.body)).toEqual({
      message: '"id" is missing from query parameter',
    });
  });

  it('should return an error', async () => {
    const response = await handler({});

    expect(response.statusCode).toEqual(500);
  });
});
