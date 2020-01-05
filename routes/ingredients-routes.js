var express = require('express')
var fs = require('fs');
var path = require('path')
var router = express.Router();

var successCode = 200;
var errorCode = 502;
var notFoundCode = 404;

var ingredientsFilename = path.join(__dirname, '..', 'data', 'ingredients.json');

router.get('/', function (req, res) {
	let contents = fs.readFileSync(ingredientsFilename, 'utf-8');
	let response = success('Success')
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

	let ingredient = req.query.ingredient;
	let contents = fs.readFileSync(ingredientsFilename, 'utf-8');
	let json = JSON.parse(contents);

	json['ingredients'].push(ingredient);

	fs.writeFileSync(ingredientsFilename, JSON.stringify(json)), 'utf-8';

	response = success("'" + ingredient + "' successfully added");
	res.status(successCode).send(response);
});

router.get('/delete', function (req, res) {
	let response;

	if (!fs.existsSync(ingredientsFilename)) {
		response = error(`${ingredientsFilename} does not exist`);
		res.status(errorCode).send(response).json();
		return;
	}

	let ingredient = req.query.ingredient;
	let contents = fs.readFileSync(ingredientsFilename, 'utf-8');
    let json = JSON.parse(contents)['ingredients'];
    
    if (json[ingredient] === undefined) {
        response = notFound(`Could not find '${ingredient}' to delete`);
        res.status(notFoundCode).send(response);
        return;
    }

    let index = json.indexOf(ingredient);

	json.splice(index, 1);

	fs.writeFileSync(ingredientsFilename, JSON.stringify(json)), 'utf-8';

	res.status(successCode).send('OK');
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