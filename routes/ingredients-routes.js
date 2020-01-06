var express = require('express')
var fs = require('fs');
var path = require('path')
var router = express.Router();

var successCode = 200;
var errorCode = 502;
var notFoundCode = 404;

var ingredientsFilename = path.join(__dirname, '..', 'data', 'ingredients.json');

router.get('/', function (req, res) {
	let response;

	if (!fs.existsSync(ingredientsFilename)) {
		response = error(`${ingredientsFilename} does not exist`);
		res.status(errorCode).send(response).json();
		return;
	}

	let contents = fs.readFileSync(ingredientsFilename, 'utf-8');
	response = success('Success')
	response['ingredients'] = JSON.parse(contents)['ingredients'];
	res.status(successCode).send(response);
});

router.get('/add', function (req, res) {
	let response;

	if (!fs.existsSync(ingredientsFilename)) {
		response = error(`${ingredientsFilename} does not exist`);
		res.status(errorCode).send(response).json();
		return;
	}

	let name = req.query.name;
	let type = req.query.type;
	let contents = fs.readFileSync(ingredientsFilename, 'utf-8');
    let json = JSON.parse(contents);
    
    if (!name || !type) {
        response = error('Missing parameter from request query');
        res.status(errorCode).send(response).json();
        return;
    }

	let ingredient = {
		"name": name,
		"type": type
	}

	json['ingredients'].push(ingredient);

	fs.writeFileSync(ingredientsFilename, JSON.stringify(json)), 'utf-8';

	response = success("'" + name + "' successfully added");
	res.status(successCode).send(response);
});

router.get('/delete', function (req, res) {
	let response;

	if (!fs.existsSync(ingredientsFilename)) {
		response = error(`${ingredientsFilename} does not exist`);
		res.status(errorCode).send(response).json();
		return;
	}

	let name = req.query.name;
	let contents = fs.readFileSync(ingredientsFilename, 'utf-8');
    let ingredients = JSON.parse(contents)['ingredients'];
	
	const index = ingredients.findIndex(x => x.name === name);
	
	if (index === -1) {
		response = notFound(`${name} not found`)
		res.status(notFoundCode).send(response);
		return;
	}

	if (index !== undefined) ingredients.splice(index, 1);

	let json = {
		"ingredients": ingredients
	}

	fs.writeFileSync(ingredientsFilename, JSON.stringify(json)), 'utf-8';

    response = success('Success')
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