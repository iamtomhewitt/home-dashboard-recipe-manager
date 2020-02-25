const express = require('express');
const mongoUtil = require('../mongoUtil');
require('dotenv').config();

const router = express.Router();

const collectionName = 'planners';

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
    const { plannerId } = req.query;
    const db = mongoUtil.getDb();

    let response;

    const failedCheck = checkApiKey(apiKey);
    if (failedCheck) {
        res.status(failedCheck.code).send(failedCheck.response);
        return;
    }

    const query = {};
    query[plannerId] = { $exists: true };

    db.collection(collectionName).find(query).toArray().then((result) => {
        if (day) {
            let dayPlan;
            result[0][plannerId].plan.forEach((element) => {
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
            response.planner = result[0][plannerId].plan;
            res.status(success).send(response);
        }
    });
});

router.post('/add', (req, res) => {
    const { day } = req.body;
    const { apiKey } = req.body;
    const { plannerId } = req.body;
    const recipeName = req.body.recipe;
    const db = mongoUtil.getDb();
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const expectedJson = {
        day: '<day>',
        recipe: '<recipe>',
        plannerId: '<plannerId>',
    };

    let response;

    const failedCheck = checkApiKey(apiKey);
    if (failedCheck) {
        res.status(failedCheck.code).send(failedCheck.response);
        return;
    }

    if (!recipeName || !day || !plannerId) {
        response = badRequestResponse(`Planner could not be updated, missing data from JSON body. Expected: ${JSON.stringify(expectedJson)} Got: ${JSON.stringify(req.body)}`);
        res.status(badRequest).send(response);
        return;
    }

    if (validDays.indexOf(day) < 0) {
        response = badRequestResponse(`Planner could not be updated: '${day}' not a valid day`);
        res.status(badRequest).send(response);
        return;
    }

    db.collection(collectionName).find({ id: plannerId }).toArray().then((result) => {
        if (result[0] === undefined) {
            response = errorResponse(`'${plannerId}' planner ID could not be found`);
            res.status(serverError).send(response);
            return;
        }

        result[0].plan.forEach((element) => {
            if (element.day === day) {
                const query = { 'plan.day': day };
                const values = { $set: { 'plan.$.recipe': recipeName } };
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

router.post('/createPlanner', (req, res) => {
    const { apiKey } = req.body;
    const { plannerId } = req.body;
    const db = mongoUtil.getDb();
    const expectedJson = {
        apiKey: '<apiKey>',
        plannerId: '<plannerId>',
    };
    let response;

    const failedCheck = checkApiKey(apiKey);
    if (failedCheck) {
        res.status(failedCheck.code).send(failedCheck.response);
        return;
    }

    if (!plannerId) {
        response = badRequestResponse(`Planner could not be updated, missing data from JSON body. Expected: ${JSON.stringify(expectedJson)} Got: ${JSON.stringify(req.body)}`);
        res.status(badRequest).send(response);
        return;
    }

    db.collection(collectionName).find({ id: plannerId }).toArray().then((result) => {
        if (result.length !== 0) {
            response = errorResponse('Planner ID already exists');
            res.status(serverError).send(response);
            return;
        }

        db.collection(collectionName).insertOne({
            id: plannerId,
            plan: [{ day: 'Monday', recipe: '' }, { day: 'Tuesday', recipe: '' }, { day: 'Wednesday', recipe: '' }, { day: 'Thursday', recipe: '' }, { day: 'Friday', recipe: '' }, { day: 'Saturday', recipe: '' }, { day: 'Sunday', recipe: '' }],
        }, (err) => {
            if (err) {
                console.log(err.message);
                response = errorResponse(err.message);
                res.status(serverError).send(response);
                return;
            }
            response = successResponse('Planner created');
            res.status(success).send(response);
        });
    });
});

module.exports = router;
