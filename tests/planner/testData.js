module.exports = {
  BODY(apiKey) {
    return {
      apiKey,
      day: 'Monday',
      plannerId: 'test-planner',
      recipe: 'Some recipe',
    };
  },

  BODY_EMPTY(apiKey) {
    return { apiKey };
  },

  BODY_NO_API_KEY: {
    day: 'Monday',
    plannerId: 'test-planner',
    recipe: 'Some recipe',
  },

  BODY_API_KEY_INCORRECT: {
    apiKey: 'incorrect',
    day: 'Monday',
    plannerId: 'test-planner',
    recipe: 'Some recipe',
  },

  BODY_INCORRECT_DAY(apiKey) {
    return {
      apiKey,
      day: 'MadeupDay',
      plannerId: 'test-planner',
      recipe: 'Some recipe',
    };
  },

  constructRoute(day, apiKey, plannerId) {
    let url = '/planner?';
    if (day) {
      url += `day=${day}&`;
    }
    if (apiKey) {
      url += `apiKey=${apiKey}&`;
    }
    if (plannerId) {
      url += `plannerId=${plannerId}&`;
    }
    return url;
  },
};
