import config from '../config';

const request = async (url, body, method) => {
  console.log('Making a', method, 'request to', `${config.baseUrl}${url}`);
  const response = await fetch(`${config.baseUrl}${url}`, {
    method,
    body: body ? JSON.stringify(body) : null,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const json = await response.json();
    return {
      status: response.status,
      error: json.message,
    };
  }

  const json = await response.json();
  return json;
};

const get = async (url) => {
  const json = await request(url, null, 'GET');
  return json;
};

const post = async (url, body) => {
  const json = await request(url, body, 'POST');
  return json;
};

const put = async (url, body) => {
  const json = await request(url, body, 'PUT');
  return json;
};

const remove = async (url) => {
  const json = await request(url, null, 'DELETE');
  return json;
};

const http = {
  get,
  delete: remove,
  post,
  put,
};

export default http;
