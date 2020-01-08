const express = require('express');
const mongoUtil = require('../mongoUtil');

const router = express.Router();

const collectionName = 'recipes';

const successCode = 200;
const errorCode = 502;
const notFoundCode = 404;

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
    const recipeName = req.query.name;
    const db = mongoUtil.getDb();

    if (recipeName) {
        db.collection(collectionName).findOne({ name: recipeName }).then((recipe) => {
            response = recipe === null ? notFound(`Could not find '${recipeName}'`) : success('Success');
            response.recipe = recipe;
            res.status(successCode).send(response);
        });
    } else {
        db.collection(collectionName).find().toArray().then((recipes) => {
            response = success('Success');
            response.recipes = recipes;
            res.status(successCode).send(response);
        });
    }
});

router.post('/add', (req, res) => {
    const { ingredients } = req.body;
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
    };
	let response;

    if (!recipeName || !ingredients) {
        response = error(`Recipe could not be added, missing data from JSON body. Expected: ${JSON.stringify(expectedJson)} Got: ${JSON.stringify(req.body)}`);
        res.status(errorCode).send(response);
        return;
	}
	
	db.collection(collectionName).findOne({ name: recipeName }).then((recipe) => {
		if (recipe !== null) {
			response = error(`Cannot add recipe: '${recipeName}' already exists`);
			res.status(errorCode).send(response);
		}
		else {
			db.collection(collectionName).insertOne(req.body);
			response = success(`Recipe '${recipeName}' added`);
    		res.status(successCode).send(response);
		}
	});
});

router.delete('/delete', (req, res) => {
	const recipeName = req.body.name;
	const db = mongoUtil.getDb();
	
	let response;

    if (!recipeName) {
        response = error('Recipe could not be deleted: Missing \'name\' parameter from JSON body');
        res.status(errorCode).send(response);
        return;
	}
	
	db.collection(collectionName).deleteOne({ name: recipeName }).then(() => {
		response = success(`'${recipeName}' successfully deleted`);
    	res.status(successCode).send(response);
	});
});

module.exports = router;
