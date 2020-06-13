module.exports = {
  ADD_RECIPE_BODY(apiKey) {
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


  ADD_RECIPE_MISSING_INGREDIENTS_BODY(apiKey) {
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
};
