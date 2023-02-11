import api from '.';

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({ message: 'some message' }),
  ok: true,
}));

describe('api', () => {
  it('should make GET request', async () => {
    const { message } = await api.get('url');
    expect(message).toEqual('some message');
  });

  it('should make POST request', async () => {
    const { message } = await api.post('url', { body: 'some body' });
    expect(message).toEqual('some message');
  });

  it('should make PUT request', async () => {
    const { message } = await api.put('url', { body: 'some body' });
    expect(message).toEqual('some message');
  });

  it('should make DELETE request', async () => {
    const { message } = await api.delete('url');
    expect(message).toEqual('some message');
  });

  it('should handle errors', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ message: 'some message' }),
      ok: false,
      status: 500,
    }));
    const { status, error } = await api.get('url');
    expect(status).toEqual(500);
    expect(error).toEqual('some message');
  });
});
