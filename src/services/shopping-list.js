const fetch = require('node-fetch');
const plannerService = require('../services/planner');
const recipeService = require('../services/recipe');

module.exports = {

  async getData() {
    const firebase = process.env.FIREBASE + '.json';
    const response = await fetch(firebase);
    const json = await response.json();
    return json;
  },

  async getShoppingList(id) {
    try {
      const currentItems = []
      const shoppingList = []
      const planner = await plannerService.getPlanner(id);

      for (const plan of planner.plan) {
        const existingRecipe = await recipeService.findRecipe(plan.recipe);

        if (existingRecipe && existingRecipe.ingredients) {
          existingRecipe.ingredients.forEach(ingredient => {
            const existingIngredient = currentItems.filter(x => x.name === ingredient.name && x.weight === ingredient.weight)[0];

            if (existingIngredient) {
              const newAmount = ingredient.amount + existingIngredient.amount;
              existingIngredient.amount = newAmount;
            }
            else {
              currentItems.push(ingredient);
            }
          })
        }
      }

      currentItems.sort((a, b) => (a.category > b.category) ? 1 : -1)
      currentItems.forEach(item => {
        if (!item.weight) {
          item.weight = 'grams'
        }

        let formattedItem = `${Math.ceil(item.amount)} ${item.weight} of ${item.name}`
          .replace(' grams', 'g')
          .replace(' quantity of', '')

        if (item.weight === 'quantity') {
          formattedItem = formattedItem.endsWith('s') ? formattedItem.substring(0, formattedItem.length - 1) + "(s)" : formattedItem + "(s)"
        }

        shoppingList.push(formattedItem)
      })

      return shoppingList;
    }
    catch (e) {
      throw new Error(`Could not get shopping list: ${e}`)
    }
  }
}