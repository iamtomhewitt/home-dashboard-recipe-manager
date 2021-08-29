const fetch = require('node-fetch');

module.exports = {

  async getData() {
    const firebase = process.env.FIREBASE;
    const response = await fetch(firebase);
    const json = await response.json();
    return json;
  },

  async getPlanner(id) {
    const { planners } = await this.getData();
    return planners.filter(p => p.plannerId = id)[0];
  }
}