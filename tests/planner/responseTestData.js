const { BAD_REQUEST, UNAUTHORISED } = require('../../responses/codes');

module.exports = {
  PLANNER_ENTRY_CREATED: {
    message: 'Recipe \'Some recipe\' added',
  },

  PLANNER_ENTRY: {
    planner: {
      day: 'Monday',
      recipe: 'Some recipe',
    },
    message: 'Success',
  },

  PLANNER_BAD_REQUEST(expectedJson) {
    return {
      message: expectedJson,
    };
  },

  PLANNER_NO_API_KEY: {
    code: BAD_REQUEST,
    message: 'No API key specified',
  },

  PLANNER_API_KEY_INCORRECT: {
    code: UNAUTHORISED,
    message: 'API key is incorrect',
  },

  PLANNER_ADD_INVALID_DAY: {
    message: 'Planner could not be updated: \'MadeupDay\' not a valid day',
  },

  PLANNER_GET_INVALID_DAY: {
    message: 'Could not get planner: \'invalid\' not a valid day',
  },

  PLANNER_WRONG_ID: {
    message: "Planner ID 'invalid' could not be found",
  },
};
