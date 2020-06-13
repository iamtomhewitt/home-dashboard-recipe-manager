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
  const { apiKey } = req.query;
  const recipeName = req.query.name;
  const failedCheck = checkApiKey(apiKey);

  if (failedCheck) {
    res.status(failedCheck.code).send(failedCheck);
    return;
  }

  if (recipeName) {
    mongoUtil.findRecipe(recipeName).then((recipe) => {
      const code = recipe === null ? NOT_FOUND : SUCCESS;
      const response = recipe === null ? badRequest(`Could not find '${recipeName}'`) : recipe;
      res.status(code).send(response);
    });
  } else {
    mongoUtil.findRecipes().then((data) => {
      const recipes = data.sort((a, b) => a.name.localeCompare(b.name));
      res.status(SUCCESS).send({
        ...success('Success'),
        recipes,
      });
    });
  }
});

router.post('/add', (req, res) => {
  const {
    ingredients, apiKey, steps, serves,
  } = req.body;
  const recipeName = req.body.name;
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
    res.status(failedCheck.code).send(failedCheck);
    return;
  }

  if (!recipeName || !ingredients || !steps) {
    res.status(BAD_REQUEST).send(badRequest(`Recipe could not be added, missing data from JSON body. Expected: ${JSON.stringify(expectedJson)} Got: ${JSON.stringify(req.body)}`));
    return;
  }

  ingredients.forEach((ingredient) => {
    if (missingParameter) return;

    if (!('name' in ingredient) || !('category' in ingredient) || !('amount' in ingredient) || !('weight' in ingredient)) {
      missingParameter = true;
      res.status(BAD_REQUEST).send(badRequest(`Recipe could not be added, missing data from JSON body. Expected: ${JSON.stringify(expectedJson)} Got: ${JSON.stringify(req.body)}`));
    }
  });

  // Stop processing, exit from method
  if (missingParameter) return;

  mongoUtil.findRecipe(recipeName).then((recipe) => {
    if (recipe) {
      res.status(SERVER_ERROR).send(error(`Cannot add recipe: '${recipeName}' already exists`));
    } else {
      mongoUtil.addRecipe(
        recipeName,
        serves,
        ingredients,
        steps,
      );
      res.status(CREATED).send(success(`Recipe '${recipeName}' added`));
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
    res.status(failedCheck.code).send(failedCheck);
    return;
  }

  if (!originalName || !ingredients || !steps) {
    const message = `Recipe could not be updated, missing data from JSON body. Expected: ${JSON.stringify(expectedJson)} Got: ${JSON.stringify(req.body)} ('newName' is an optional parameter)`;
    res.status(BAD_REQUEST).send(badRequest(message));
    return;
  }

  // Check if each parameter is in the ingredients array
  ingredients.forEach((ingredient) => {
    if (missingParameter) return;

    if (!('name' in ingredient) || !('category' in ingredient) || !('amount' in ingredient) || !('weight' in ingredient)) {
      missingParameter = true;
      res.status(BAD_REQUEST).send(badRequest(`Recipe could not be updated, missing data from JSON body. Expected: ${JSON.stringify(expectedJson)} Got: ${JSON.stringify(req.body)}`));
    }
  });

  // Stop processing, exit from method
  if (missingParameter) return;

  mongoUtil.findRecipe(originalName).then((recipe) => {
    if (recipe !== null) {
      // Found recipe, update
      const recipeName = newName !== undefined ? newName : originalName;
      mongoUtil.updateRecipe(originalName, recipeName, ingredients, steps, serves);
      res.status(SUCCESS).send(success(`'${recipeName}' successfully updated`));
    } else {
      // Recipe not found, create
      mongoUtil.addRecipe(originalName, serves, ingredients, steps);
      res.status(CREATED).send(created(`'${originalName}' could not be updated as it does not exist, so it was created instead`));
    }
  });
});

router.delete('/delete', (req, res) => {
  const { apiKey } = req.body;
  const recipeName = req.body.name;
  const failedCheck = checkApiKey(apiKey);

  if (failedCheck) {
    res.status(failedCheck.code).send(failedCheck);
    return;
  }

  if (!recipeName) {
    res.status(BAD_REQUEST).send(badRequest('Recipe could not be deleted: Missing \'name\' parameter from JSON body'));
    return;
  }

  mongoUtil.findRecipe(recipeName).then((recipe) => {
    if (recipe === null) {
      res.status(NOT_FOUND).send(notFound(`Cannot delete recipe: '${recipeName}' not found`));
    } else {
      mongoUtil.deleteRecipe(recipeName);
      res.status(SUCCESS).send(success(`'${recipeName}' successfully deleted`));
    }
  });
});

module.exports = router;
