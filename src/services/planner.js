const fetch = require('node-fetch');

module.exports = {

  async getData() {
    const firebase = `${process.env.FIREBASE}.json`;
    const response = await fetch(firebase);
    const json = await response.json();
    return json;
  },

  async getPlanner(id) {
    const { planners } = await this.getData();
    const planner = planners.find((p) => p.plannerId === id);
    if (!planner) {
      throw new Error(`Could not find planner with id '${id}'`);
    }
    return planner;
  },

  async updatePlanner(id, body) {
    try {
      const { day, recipe } = body;
      const { planners } = await this.getData();
      const plannerIndex = planners.findIndex((p) => p.plannerId === id);
      const dayToUpdateIndex = planners[plannerIndex].plan.findIndex((p) => p.day === day);
      const updateUrl = `${process.env.FIREBASE}planners/${plannerIndex}/plan/${dayToUpdateIndex}/recipe.json`;

      await fetch(updateUrl, {
        method: 'put',
        body: JSON.stringify(recipe),
      });
    } catch (e) {
      throw new Error(`Could not update planner: ${e}`);
    }
  },
};
