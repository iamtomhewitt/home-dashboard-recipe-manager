const fetch = require('node-fetch');

const getData = async () => {
  const firebase = `${process.env.FIREBASE}.json`;
  const response = await fetch(firebase);
  const json = await response.json();
  return json;
}

module.exports = {
  getData
}