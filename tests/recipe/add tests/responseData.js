const { BAD_REQUEST, UNAUTHORISED } = require('../../../responses/codes');

module.exports = {
  RECIPE_CREATED: {
    message: "Recipe 'New' added",
  },

  RECIPE_BAD_REQUEST(message) {
    return {
      message,
    };
  },

  RECIPE_EXISTS: {
    message: "Cannot add recipe: 'New' already exists",
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
