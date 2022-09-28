const { response } = require('../../http/response');
const { saveRecipe } = require('../../lib/recipe');

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { id } = event.queryStringParameters;
    const { ingredients, name, steps } = body;

    if (!id) {
      return response.badRequest({
        message: '"id" is missing from query parameter',
      });
    }

    await saveRecipe({ ingredients, name, steps, id });
    return response.ok({
      message: `${name} saved!`,
    });
  } catch (err) {
    return response.error({
      message: err.message,
    });
  }
};
