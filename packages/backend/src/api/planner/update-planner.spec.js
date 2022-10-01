const fetch = require('node-fetch');

const firebaseMock = require('../../mocks/firebase.json');
const { handler } = require('./update-planner');

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

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual({
      message: 'Planner updated!',
    });
  });

  it('should return bad request', async () => {
    const response = await handler({
      queryStringParameters: {
        id: '12345',
      },
      body: JSON.stringify({ }),
    });

    expect(response.statusCode).toEqual(400);
    expect(JSON.parse(response.body)).toEqual({
      message: 'Missing "id", "day" or "recipe"',
    });
  });

  it('should return an error', async () => {
    const response = await handler({ });

    expect(response.statusCode).toEqual(500);
  });
});
