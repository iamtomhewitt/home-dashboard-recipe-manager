const { badRequest, unauthorised } = require('../responses/responses');

module.exports = {
  checkApiKey(apiKey) {
    if (!apiKey) {
      return badRequest('No API key specified');
    }

    if (apiKey !== process.env.API_KEY) {
      return unauthorised('API key is incorrect');
    }

    return null;
  },
};
