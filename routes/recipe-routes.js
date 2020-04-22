const express = require('express');
const mongoUtil = require('../mongoUtil');
require('dotenv').config();

const router = express.Router();

const collectionName = 'recipes';

const success = 200;
const created = 201;
const badRequest = 400;
const unauthorised = 401;
const notFound = 404;
const serverError = 500;

function successResponse(message) {
    return {
        status: success,
        message,
    };
}

function badRequestResponse(message) {
    return {
        status: badRequest,
        message,
    };
}

function unauthorisedResponse(message) {
    return {
        status: unauthorised,
        message,
    };
}

function errorResponse(message) {
    return {
        status: serverError,
        message,
    };
}

function notFoundResponse(message) {
    return {
        status: notFound,
        message,
    };
}

function checkApiKey(apiKey) {
    if (!apiKey) {
        return {
            response: badRequestResponse('No API key specified'),
            code: badRequest,
        };
    }

    if (apiKey !== process.env.API_KEY) {
        return {
            response: unauthorisedResponse('API key is incorrect'),
            code: unauthorised,
        };
    }

    return null;
}

router.get('/', (req, res) => {
    let response;
    const recipeName = req.query.name;
    const db = mongoUtil.getDb();
    const { apiKey } = req.query;

    const failedCheck = checkApiKey(apiKey);
    if (failedCheck) {
        res.status(failedCheck.code).send(failedCheck.response);
        return;
    }

    if (recipeName) {
        db.collection(collectionName).findOne({ name: recipeName }).then((recipe) => {
            const code = recipe === null ? notFound : success;
            response = recipe === null ? badRequestResponse(`Could not find '${recipeName}'`) : successResponse('Success');
            response.recipe = recipe;
            res.status(code).send(response);
        });
    } else {
        db.collection(collectionName).find().toArray().then((data) => {
            const recipes = data.sort((a, b) => a.name.localeCompare(b.name));
            response = successResponse('Success');
            response.recipes = recipes;
            res.status(success).send(response);
        });
    }
});

router.post('/add', (req, res) => {
    const { ingredients, apiKey, steps } = req.body;
    const recipeName = req.body.name;
    const db = mongoUtil.getDb();
    const expectedJson = {
        name: '<recipe name>',
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
    let response;
    let missingParameter = false;

    const failedCheck = checkApiKey(apiKey);
    if (failedCheck) {
        res.status(failedCheck.code).send(failedCheck.response);
        return;
    }

    if (!recipeName || !ingredients || !steps) {
        response = badRequestResponse(`Recipe could not be added, missing data from JSON body. Expected: ${JSON.stringify(expectedJson)} Got: ${JSON.stringify(req.body)}`);
        res.status(badRequest).send(response);
        return;
    }

    ingredients.forEach((ingredient) => {
        if (missingParameter) return;

        if (!('name' in ingredient) || !('category' in ingredient) || !('amount' in ingredient) || !('weight' in ingredient)) {
            missingParameter = true;
            response = badRequestResponse(`Recipe could not be added, missing data from JSON body. Expected: ${JSON.stringify(expectedJson)} Got: ${JSON.stringify(req.body)}`);
            res.status(badRequest).send(response);
        }
    });

    // Stop processing, exit from method
    if (missingParameter) return;

    db.collection(collectionName).findOne({ name: recipeName }).then((recipe) => {
        if (recipe !== null) {
            response = errorResponse(`Cannot add recipe: '${recipeName}' already exists`);
            res.status(serverError).send(response);
        } else {
            db.collection(collectionName).insertOne(req.body);
            response = successResponse(`Recipe '${recipeName}' added`);
            res.status(created).send(response);
        }
    });
});

router.put('/update', (req, res) => {
    const { originalName, newName, ingredients, apiKey, steps } = req.body;
    const db = mongoUtil.getDb();
    const expectedJson = {
        originalName: '<recipe name>',
        newName: '<recipe name>',
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

    let response;
    let missingParameter = false;

    const failedCheck = checkApiKey(apiKey);
    if (failedCheck) {
        res.status(failedCheck.code).send(failedCheck.response);
        return;
    }

    if (!originalName || !ingredients || !steps) {
        response = badRequestResponse(`Recipe could not be updated, missing data from JSON body. Expected: ${JSON.stringify(expectedJson)} Got: ${JSON.stringify(req.body)} ('newName' is an optional parameter)`);
        res.status(badRequest).send(response);
        return;
    }

    // Check if each parameter is in the ingredients array
    ingredients.forEach((ingredient) => {
        if (missingParameter) return;

        if (!('name' in ingredient) || !('category' in ingredient) || !('amount' in ingredient) || !('weight' in ingredient)) {
            missingParameter = true;
            response = badRequestResponse(`Recipe could not be updated, missing data from JSON body. Expected: ${JSON.stringify(expectedJson)} Got: ${JSON.stringify(req.body)}`);
            res.status(badRequest).send(response);
        }
    });

    // Stop processing, exit from method
    if (missingParameter) return;

    db.collection(collectionName).findOne({ name: originalName }).then((recipe) => {
        if (recipe !== null) {
            // Found recipe, update
            const recipeName = newName !== undefined ? newName : originalName;
            db.collection(collectionName).updateOne({ name: originalName }, { $set: { name: recipeName, ingredients, steps } });
            response = successResponse(`'${recipeName}' successfully updated`);
            res.status(success).send(response);
        } else {
            // Recipe not found, create
            const newRecipe = {
                name: originalName,
				ingredients,
				steps
			};
            db.collection(collectionName).insertOne(newRecipe);
            response = successResponse(`'${originalName}' could not be updated as it does not exist, so it was created instead`);
            res.status(created).send(response);
        }
    });
});

router.delete('/delete', (req, res) => {
    const recipeName = req.body.name;
    const db = mongoUtil.getDb();
    const { apiKey } = req.body;

    let response;

    const failedCheck = checkApiKey(apiKey);
    if (failedCheck) {
        res.status(failedCheck.code).send(failedCheck.response);
        return;
    }

    if (!recipeName) {
        response = badRequestResponse('Recipe could not be deleted: Missing \'name\' parameter from JSON body');
        res.status(badRequest).send(response);
        return;
    }

    db.collection(collectionName).findOne({ name: recipeName }).then((recipe) => {
        if (recipe === null) {
            response = notFoundResponse(`Cannot delete recipe: '${recipeName}' not found`);
            res.status(notFound).send(response);
        } else {
            db.collection(collectionName).deleteOne({ name: recipeName }).then(() => {
                response = successResponse(`'${recipeName}' successfully deleted`);
                res.status(success).send(response);
            });
        }
    });
});

module.exports = router;
