import fetch from 'node-fetch';
import { Cookbook } from '../../../types/cookbook';
import { Recipe } from '../../../types/recipe';

const getData = async () => {
  const firebase = `${process.env.FIREBASE}.json`;
  const response = await fetch(firebase);
  const json = await response.json();
  return json;
};

export const findRecipe = async (name: string, id: string) => {
  const { cookbooks } = await getData();
  const cookbook = cookbooks.find((cb: Cookbook) => cb.id === id);
  const { recipes } = cookbook;
  const recipe = recipes.filter((r: Recipe) => r.name === name)[0];
  return recipe;
};

export const findCookbook = async (id: string): Promise<Cookbook> => {
  const { cookbooks } = await getData();
  const cookbook = cookbooks.find((cb: Cookbook) => cb.id === id);
  return cookbook;
};

export const saveRecipe = async (recipe: Recipe, id: string) => {
  try {
    const { cookbooks } = await getData();
    const cookbook = cookbooks.find((cb: Cookbook) => cb.id === id);
    const cookbookIndex = cookbooks.findIndex((cb: Cookbook) => cb.id === id);
    const { recipes } = cookbook;
    recipes.push(recipe);

    const updateUrl = `${process.env.FIREBASE}cookbooks/${cookbookIndex}/recipes.json`;

    await fetch(updateUrl, {
      method: 'put',
      body: JSON.stringify(recipes),
    });
  } catch (e) {
    throw new Error(`Could not save recipe: ${e}`);
  }
};

export const updateRecipe = async (recipe: Recipe, originalName: string, id: string) => {
  try {
    const { cookbooks } = await getData();
    const cookbook = cookbooks.find((cb: Cookbook) => cb.id === id);
    const cookbookIndex = cookbooks.findIndex((cb: Cookbook) => cb.id === id);
    const { recipes } = cookbook;
    const index = recipes.findIndex((r: Recipe) => r.name === originalName);
    const updateUrl = `${process.env.FIREBASE}cookbooks/${cookbookIndex}/recipes/${index}.json`;

    recipes[index] = recipe;

    await fetch(updateUrl, {
      method: 'put',
      body: JSON.stringify(recipes[index]),
    });
  } catch (e) {
    throw new Error(`Could not update recipe: ${e}`);
  }
};

export const deleteRecipe = async (name: string, id: string) => {
  try {
    const { cookbooks } = await getData();
    const cookbook = cookbooks.find((cb: Cookbook) => cb.id === id);
    const cookbookIndex = cookbooks.findIndex((cb: Cookbook) => cb.id === id);
    const { recipes } = cookbook;
    const newRecipes = recipes.filter((r: Recipe) => r.name !== name);
    const updateUrl = `${process.env.FIREBASE}cookbooks/${cookbookIndex}/recipes.json`;

    await fetch(updateUrl, {
      method: 'put',
      body: JSON.stringify(newRecipes),
    });
  } catch (e) {
    throw new Error(`Could not delete recipe: ${e}`);
  }
};