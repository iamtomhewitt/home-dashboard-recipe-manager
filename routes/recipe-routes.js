var express = require('express')
var fs = require('fs');
var path = require('path')
var router = express.Router();

var successCode = 200;
var errorCode = 502;
var notFoundCode = 404;

router.get('/', function (req, res) {
    res.status(successCode).send('OK');
});

router.get('/:name', function (req, res) {
	let recipeName = req.params.name;
    res.status(successCode).send('OK');
});

router.get('/add', function (req, res) {
    res.status(successCode).send('OK');
});

router.get('/delete', function (req, res) {
    res.status(successCode).send('OK');
});

module.exports = router;