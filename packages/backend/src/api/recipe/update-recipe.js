const { response } = require('../../http/response');
const { updateRecipe } = require('../../lib/recipe');

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { id } = event.queryStringParameters;
    const { ingredients, name, steps, originalName } = body;

    if (!id) {
      return response.badRequest({
        message: '"id" is missing from query parameter',
      });
    }

    await updateRecipe({ ingredients, name, steps, originalName, id });
    return response.ok({
      message: `${name} updated!`,
    });
  } catch (err) {
    return response.error({
      message: err.message,
    });
  }
};
