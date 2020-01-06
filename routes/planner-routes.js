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

router.get('/add', function (req, res) {

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