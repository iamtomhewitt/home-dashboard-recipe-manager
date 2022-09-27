const fetch = require('node-fetch');

const getData = async () => {
  const firebase = `${process.env.FIREBASE}.json`;
  const response = await fetch(firebase);
  const json = await response.json();
  return json;
}

const getPlanner = async (id) => {
  const { planners } = await getData()
  const planner = planners.find((p) => p.plannerId === id);

  if (!planner) {
    throw new Error(`Could not find planner with id '${id}'`);
  }

  return planner;
}

module.exports = {
  getData,
  getPlanner
}