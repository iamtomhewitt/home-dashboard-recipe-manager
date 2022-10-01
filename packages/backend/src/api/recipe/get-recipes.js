const { findCookbook } = require('../../lib/recipe');
const { response } = require('../../http/response');

module.exports.handler = async (event) => {
  try {
    const { id } = event.queryStringParameters;

    if (!id) {
      return response.badRequest({
        message: '"id" is missing from query parameter',
      });
    }

    const cookbook = await findCookbook(id);

    if (!cookbook) {
      return response.badRequest({
        message: `Cookbook with id '${id}' not found!`,
      });
    }

    const { recipes } = cookbook;
    recipes.sort((a, b) => a.name.localeCompare(b.name));

    return response.ok(recipes);
  } catch (err) {
    return response.error({
      message: err.message,
    });
  }
};
