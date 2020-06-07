const express = require('express');
const { checkApiKey } = require('../utils/utils');
const {
  success, badRequest, error, created,
} = require('../responses/responses');
const {
  SERVER_ERROR, SUCCESS, UNAUTHORISED, BAD_REQUEST, CREATED,
} = require('../responses/codes');

const mongoUtil = require('../mongoUtil');

const router = express.Router();
const collectionName = 'planners';
require('dotenv').config();

router.get('/', (req, res) => {
  const { day, apiKey, plannerId } = req.query;
  const db = mongoUtil.getDb();
  const failedCheck = checkApiKey(apiKey);

  if (failedCheck) {
    res.status(failedCheck.code).send(failedCheck.response);
    return;
  }

  db.collection(collectionName).find({ id: plannerId }).toArray().then((result) => {
    if (result.length === 0) {
      res.status(SERVER_ERROR).send(error(`Planner ID '${plannerId}' could not be found`));
      return;
    }

    if (day) {
      let dayPlan;
      result[0].plan.forEach((element) => {
        if (element.day === day) {
          dayPlan = element;
        }
      });

      if (dayPlan) {
        res.status(SUCCESS).send({
          ...success('Success'),
          planner: dayPlan,
        });
      } else {
        res.status(UNAUTHORISED).send(error(`Could not get planner: '${day}' not a valid day`));
      }
    } else {
      res.status(SUCCESS).send({
        ...success('Success'),
        planner: result[0].plan,
      });
    }
  });
});

router.post('/add', (req, res) => {
  const { day, apiKey, plannerId } = req.body;
  const recipeName = req.body.recipe;
  const db = mongoUtil.getDb();
  const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const expectedJson = {
    day: '<day>',
    recipe: '<recipe>',
    plannerId: '<plannerId>',
  };
  const failedCheck = checkApiKey(apiKey);

  if (failedCheck) {
    res.status(failedCheck.code).send(failedCheck.response);
    return;
  }

  if (!recipeName || !day || !plannerId) {
    res.status(BAD_REQUEST).send(badRequest(`Planner could not be updated, missing data from JSON body. Expected: ${JSON.stringify(expectedJson)} Got: ${JSON.stringify(req.body)}`));
    return;
  }

  if (validDays.indexOf(day) < 0) {
    res.status(BAD_REQUEST).send(badRequest(`Planner could not be updated: '${day}' not a valid day`));
    return;
  }

  db.collection(collectionName).find({ id: plannerId }).toArray().then((result) => {
    if (result[0] === undefined) {
      res.status(SERVER_ERROR).send(error(`'${plannerId}' planner ID could not be found`));
      return;
    }

    result[0].plan.forEach((element) => {
      if (element.day === day) {
        const query = { id: plannerId, 'plan.day': day };
        const values = { $set: { 'plan.$.recipe': recipeName } };
        db.collection(collectionName).updateOne(query, values, (err) => {
          if (err) {
            res.status(SERVER_ERROR).send(error(err.message));
            return;
          }

          res.status(CREATED).send(created(`Recipe '${recipeName}' added`));
        });
      }
    });
  });
});

router.post('/createPlanner', (req, res) => {
  const { apiKey, plannerId } = req.body;
  const db = mongoUtil.getDb();
  const expectedJson = {
    apiKey: '<apiKey>',
    plannerId: '<plannerId>',
  };
  const failedCheck = checkApiKey(apiKey);

  if (failedCheck) {
    res.status(failedCheck.code).send(failedCheck.response);
    return;
  }

  if (!plannerId) {
    res.status(UNAUTHORISED).send(badRequest(`Planner could not be created, missing data from JSON body. Expected: ${JSON.stringify(expectedJson)} Got: ${JSON.stringify(req.body)}`));
    return;
  }

  db.collection(collectionName).find({ id: plannerId }).toArray().then((result) => {
    if (result.length !== 0) {
      res.status(SERVER_ERROR).send(error('Planner ID already exists'));
      return;
    }

    db.collection(collectionName).insertOne({
      id: plannerId,
      plan: [
        { day: 'Monday', recipe: '' },
        { day: 'Tuesday', recipe: '' },
        { day: 'Wednesday', recipe: '' },
        { day: 'Thursday', recipe: '' },
        { day: 'Friday', recipe: '' },
        { day: 'Saturday', recipe: '' },
        { day: 'Sunday', recipe: '' },
      ],
    }, (err) => {
      if (err) {
        res.status(SERVER_ERROR).send(error(err.message));
        return;
      }
      res.status(SUCCESS).send(success('Planner created'));
    });
  });
});

module.exports = router;
