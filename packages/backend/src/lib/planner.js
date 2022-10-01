const fetch = require('node-fetch');

const getData = async () => {
  const firebase = `${process.env.FIREBASE}.json`;
  const response = await fetch(firebase);
  const json = await response.json();
  return json;
};

const getPlanner = async (id) => {
  const { planners } = await getData();
  const planner = planners.find((p) => p.plannerId === id);

  if (!planner) {
    throw new Error(`Could not find planner with id '${id}'`);
  }

  return planner;
};

const updatePlanner = async ({ id, day, recipe }) => {
  const { planners } = await getData();
  const plannerIndex = planners.findIndex((p) => p.plannerId === id);
  const dayToUpdateIndex = planners[plannerIndex].plan.findIndex((p) => p.day === day);
  const updateUrl = `${process.env.FIREBASE}planners/${plannerIndex}/plan/${dayToUpdateIndex}/recipe.json`;

  await fetch(updateUrl, {
    method: 'put',
    body: JSON.stringify(recipe),
  });
};

module.exports = {
  getData,
  getPlanner,
  updatePlanner,
};
