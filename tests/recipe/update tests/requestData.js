module.exports = {
  UPDATE_RECIPE_BODY(apiKey) {
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
