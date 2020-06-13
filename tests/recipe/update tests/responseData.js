const { BAD_REQUEST, UNAUTHORISED } = require('../../../responses/codes');

module.exports = {
  RECIPE_CREATED: {
    message: "'test' could not be updated as it does not exist, so it was created instead",
  },

  RECIPE_UPDATED: {
    message: "'testNew' successfully updated",
  },

  RECIPE_BAD_REQUEST(message) {
    return {
      message,
    };
  },

  RECIPE_API_KEY_INCORRECT: {
    code: UNAUTHORISED,
    message: 'API key is incorrect',
  },

  RECIPE_NO_API_KEY: {
    code: BAD_REQUEST,
    message: 'No API key specified',
  },
};
