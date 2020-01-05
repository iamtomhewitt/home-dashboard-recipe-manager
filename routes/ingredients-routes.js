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

module.exports = router;