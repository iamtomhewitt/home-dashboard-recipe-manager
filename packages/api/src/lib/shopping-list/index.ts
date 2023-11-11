import { Ingredient } from '../../../types/ingredient';
import { getPlanner } from '../planner';
import { findRecipe } from '../recipe';

export const getShoppingList = async (id: string): Promise<string[]> => {
  try {
    const currentItems: Ingredient[] = [];
    const shoppingList: string[] = [];
    const planner = await getPlanner(id);

    for (const plan of planner.plan) {
      const existingRecipe = await findRecipe(plan.recipe, id);

      if (existingRecipe && existingRecipe.ingredients) {
        existingRecipe.ingredients.forEach((ingredient: Ingredient) => {
          const existingIngredient = currentItems.filter((x) => x.name === ingredient.name && x.weight === ingredient.weight)[0];

          if (existingIngredient) {
            const newAmount = ingredient.amount + existingIngredient.amount;
            existingIngredient.amount = newAmount;
          } else {
            currentItems.push(ingredient);
          }
        });
      }
    }

    currentItems.sort((a, b) => ((a.category > b.category) ? 1 : -1));
    currentItems.forEach((item) => {
      if (!item.weight) {
        item.weight = 'grams';
      }

      let formattedItem = `${Math.ceil(item.amount)} ${item.weight} of ${item.name}`
        .replace(' grams', 'g')
        .replace(' quantity of', '');

      if (item.weight === 'quantity') {
        formattedItem = formattedItem.endsWith('s') ? `${formattedItem.substring(0, formattedItem.length - 1)}(s)` : `${formattedItem}(s)`;
      }

      shoppingList.push(formattedItem);
    });

    return shoppingList;
  } catch (e) {
    throw new Error(`Could not get shopping list: ${e}`);
  }
};