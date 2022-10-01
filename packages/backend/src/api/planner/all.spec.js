const fetch = require('node-fetch');

const firebaseMock = require('../../mocks/firebase.json');
const { handler } = require('./all');

jest.mock('node-fetch');

describe('planner/all', () => {
  beforeEach(() => {
    fetch.mockResolvedValue({ json: () => firebaseMock });
  });

  it('should get all planners', async () => {
    const response = await handler();

    expect(response).not.toBeNull();
  });
});
