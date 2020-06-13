const { BAD_REQUEST, UNAUTHORISED } = require('../responses/codes');

module.exports = {
  checkApiKey(apiKey) {
    if (!apiKey) {
      return {
        code: BAD_REQUEST,
        message: 'No API key specified',
      };
    }

    if (apiKey !== process.env.API_KEY) {
      return {
        code: UNAUTHORISED,
        message: 'API key is incorrect',
      };
    }
    return null;
  },
};
