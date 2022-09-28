const { response } = require('../../http/response');
const { updatePlanner } = require('../../lib/planner');

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { id } = event.queryStringParameters;
    const { day, recipe } = body;

    if (!id || !day || !recipe) {
      return response.badRequest({
        message: 'Missing "id", "day" or "recipe"',
      });
    }

    await updatePlanner({
      id,
      day,
      recipe,
    });

    return response.ok({
      message: 'Planner updated!',
    });
  } catch (err) {
    return response.error({
      message: err.message,
    });
  }
};
