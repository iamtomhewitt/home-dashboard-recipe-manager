const { getPlanner } = require('../../lib/planner');
const { response } = require('../../http/response');

module.exports.handler = async (event) => {
  try {
    const { id } = event.pathParameters;
    const planner = await getPlanner(id);

    return response.ok(planner);
  } catch (err) {
    return response.error({
      message: err.message,
    });
  }
};
