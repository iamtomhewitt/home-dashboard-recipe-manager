const fetch = require('node-fetch');

module.exports = {

  async getData() {
    const firebase = process.env.FIREBASE + '.json';
    const response = await fetch(firebase);
    const json = await response.json();
    return json;
  },

  async saveRecipe(ingredients, name, steps) {
    try {
      const updateUrl = `${process.env.FIREBASE}/recipes.json`;
      const { recipes } = await this.getData();
      recipes.push({
        name,
        ingredients,
        steps
      });

      await fetch(updateUrl, {
        method: 'put',
        body: JSON.stringify(recipes)
      })
    } catch (e) {
      throw new Error(`Could not save recipe: ${e}`)
    }
  }
}