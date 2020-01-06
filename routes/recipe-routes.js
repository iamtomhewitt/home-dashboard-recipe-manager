const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const successCode = 200;
const errorCode = 502;
const notFoundCode = 404;

const recipesFilename = path.join(__dirname, '..', 'data', 'recipes.json');

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
    if (!fs.existsSync(recipesFilename)) {
        response = error(`Could not get recipes: ${recipesFilename} does not exist`);
        res.status(errorCode).send(response);
        return;
    }

    const contents = fs.readFileSync(recipesFilename, 'utf-8');
    const recipeName = req.query.name;

    if (recipeName) {
        const json = JSON.parse(contents).recipes;

        const recipe = json.filter(
            (data) => data.name === recipeName,
        );

        response = success('Recipe found');
        response.recipe = recipe[0];
    } else {
        response = success('Success');
        response.recipes = JSON.parse(contents).recipes;
    }
    res.status(successCode).send(response);
});

router.post('/add', (req, res) => {
    const recipeName = req.body.name;
    const { ingredients } = req.body;
    let response;

    if (!recipeName || !ingredients) {
        response = error('Recipe could not be added: Missing data from JSON body');
        res.status(errorCode).send(response);
        return;
    }

    if (!fs.existsSync(recipesFilename)) {
        response = error(`Recipe could not be added: ${recipesFilename} does not exist`);
        res.status(errorCode).send(response);
        return;
    }

    const contents = fs.readFileSync(recipesFilename, 'utf-8');
    const json = JSON.parse(contents);
    const recipe = req.body;

    json.recipes.push(recipe);
    fs.writeFileSync(recipesFilename, JSON.stringify(json)), 'utf-8';

    response = success(`Recipe '${recipeName}' added`);
    res.status(successCode).send(response);
});

router.delete('/delete', (req, res) => {
    let response;

    if (!fs.existsSync(recipesFilename)) {
        response = error(`Recipe could not be deleted: ${recipesFilename} does not exist`);
        res.status(errorCode).send(response).json();
        return;
    }

    const { name } = req.body;
    const contents = fs.readFileSync(recipesFilename, 'utf-8');
    const { recipes } = JSON.parse(contents);

    const index = recipes.findIndex((x) => x.name === name);

    if (index === -1) {
        response = notFound(`Could not delete recipe: '${name}' not found`);
        res.status(notFoundCode).send(response);
        return;
    }

    if (index !== undefined) recipes.splice(index, 1);

    const json = {
        recipes,
    };

    fs.writeFileSync(recipesFilename, JSON.stringify(json)), 'utf-8';

    response = success(`'${name}' successfully deleted`);
    res.status(successCode).send(response);
});

module.exports = router;
