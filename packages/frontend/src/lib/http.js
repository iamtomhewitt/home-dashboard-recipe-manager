import config from '../config';

const request = async (path, body, method) => {
  const finalUrl = `${config.baseUrl}/api${path}`;
  console.log('Making a', method, 'request to', finalUrl);
  const response = await fetch(finalUrl, {
    method,
    body: body ? JSON.stringify(body) : null,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const json = await response.json();

  if (!response.ok) {
    return {
      status: response.status,
      error: json.message,
    };
  }

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
