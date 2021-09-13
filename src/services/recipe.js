const fetch = require('node-fetch');

module.exports = {

  async getData() {
    const firebase = `${process.env.FIREBASE}.json`;
    const response = await fetch(firebase);
    const json = await response.json();
    return json;
  },

  async findRecipe(name) {
    const { recipes } = await this.getData();
    const recipe = recipes.filter((r) => r.name === name)[0];
    return recipe;
  },

  async saveRecipe(ingredients, name, steps) {
    try {
      const updateUrl = `${process.env.FIREBASE}recipes.json`;
      const { recipes } = await this.getData();
      recipes.push({
        name,
        ingredients,
        steps,
      });

      await fetch(updateUrl, {
        method: 'put',
        body: JSON.stringify(recipes),
      });
    } catch (e) {
      throw new Error(`Could not save recipe: ${e}`);
    }
  },

  async updateRecipe(ingredients, name, steps) {
    try {
      const { recipes } = await this.getData();
      const index = recipes.findIndex((r) => r.name === name);
      const updateUrl = `${process.env.FIREBASE}recipes/${index}.json`;

      recipes[index] = {
        name,
        ingredients,
        steps,
      };

      await fetch(updateUrl, {
        method: 'put',
        body: JSON.stringify(recipes[index]),
      });
    } catch (e) {
      throw new Error(`Could not update recipe: ${e}`);
    }
  },

  async deleteRecipe(name) {
    try {
      const { recipes } = await this.getData();
      const newRecipes = recipes.filter((r) => r.name !== name);
      const updateUrl = `${process.env.FIREBASE}recipes.json`;

      await fetch(updateUrl, {
        method: 'put',
        body: JSON.stringify(newRecipes),
      });
    } catch (e) {
      throw new Error(`Could not update recipe: ${e}`);
    }
  },
};
