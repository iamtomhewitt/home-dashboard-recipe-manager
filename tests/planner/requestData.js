const recipe = 'Some recipe';
const plannerId = 'test-planner';
const day = 'Monday';

module.exports = {

  BODY(apiKey) {
    return {
      apiKey,
      day,
      plannerId,
      recipe,
    };
  },

  BODY_EMPTY(apiKey) {
    return { apiKey };
  },

  BODY_NO_API_KEY: {
    day,
    plannerId,
    recipe,
  },

  BODY_API_KEY_INCORRECT: {
    apiKey: 'incorrect',
    day,
    plannerId,
    recipe,
  },

  BODY_INCORRECT_DAY(apiKey) {
    return {
      apiKey,
      day: 'MadeupDay',
      plannerId,
      recipe,
    };
  },

  constructRoute(dayToUse, apiKey, plannerIdToUse) {
    let url = '/planner?';
    if (dayToUse) {
      url += `day=${dayToUse}&`;
    }
    if (apiKey) {
      url += `apiKey=${apiKey}&`;
    }
    if (plannerIdToUse) {
      url += `plannerId=${plannerIdToUse}&`;
    }
    return url;
  },
};
