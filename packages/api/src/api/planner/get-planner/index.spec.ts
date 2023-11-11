import fetch from 'node-fetch';

import firebaseMock from '../../../mocks/firebase.json';
import { handler } from './';

jest.mock('node-fetch');

describe('get-planner', () => {
  beforeEach(() => {
    fetch.mockResolvedValue({ json: () => firebaseMock });
  });

  it('should get a planner by id', async () => {
    const response = await handler({
      pathParameters: {
        id: '12345',
      },
    });

    expect(JSON.parse(apiResponse.body)).toEqual({
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

  it('should throw an error when an id is not specified', async () => {
    const response = await handler({
      pathParameters: {},
    });

    expect(apiResponse.statusCode).toEqual(500);
  });
});
