const { deleteRecipe } = require('../../lib/recipe');
const { response } = require('../../http/response');

module.exports.handler = async (event) => {
  try {
    const { id, name } = event.queryStringParameters;

    if (!id) {
      return response.badRequest({
        message: '"id" is missing from query parameter',
      });
    }

    await deleteRecipe(name, id);
    return response.ok({
      message: `${name} deleted!`,
    });
  } catch (err) {
    return response.error({
      message: err.message,
    });
  }
};
