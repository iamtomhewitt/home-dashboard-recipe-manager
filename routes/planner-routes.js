var express = require('express')
var fs = require('fs');
var path = require('path')
var router = express.Router();

var successCode = 200;
var errorCode = 502;

var plannerFilename = path.join(__dirname, '..', 'data', 'planner.json');

router.get('/', function (req, res) {
	let response;
	let day = req.query.day;

	if (!fs.existsSync(plannerFilename)) {
		response = error(`${plannerFilename} does not exist`);
		res.status(errorCode).send(response).json();
		return;
	}
	
	let contents = fs.readFileSync(plannerFilename, 'utf-8');

	if (day) {
		let days = JSON.parse(contents)['planner'];
	
		const found = days.find(x => x.day === day);
		
		if (!found) {
			response = error(`${day} not a valid day`)
			res.status(errorCode).send(response);
			return;
		}

		response = success(`Found plan for '${day}'`);
		response['planner'] = found;
		res.status(successCode).send(response);
	}

	else {
		response = success('Success')
		response['planner'] = JSON.parse(contents)['planner'];
		res.status(successCode).send(response);
	}
});

router.post('/add', function (req, res) {
	let day = req.body.day;
    let recipeName = req.body.recipe;
    let response;

    if (!recipeName || !day) {
        response = error('Planner could not be updated: Missing data from JSON body');
        res.status(errorCode).send(response);
        return;
	}
	
	if(!fs.existsSync(plannerFilename)) {
        response = error(`Planner could not be updated: ${plannerFilename} does not exist`);
        res.status(errorCode).send(response);
        return;
	}
	
	let contents = fs.readFileSync(plannerFilename, 'utf-8');
	let json = JSON.parse(contents);
	let days = json['planner'];
	
	const foundDay = days.find(x => x.day === day);
		
	if (!foundDay) {
		response = error(`${day} not a valid day`)
		res.status(errorCode).send(response);
		return;
	}
	
	foundDay.recipe = recipeName;
	
    fs.writeFileSync(plannerFilename, JSON.stringify(json)), 'utf-8';
    
    response = success(`Recipe '${recipeName}' added`);
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

module.exports = router;