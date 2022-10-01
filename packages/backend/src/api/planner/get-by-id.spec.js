const fetch = require('node-fetch');

const firebaseMock = require('../../mocks/firebase.json');
const { handler } = require('./get-by-id');

jest.mock('node-fetch');

describe('planner/get-by-id', () => {
  beforeEach(() => {
    fetch.mockResolvedValue({ json: () => firebaseMock });
  });

  it('should get a planner by id', async () => {
    const response = await handler({
      pathParameters: {
        id: '12345',
      },
    });

    expect(JSON.parse(response.body)).toEqual({
      plan: [{
        day: 'Monday',
        recipe: 'MOCK Bacon And Leek Risotto',
      }, {
        day: 'Tuesday',
        recipe: 'Food Tuesday',
      }, {
        day: 'Wednesday',
        recipe: 'Food Wednesday',
      }, {
        day: 'Thursday',
        recipe: 'Food Thursday',
      }, {
        day: 'Friday',
        recipe: 'Food Friday',
      }, {
        day: 'Saturday',
        recipe: 'Food Saturday',
      }, {
        day: 'Sunday',
        recipe: 'Food Sunday',
      }],
      plannerId: '12345',
    });
  });

  it('should get a planner by id', async () => {
    const response = await handler({
      pathParameters: {},
    });

    expect(response.statusCode).toEqual(500);
  });
});
