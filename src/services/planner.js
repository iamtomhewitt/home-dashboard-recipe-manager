const fetch = require('node-fetch');

module.exports = {

  async getData() {
    const firebase = process.env.FIREBASE + '.json';
    const response = await fetch(firebase);
    const json = await response.json();
    return json;
  },

  async getPlanner(id) {
    const { planners } = await this.getData();
    const planner = planners.find(p => p.plannerId === id);
    if (!planner) {
      throw new Error(`Could not find planner with id '${id}'`)
    }
    const plannerIndex = planners.indexOf(planner);
    return { planner, plannerIndex };
  },

  async updatePlanner(id, body) {
    try {
      const { day, recipe } = body;
      const { planner, plannerIndex } = await this.getPlanner(id);
      const dayToUpdate = planner.plan.find(p => p.day === day)
      const dayToUpdateIndex = planner.plan.indexOf(dayToUpdate);
      const updateUrl = `${process.env.FIREBASE}planners/${plannerIndex}/plan/${dayToUpdateIndex}/recipe.json`;

      await fetch(updateUrl, {
        method: 'put',
        body: `"${recipe}"`
      })
    }
    catch (e) {
      throw new Error(`Could not update planner: ${e}`)
    }
  }
}