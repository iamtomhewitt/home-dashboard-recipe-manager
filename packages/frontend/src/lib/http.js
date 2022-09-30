const request = async (path, body, method) => {
  const finalUrl = `${process.env.REACT_APP_API_URL}/api${path}`;
  console.log('Making a', method, 'request to', finalUrl);
  const response = await fetch(finalUrl, {
    method,
    body: body ? JSON.stringify(body) : null,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    return response.json();
  }

  return Promise.reject(await response.json());
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
