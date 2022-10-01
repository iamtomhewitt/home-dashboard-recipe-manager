const { getShoppingList } = require('../../lib/shopping-list');
const { response } = require('../../http/response');

module.exports.handler = async (event) => {
  try {
    const { id } = event.queryStringParameters;

    if (!id) {
      return response.badRequest({
        message: '"id" is missing from query parameter',
      });
    }

    const shoppingList = await getShoppingList(id);

    return response.ok(shoppingList);
  } catch (err) {
    return response.error({
      message: err.message,
    });
  }
};
