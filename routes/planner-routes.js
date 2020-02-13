const express = require('express');
const mongoUtil = require('../mongoUtil');
require('dotenv').config();

const router = express.Router();

const collectionName = 'planner';

const success = 200;
const created = 201;
const badRequest = 400;
const unauthorised = 401;
const serverError = 500;

function successResponse(message) {
    return {
        status: success,
        message,
    };
}

function badRequestResponse(message) {
    return {
        status: badRequest,
        message,
    };
}

function errorResponse(message) {
    return {
        status: serverError,
        message,
    };
}

function unauthorisedResponse(message) {
    return {
        status: unauthorised,
        message,
    };
}

function checkApiKey(apiKey) {
    if (!apiKey) {
        return {
            response: badRequestResponse('No API key specified'),
            code: badRequest,
        };
    }

    if (apiKey !== process.env.API_KEY) {
        return {
            response: unauthorisedResponse('API key is incorrect'),
            code: unauthorised,
        };
    }

    return null;
}

router.get('/', (req, res) => {
    const { day } = req.query;
    const { apiKey } = req.query;
    const db = mongoUtil.getDb();

    let response;

    const failedCheck = checkApiKey(apiKey);
    if (failedCheck) {
        res.status(failedCheck.code).send(failedCheck.response);
        return;
    }

    db.collection(collectionName).find().toArray().then((result) => {
        if (day) {
            let dayPlan;
            result[0].planner.forEach((element) => {
                if (element.day === day) {
                    dayPlan = element;
                }
            });

            if (dayPlan) {
                response = successResponse('Success');
                response.planner = dayPlan;
                res.status(success).send(response);
            } else {
                response = errorResponse(`Could not get planner: '${day}' not a valid day`);
                res.status(badRequest).send(response);
            }
        } else {
            response = successResponse('Success');
            response.planner = result[0].planner;
            res.status(success).send(response);
        }
    });
});

router.post('/add', (req, res) => {
    const { day } = req.body;
    const { apiKey } = req.body;
    const recipeName = req.body.recipe;
    const db = mongoUtil.getDb();
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const expectedJson = {
        day: '<day>',
        recipe: '<recipe>',
    };

    let response;

    const failedCheck = checkApiKey(apiKey);
    if (failedCheck) {
        res.status(failedCheck.code).send(failedCheck.response);
        return;
    }

    if (!recipeName || !day) {
        response = badRequestResponse(`Planner could not be updated, missing data from JSON body. Expected: ${JSON.stringify(expectedJson)} Got: ${JSON.stringify(req.body)}`);
        res.status(badRequest).send(response);
        return;
    }

    if (validDays.indexOf(day) < 0) {
        response = badRequestResponse(`Planner could not be updated: '${day}' not a valid day`);
        res.status(badRequest).send(response);
        return;
    }

    db.collection(collectionName).find().toArray().then((result) => {
        result[0].planner.forEach((element) => {
            if (element.day === day) {
                const query = { 'planner.day': day };
                const values = { $set: { 'planner.$.recipe': recipeName } };
                db.collection(collectionName).updateOne(query, values, (err) => {
                    if (err) {
                        response = errorResponse(err.message);
                        res.status(serverError).send(response);
                        return;
                    }

                    response = successResponse(`Recipe '${recipeName}' added`);
                    res.status(created).send(response);
                });
            }
        });
    });
});

module.exports = router;
