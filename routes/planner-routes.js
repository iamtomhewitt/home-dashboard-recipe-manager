const express = require('express');
const { checkApiKey } = require('../utils/utils');
const {
  success, badRequest, error, created,
} = require('../responses/responses');
const {
  SERVER_ERROR, SUCCESS, UNAUTHORISED, BAD_REQUEST, CREATED,
} = require('../responses/codes');

const mongoUtil = require('../utils/mongoUtil');

const router = express.Router();
require('dotenv').config();

router.get('/', (req, res) => {
  const { day, apiKey, plannerId } = req.query;
  const failedCheck = checkApiKey(apiKey);

  if (failedCheck) {
    res.status(failedCheck.code).send(failedCheck);
    return;
  }

  mongoUtil.findPlanner(plannerId).then((result) => {
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
        res.status(BAD_REQUEST).send(error(`Could not get planner: '${day}' not a valid day`));
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
  const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const expectedJson = {
    day: '<day>',
    recipe: '<recipe>',
    plannerId: '<plannerId>',
  };
  const failedCheck = checkApiKey(apiKey);

  if (failedCheck) {
    res.status(failedCheck.code).send(failedCheck);
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

  mongoUtil.findPlanner(plannerId).then((result) => {
    if (result[0] === undefined) {
      res.status(SERVER_ERROR).send(error(`'${plannerId}' planner ID could not be found`));
      return;
    }

    result[0].plan.forEach((element) => {
      if (element.day === day) {
        const query = { id: plannerId, 'plan.day': day };
        const values = { $set: { 'plan.$.recipe': recipeName } };

        mongoUtil.updatePlanner(query, values).then((updateResult) => {
          if (!updateResult.value) {
            res.status(SERVER_ERROR).send(error(`Could not update ${recipeName}, and unknown error occured.`));
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
  const expectedJson = {
    apiKey: '<apiKey>',
    plannerId: '<plannerId>',
  };
  const failedCheck = checkApiKey(apiKey);

  if (failedCheck) {
    res.status(failedCheck.code).send(failedCheck);
    return;
  }

  if (!plannerId) {
    res.status(UNAUTHORISED).send(badRequest(`Planner could not be created, missing data from JSON body. Expected: ${JSON.stringify(expectedJson)} Got: ${JSON.stringify(req.body)}`));
    return;
  }

  mongoUtil.findPlanner(plannerId).then((result) => {
    if (result.length !== 0) {
      res.status(SERVER_ERROR).send(error('Planner ID already exists'));
      return;
    }

    mongoUtil.addNewPlanner(plannerId).then((data) => {
      if (!data) {
        res.status(SERVER_ERROR).send(error('Could not add a new planner'));
        return;
      }
      res.status(SUCCESS).send(success('Planner created'));
    });
  });
});

module.exports = router;
