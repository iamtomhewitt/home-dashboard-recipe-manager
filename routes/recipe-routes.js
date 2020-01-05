var express = require('express')
var fs = require('fs');
var path = require('path')
var router = express.Router();

var successCode = 200;
var errorCode = 502;
var notFoundCode = 404;

var recipesFilename = path.join(__dirname, '..', 'data', 'recipes.json');

router.get('/', function (req, res) {
    let contents = fs.readFileSync(recipesFilename, 'utf-8');
    let response = success('Success')
    response['recipes'] = JSON.parse(contents)['recipes'];
    res.status(successCode).send(response);
});

router.get('/:name', function (req, res) {
    let recipeName = req.params.name;
    let contents = fs.readFileSync(recipesFilename, 'utf-8');
    let json = JSON.parse(contents)['recipes']

    let recipe = json.filter(
        function (data) { 
            return data.name == recipeName 
        }
    );

    let response = success('Recipe found');
    response['recipe'] = recipe[0];

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