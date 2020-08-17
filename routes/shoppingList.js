const express = require('express');
const { checkApiKey } = require('../utils/utils');
const { error } = require('../responses/responses');
const { SUCCESS, BAD_REQUEST } = require('../responses/codes');
const mongoUtil = require('../utils/mongoUtil');

const router = express.Router();
require('dotenv').config();

router.get('/', async (req, res) => {
  const { apiKey, plannerId } = req.query;
  const failedCheck = checkApiKey(apiKey);

  if (failedCheck) {
    res.status(failedCheck.code).send(failedCheck);
  }
  if (!plannerId) {
    res.status(BAD_REQUEST).send(error(`Could not get planner with id: ${plannerId}`));
  }

  const currentItems = [];
  const shoppingList = [];
  const result = await mongoUtil.findPlanner(plannerId);
  const planner = result[0];

  for (const day of planner.plan) {
    const recipe = await mongoUtil.findRecipe(day.recipe);

    if (recipe) {
      const { ingredients } = recipe;

      ingredients.forEach((i) => {
        const exists = currentItems.find((o) => (o.name === i.name && o.weight === i.weight));

        if (exists) {
          const newAmount = parseFloat(i.amount) + parseFloat(exists.amount);
          exists.amount = newAmount;
        } else {
          currentItems.push({
            name: i.name,
            weight: i.weight,
            amount: parseFloat(i.amount),
            category: i.category,
          });
        }
      });
    }
  }

  currentItems.sort((a, b) => ((a.category > b.category) ? 1 : ((b.category > a.category) ? -1 : 0)));

  for (const item of currentItems) {
    shoppingList.push(`${item.amount} ${item.weight} of ${item.name}`.replace(' grams', 'g'));
  }
  res.status(SUCCESS).json(shoppingList);
});

module.exports = router;
