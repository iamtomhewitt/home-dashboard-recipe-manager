const fetch = require('node-fetch');

const firebaseMock = require('../../mocks/firebase.json');
const { handler } = require('./get-shopping-list');

jest.mock('node-fetch');

describe('recipe/get-shopping-list', () => {
  beforeEach(() => {
    fetch.mockResolvedValue({ json: () => firebaseMock });
  });

  it('should create a recipe', async () => {
    const response = await handler({
      queryStringParameters: {
        id: '12345',
      },
    });

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual([
      '3 tablespoon of Soft Cheese',
      '175g of Peas', '2 Leek(s)',
      '6 Bacon(s)',
      '700 mls of Vegetable Stock',
      '250g of Risotto Rice',
    ]);
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
