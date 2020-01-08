const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const successCode = 200;
const errorCode = 502;

const plannerFilename = path.join(__dirname, '..', 'data', 'planner.json');

function success(message) {
    return {
        status: successCode,
        message,
    };
}

function error(message) {
    return {
        status: errorCode,
        message,
    };
}

router.get('/', (req, res) => {
    let response;
    const { day } = req.query;

    if (!fs.existsSync(plannerFilename)) {
        response = error(`Could not get planner: ${plannerFilename} does not exist`);
        res.status(errorCode).send(response).json();
        return;
    }

    const contents = fs.readFileSync(plannerFilename, 'utf-8');

    if (day) {
        const days = JSON.parse(contents).planner;
        const found = days.find((x) => x.day === day);

        if (!found) {
            response = error(`Could not get planner: ${day} not a valid day`);
            res.status(errorCode).send(response);
            return;
        }

        response = success(`Found plan for '${day}'`);
        response.planner = found;
        res.status(successCode).send(response);
    } else {
        response = success('Success');
        response.planner = JSON.parse(contents).planner;
        res.status(successCode).send(response);
    }
});

router.post('/add', (req, res) => {
    const { day } = req.body;
    const recipeName = req.body.recipe;
    let response;
    const expectedJson = {
        day: '<day>',
        recipe: '<recipe>',
    };

    if (!recipeName || !day) {
        response = error(`Planner could not be updated, missing data from JSON body. Expected: ${JSON.stringify(expectedJson)} Got: ${JSON.stringify(req.body)}`);
        res.status(errorCode).send(response);
        return;
    }

    if (!fs.existsSync(plannerFilename)) {
        response = error(`Planner could not be updated: ${plannerFilename} does not exist`);
        res.status(errorCode).send(response);
        return;
    }

    const contents = fs.readFileSync(plannerFilename, 'utf-8');
    const json = JSON.parse(contents);
    const days = json.planner;
    const foundDay = days.find((x) => x.day === day);

    if (!foundDay) {
        response = error(`Planner could not be updated: ${day} not a valid day`);
        res.status(errorCode).send(response);
        return;
    }

    foundDay.recipe = recipeName;

    fs.writeFileSync(plannerFilename, JSON.stringify(json)), 'utf-8';

    response = success(`Recipe '${recipeName}' added`);
    res.status(successCode).send(response);
});

module.exports = router;
