import fetch from 'node-fetch';
import { Recipe } from '../../../types/recipe';
import { Planner } from '../../../types/planner';

export const getData = async (): Promise<{ planners: Planner[] }> => {
  const firebase = `${process.env.FIREBASE}.json`;
  const response = await fetch(firebase);
  const json = await response.json();
  return json;
};

export const getPlanner = async (id: string) => {
  const { planners } = await getData();
  const planner = planners.find((p: Planner) => p.plannerId === id);

  if (!planner) {
    throw new Error(`Could not find planner with id '${id}'`);
  }

  return planner;
};

export const updatePlanner = async (id: string, day: string, recipe: Recipe) => {
  const { planners } = await getData();
  const plannerIndex = planners.findIndex((p: Planner) => p.plannerId === id);
  const dayToUpdateIndex = planners[plannerIndex].plan.findIndex((p) => p.day === day);
  const updateUrl = `${process.env.FIREBASE}planners/${plannerIndex}/plan/${dayToUpdateIndex}/recipe.json`;

  await fetch(updateUrl, {
    method: 'put',
    body: JSON.stringify(recipe),
  });
};