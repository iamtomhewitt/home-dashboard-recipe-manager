module.exports = {
  constructRecipeRoute(apiKey) {
    let url = '/recipes';
    if (apiKey) {
      url += `?apiKey=${apiKey}`;
    }
    return url;
  },

  BODY_ADD_RECIPE(apiKey) {
    return {
      name: 'New',
      serves: 2,
      ingredients: [
        {
          name: 'pepper',
          category: 'vegetable',
          amount: 100,
          weight: 'grams',
        },
        {
          name: 'chicken',
          category: 'meat',
          amount: 300,
          weight: 'grams',
        },
      ],
      steps: [
        '1. Do something',
        '2. Do something else',
      ],
      apiKey,
    };
  },

  BODY_ADD_RECIPE_MISSING_INGREDIENTS(apiKey) {
    return {
      name: 'Missing',
      serves: 1,
      ingredients: [
        {
          name: 'pepper',
        },
        {
          name: 'chicken',
        },
      ],
      steps: [
        '1. Do something',
        '2. Do something else',
      ],
      apiKey,
    };
  },

  BODY_UPDATE_RECIPE(apiKey) {
    return {
      originalName: 'test',
      newName: 'testNew',
      ingredients: [
        {
          name: '1',
          category: '2',
          amount: '3',
          weight: '4',
        },
      ],
      steps: [
        '1. Do something',
        '2. Do something else',
      ],
      apiKey,
    };
  },
};
