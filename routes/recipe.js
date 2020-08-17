const express = require('express');
const { checkApiKey } = require('../utils/utils');
const {
  success, badRequest, error, created, notFound,
} = require('../responses/responses');
const {
  SERVER_ERROR, SUCCESS, BAD_REQUEST, NOT_FOUND, CREATED,
} = require('../responses/codes');

const mongoUtil = require('../utils/mongoUtil');

const router = express.Router();
require('dotenv').config();

router.get('/', (req, res) => {
  const { apiKey, name } = req.query;
  const failedCheck = checkApiKey(apiKey);

  if (failedCheck) {
    res.status(failedCheck.code).json(failedCheck);
    return;
  }

  if (name) {
    mongoUtil.findRecipe(name).then((recipe) => {
      const code = recipe === null ? NOT_FOUND : SUCCESS;
      const response = recipe === null ? badRequest(`Could not find '${name}'`) : recipe;
      res.status(code).json(response);
    });
  } else {
    mongoUtil.findRecipes().then((data) => {
      const recipes = data.sort((a, b) => a.name.localeCompare(b.name));
      res.status(SUCCESS).json({
        ...success('Success'),
        recipes,
      });
    });
  }
});

router.post('/add', (req, res) => {
  const {
    ingredients, apiKey, steps, serves, name,
  } = req.body;
  const failedCheck = checkApiKey(apiKey);
  const expectedJson = {
    name: '<recipe name>',
    serves: '<optional>',
    ingredients: [
      {
        name: '<name>',
        category: '<category>',
        amount: '<amount>',
        weight: '<weight>',
      },
    ],
    steps: [
      '1. Example',
      '2. Example',
    ],
  };
  let missingParameter = false;

  if (failedCheck) {
    res.status(failedCheck.code).json(failedCheck);
    return;
  }

  if (!name || !ingredients || !steps) {
    res.status(BAD_REQUEST).json(badRequest(`Recipe could not be added, missing data from JSON body. Expected: ${JSON.stringify(expectedJson)} Got: ${JSON.stringify(req.body)}`));
    return;
  }

  ingredients.forEach((ingredient) => {
    if (missingParameter) return;

    if (!('name' in ingredient) || !('category' in ingredient) || !('amount' in ingredient) || !('weight' in ingredient)) {
      missingParameter = true;
      res.status(BAD_REQUEST).json(badRequest(`Recipe could not be added, missing data from JSON body. Expected: ${JSON.stringify(expectedJson)} Got: ${JSON.stringify(req.body)}`));
    }
  });

  // Stop processing, exit from method
  if (missingParameter) return;

  mongoUtil.findRecipe(name).then((recipe) => {
    if (recipe) {
      res.status(SERVER_ERROR).json(error(`Cannot add recipe: '${name}' already exists`));
    } else {
      mongoUtil.addRecipe(
        name,
        serves,
        ingredients,
        steps,
      );
      res.status(CREATED).json(success(`Recipe '${name}' added`));
    }
  });
});

router.put('/update', (req, res) => {
  const {
    originalName, newName, ingredients, apiKey, steps, serves,
  } = req.body;
  const failedCheck = checkApiKey(apiKey);
  const expectedJson = {
    originalName: '<recipe name>',
    newName: '<recipe name>',
    serves: '<serves>',
    ingredients: [
      {
        name: '<name>',
        category: '<category>',
        amount: '<amount>',
        weight: '<weight>',
      },
    ],
    steps: [
      '1. Example',
      '2. Example',
    ],
  };

  let missingParameter = false;

  if (failedCheck) {
    res.status(failedCheck.code).json(failedCheck);
    return;
  }

  if (!originalName || !ingredients || !steps) {
    const message = `Recipe could not be updated, missing data from JSON body. Expected: ${JSON.stringify(expectedJson)} Got: ${JSON.stringify(req.body)} ('newName' is an optional parameter)`;
    res.status(BAD_REQUEST).json(badRequest(message));
    return;
  }

  // Check if each parameter is in the ingredients array
  ingredients.forEach((ingredient) => {
    if (missingParameter) return;

    if (!('name' in ingredient) || !('category' in ingredient) || !('amount' in ingredient) || !('weight' in ingredient)) {
      missingParameter = true;
      res.status(BAD_REQUEST).json(badRequest(`Recipe could not be updated, missing data from JSON body. Expected: ${JSON.stringify(expectedJson)} Got: ${JSON.stringify(req.body)}`));
    }
  });

  // Stop processing, exit from method
  if (missingParameter) return;

  mongoUtil.findRecipe(originalName).then((recipe) => {
    if (recipe) {
      // Found recipe, update
      const recipeName = newName !== undefined ? newName : originalName;
      mongoUtil.updateRecipe(originalName, recipeName, ingredients, steps, serves);
      res.status(SUCCESS).json(success(`'${recipeName}' successfully updated`));
    } else {
      // Recipe not found, create
      mongoUtil.addRecipe(originalName, serves, ingredients, steps);
      res.status(CREATED).json(created(`'${originalName}' could not be updated as it does not exist, so it was created instead`));
    }
  });
});

router.delete('/delete', (req, res) => {
  const { apiKey, name } = req.body;
  const failedCheck = checkApiKey(apiKey);

  if (failedCheck) {
    res.status(failedCheck.code).json(failedCheck);
    return;
  }

  if (!name) {
    res.status(BAD_REQUEST).json(badRequest('Recipe could not be deleted: Missing \'name\' parameter from JSON body'));
    return;
  }

  mongoUtil.findRecipe(name).then((recipe) => {
    if (!recipe) {
      res.status(NOT_FOUND).json(notFound(`Cannot delete recipe: '${name}' not found`));
    } else {
      mongoUtil.deleteRecipe(name);
      res.status(SUCCESS).json(success(`'${name}' successfully deleted`));
    }
  });
});

module.exports = router;
