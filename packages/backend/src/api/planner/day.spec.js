const fetch = require('node-fetch');

const firebaseMock = require('../../mocks/firebase.json');
const { handler } = require('./day');

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

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual({
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

    expect(response.statusCode).toEqual(400);
    expect(JSON.parse(response.body)).toEqual({
      message: 'No "id" or "day" params supplied',
    });
  });

  it('should return an error', async () => {
    const response = await handler({});

    expect(response.statusCode).toEqual(500);
  });
});
