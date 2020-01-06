var express = require('express')
var fs = require('fs');
var path = require('path')
var router = express.Router();

var successCode = 200;
var errorCode = 502;

var plannerFilename = path.join(__dirname, '..', 'data', 'planner.json');

router.get('/', function (req, res) {
	let response;

	if (!fs.existsSync(plannerFilename)) {
		response = error(`${plannerFilename} does not exist`);
		res.status(errorCode).send(response).json();
		return;
	}

	let contents = fs.readFileSync(plannerFilename, 'utf-8');
	response = success('Success')
	response['planner'] = JSON.parse(contents)['planner'];
	res.status(successCode).send(response);
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