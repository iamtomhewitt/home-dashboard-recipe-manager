var express = require('express')
var fs = require('fs');
var path = require('path')
var router = express.Router();

var successCode = 200;
var errorCode = 502;
var notFoundCode = 404;

var recipesFilename = path.join(__dirname, '..', 'data', 'recipes.json');

router.get('/', function (req, res) {
    let response;
    if(!fs.existsSync(recipesFilename)) {
        response = error(`Could not get recipes: ${recipesFilename} does not exist`);
        res.status(errorCode).send(response);
        return;
    }

	let contents = fs.readFileSync(recipesFilename, 'utf-8');
    let recipeName = req.query.name;

	if (recipeName) {
		let json = JSON.parse(contents)['recipes']

		let recipe = json.filter(
			function (data) { 
				return data.name == recipeName 
			}
        ); 
        
        response = success('Recipe found');
	    response['recipe'] = recipe[0];
    }
    
    else {
        response = success('Success')
        response['recipes'] = JSON.parse(contents)['recipes'];
    }
	res.status(successCode).send(response);
});

router.post('/add', function (req, res) {
    let recipeName = req.body.name;
    let ingredients = req.body.ingredients;
    let response;

    if (!recipeName || !ingredients) {
        response = error('Recipe could not be added: Missing data from JSON body');
        res.status(errorCode).send(response);
        return;
    }

    if(!fs.existsSync(recipesFilename)) {
        response = error(`Recipe could not be added: ${recipesFilename} does not exist`);
        res.status(errorCode).send(response);
        return;
    }

    let contents = fs.readFileSync(recipesFilename, 'utf-8');
    let json = JSON.parse(contents);
    let recipe = req.body;

    json['recipes'].push(recipe);
    fs.writeFileSync(recipesFilename, JSON.stringify(json)), 'utf-8';
    
    response = success(`Recipe '${recipeName}' added`);
	res.status(successCode).send(response);
});

router.get('/delete', function (req, res) {
	let response;

	if (!fs.existsSync(recipesFilename)) {
		response = error(`Recipe could not be deleted: ${recipesFilename} does not exist`);
		res.status(errorCode).send(response).json();
		return;
	}

	let name = req.query.name;
	let contents = fs.readFileSync(recipesFilename, 'utf-8');
    let recipes = JSON.parse(contents)['recipes'];
	
	const index = recipes.findIndex(x => x.name === name);
	
	if (index === -1) {
		response = notFound(`${name} not found`)
		res.status(notFoundCode).send(response);
		return;
	}

	if (index !== undefined) recipes.splice(index, 1);

	let json = {
		"recipes": recipes
	}

	fs.writeFileSync(recipesFilename, JSON.stringify(json)), 'utf-8';

    response = success(`'${name}' successfully deleted`);
	res.status(successCode).send(response);
});

function success(message) {
	return response = {
		"status": successCode,
		"message": message
	}
}

function error(message) {
	return response = {
		"status": errorCode,
		"message": message
	}
}

function notFound(message) {
	return response = {
		"status": notFoundCode,
		"message": message
	}
}

module.exports = router;