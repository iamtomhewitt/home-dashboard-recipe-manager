const { BAD_REQUEST, UNAUTHORISED } = require('../../../responses/codes');

module.exports = {
  RECIPE_DELETED: {
    message: "'New' successfully deleted",
  },

  RECIPE_NOT_FOUND: {
    message: "Cannot delete recipe: 'invalid' not found",
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
