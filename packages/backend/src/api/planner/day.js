const { getPlanner } = require("../../lib/planner");
const { response } = require("../../http/response");

module.exports.handler = async (event) => {
  try {
    const { id, day } = event.queryStringParameters;

    if (!id || !day) {
      return response.badRequest({
        message: 'No "id" or "day" params supplied'
      })
    }

    const { plan } = await getPlanner(id);
    const planForDay = plan.find((p) => p.day === day);

    return response.ok({
      ...planForDay
    })
  } catch (err) {
    return response.error({
      message: err.message
    })
  }
}