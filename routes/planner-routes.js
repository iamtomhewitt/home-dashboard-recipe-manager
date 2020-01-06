var express = require('express')
var fs = require('fs');
var path = require('path')
var router = express.Router();

var successCode = 200;
var errorCode = 502;

var plannerFilename = path.join(__dirname, '..', 'data', 'planner.json');

router.get('/', function (req, res) {
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