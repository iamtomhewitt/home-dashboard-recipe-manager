import fetch from 'node-fetch';

import firebaseMock from '../../../mocks/firebase.json';
import { handler } from './';

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
