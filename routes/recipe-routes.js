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
        response = error(`${recipesFilename} does not exist`);
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

router.get('/add', function (req, res) {
	res.status(successCode).send('OK');
});

router.get('/delete', function (req, res) {
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