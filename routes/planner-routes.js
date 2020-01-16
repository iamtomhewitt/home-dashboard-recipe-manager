const express = require('express');
const mongoUtil = require('../mongoUtil');

const router = express.Router();

const collectionName = 'planner';

const successCode = 200;
const clientErrorCode = 400;
const errorCode = 502;

function success(message) {
    return {
        status: successCode,
        message,
    };
}

function clientError(message) {
    return {
        status: clientErrorCode,
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
    const { day } = req.query;
    const db = mongoUtil.getDb();

    let response;

    db.collection(collectionName).find().toArray().then((result) => {
        if (day) {
            let dayPlan;
            result[0].planner.forEach((element) => {
                if (element.day === day) {
                    dayPlan = element;
                }
            });

            if (dayPlan) {
                response = success('Success');
                response.planner = dayPlan;
                res.status(successCode).send(response);
            } else {
                response = error(`Could not get planner: '${day}' not a valid day`);
                res.status(clientErrorCode).send(response);
            }
        } else {
            response = success('Success');
            response.planner = result;
            res.status(successCode).send(response);
        }
    });
});

router.post('/add', (req, res) => {
    const { day } = req.body;
    const recipeName = req.body.recipe;
    const db = mongoUtil.getDb();
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const expectedJson = {
        day: '<day>',
        recipe: '<recipe>',
    };

    let response;

    if (!recipeName || !day) {
        response = clientError(`Planner could not be updated, missing data from JSON body. Expected: ${JSON.stringify(expectedJson)} Got: ${JSON.stringify(req.body)}`);
        res.status(clientErrorCode).send(response);
        return;
    }

    if (validDays.indexOf(day) < 0) {
        response = clientError(`Planner could not be updated: '${day}' not a valid day`);
        res.status(clientErrorCode).send(response);
        return;
    }

    db.collection(collectionName).find().toArray().then((result) => {
        result[0].planner.forEach((element) => {
            if (element.day === day) {
                const query = { 'planner.day': day };
                const values = { $set: { 'planner.$.recipe': recipeName } };
                db.collection(collectionName).updateOne(query, values, (err) => {
                    if (err) {
                        response = error(err.message);
                        res.status(successCode).send(response);
                        return;
                    }

                    response = success(`Recipe '${recipeName}' added`);
                    res.status(successCode).send(response);
                });
            }
        });
    });
});

module.exports = router;
