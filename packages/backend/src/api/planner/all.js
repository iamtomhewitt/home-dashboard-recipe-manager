const { getData } = require("../../lib/planner");
const { response } = require("../../http/response");

module.exports.handler = async () => {
  const { planners } = await getData();
  return response.ok({
    planners
  })
}