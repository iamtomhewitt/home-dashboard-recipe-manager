const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const successCode = 200;
const errorCode = 502;
const notFoundCode = 404;

const ingredientsFilename = path.join(__dirname, '..', 'data', 'ingredients.json');

function success(message) {
    return {
        status: successCode,
        message,
    };
}

function error(message) {
    return {
        status: errorCode,
        message,
    };
}

function notFound(message) {
    return {
        status: notFoundCode,
        message,
    };
}

router.get('/', (req, res) => {
    let response;

    if (!fs.existsSync(ingredientsFilename)) {
        response = error(`Could not get ingredients: ${ingredientsFilename} does not exist`);
        res.status(errorCode).send(response).json();
        return;
    }

    const contents = fs.readFileSync(ingredientsFilename, 'utf-8');
    response = success('Success');
    response.ingredients = JSON.parse(contents).ingredients;
    res.status(successCode).send(response);
});

router.post('/add', (req, res) => {
    let response;

    if (!fs.existsSync(ingredientsFilename)) {
        response = error(`${ingredientsFilename} does not exist`);
        res.status(errorCode).send(response).json();
        return;
    }

    const { name } = req.body;
    const { type } = req.body;

    if (!name || !type) {
        response = error('Ingredient could not be added: Missing \'name\' or \'type\' parameter from JSON payload');
        res.status(errorCode).send(response).json();
        return;
    }

    const contents = fs.readFileSync(ingredientsFilename, 'utf-8');
    const json = JSON.parse(contents);
    const currentIngredients = json.ingredients;
    const ingredientExists = currentIngredients.find((x) => x.name === name) !== undefined;

    if (ingredientExists) {
        response = error(`Cannot add ingredient: '${name}' already exists`);
        res.status(errorCode).send(response);
        return;
    }

    const ingredient = {
        name,
        type,
    };

    json.ingredients.push(ingredient);

    fs.writeFileSync(ingredientsFilename, JSON.stringify(json)), 'utf-8';

    response = success(`${name} successfully added`);
    res.status(successCode).send(response);
});

router.delete('/delete', (req, res) => {
    let response;

    if (!fs.existsSync(ingredientsFilename)) {
        response = error(`Could not delete ingredient: ${ingredientsFilename} does not exist`);
        res.status(errorCode).send(response).json();
        return;
    }

    const { name } = req.body;
    if (!name) {
        response = error('Could not delete ingredient: Missing \'name\' parameter from JSON payload');
        res.status(errorCode).send(response).json();
        return;
    }

    const contents = fs.readFileSync(ingredientsFilename, 'utf-8');
    const { ingredients } = JSON.parse(contents);

    const index = ingredients.findIndex((x) => x.name === name);
    if (index === -1) {
        response = notFound(`Could not delete ingredient: '${name}' not found`);
        res.status(notFoundCode).send(response);
        return;
    }

    if (index !== undefined) ingredients.splice(index, 1);

    const json = {
        ingredients,
    };

    fs.writeFileSync(ingredientsFilename, JSON.stringify(json)), 'utf-8';

    response = success('Success');
    res.status(successCode).send(response);
});

module.exports = router;
