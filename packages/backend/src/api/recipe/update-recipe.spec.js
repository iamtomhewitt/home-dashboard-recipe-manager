const fetch = require('node-fetch');

const firebaseMock = require('../../mocks/firebase.json');
const { handler } = require('./update-recipe');

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

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual({
      message: 'A recipe updated!',
    });
  });

  it('should return bad request', async () => {
    const response = await handler({
      queryStringParameters: {},
      body: JSON.stringify({}),
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
