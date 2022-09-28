const fetch = require('node-fetch');

const getData = async () => {
  const firebase = `${process.env.FIREBASE}.json`;
  const response = await fetch(firebase);
  const json = await response.json();
  return json;
};

const findRecipe = async (name, id) => {
  const { cookbooks } = await getData();
  const cookbook = cookbooks.find((cb) => cb.id === id);
  const { recipes } = cookbook;
  const recipe = recipes.filter((r) => r.name === name)[0];
  return recipe;
};

const findCookbook = async (id) => {
  const { cookbooks } = await getData();
  const cookbook = cookbooks.find((cb) => cb.id === id);
  return cookbook;
};

const saveRecipe = async ({ ingredients, name, steps, id }) => {
  try {
    const { cookbooks } = await getData();
    const cookbook = cookbooks.find((cb) => cb.id === id);
    const cookbookIndex = cookbooks.findIndex((cb) => cb.id === id);
    const { recipes } = cookbook;
    recipes.push({
      name,
      ingredients,
      steps,
    });

    const updateUrl = `${process.env.FIREBASE}cookbooks/${cookbookIndex}/recipes.json`;

    await fetch(updateUrl, {
      method: 'put',
      body: JSON.stringify(recipes),
    });
  } catch (e) {
    throw new Error(`Could not save recipe: ${e}`);
  }
};

const updateRecipe = async (ingredients, name, steps, originalName, id) => {
  try {
    const { cookbooks } = await getData();
    const cookbook = cookbooks.find((cb) => cb.id === id);
    const cookbookIndex = cookbooks.findIndex((cb) => cb.id === id);
    const { recipes } = cookbook;
    const index = recipes.findIndex((r) => r.name === originalName);
    const updateUrl = `${process.env.FIREBASE}cookbooks/${cookbookIndex}/recipes/${index}.json`;

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
};

const deleteRecipe = async (name, id) => {
  try {
    const { cookbooks } = await getData();
    const cookbook = cookbooks.find((cb) => cb.id === id);
    const cookbookIndex = cookbooks.findIndex((cb) => cb.id === id);
    const { recipes } = cookbook;
    const newRecipes = recipes.filter((r) => r.name !== name);
    const updateUrl = `${process.env.FIREBASE}cookbooks/${cookbookIndex}/recipes.json`;

    await fetch(updateUrl, {
      method: 'put',
      body: JSON.stringify(newRecipes),
    });
  } catch (e) {
    throw new Error(`Could not delete recipe: ${e}`);
  }
};

module.exports = {
  findRecipe,
  findCookbook,
  saveRecipe,
  updateRecipe,
  deleteRecipe,
};
