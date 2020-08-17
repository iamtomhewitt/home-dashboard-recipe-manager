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

router.get('/', async (req, res) => {
  const { day, apiKey, plannerId } = req.query;
  const failedCheck = checkApiKey(apiKey);

  if (failedCheck) {
    res.status(failedCheck.code).json(failedCheck);
    return;
  }

  const result = await mongoUtil.findPlanner(plannerId);
  const planner = result[0];

  if (!planner) {
    res.status(SERVER_ERROR).json(error(`Planner ID '${plannerId}' could not be found`));
    return;
  }

  if (day) {
    let dayPlan;
    planner.plan.forEach((element) => {
      if (element.day === day) {
        dayPlan = element;
      }
    });

    if (dayPlan) {
      res.status(SUCCESS).json({
        ...success('Success'),
        planner: dayPlan,
      });
    } else {
      res.status(BAD_REQUEST).json(error(`Could not get planner: '${day}' not a valid day`));
    }
  } else {
    res.status(SUCCESS).json({
      ...success('Success'),
      planner: planner.plan,
    });
  }
});

router.post('/add', async (req, res) => {
  const {
    day, apiKey, plannerId, recipe,
  } = req.body;
  const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const expectedJson = {
    day: '<day>',
    recipe: '<recipe>',
    plannerId: '<plannerId>',
  };
  const failedCheck = checkApiKey(apiKey);

  if (failedCheck) {
    res.status(failedCheck.code).json(failedCheck);
    return;
  }

  if (!recipe || !day || !plannerId) {
    res.status(BAD_REQUEST).json(badRequest(`Planner could not be updated, missing data from JSON body. Expected: ${JSON.stringify(expectedJson)} Got: ${JSON.stringify(req.body)}`));
    return;
  }

  if (validDays.indexOf(day) < 0) {
    res.status(BAD_REQUEST).json(badRequest(`Planner could not be updated: '${day}' not a valid day`));
    return;
  }

  const result = await mongoUtil.findPlanner(plannerId);
  const planner = result[0];
  if (!planner) {
    res.status(SERVER_ERROR).json(error(`'${plannerId}' planner ID could not be found`));
    return;
  }

  planner.plan.forEach((element) => {
    if (element.day === day) {
      const query = { id: plannerId, 'plan.day': day };
      const values = { $set: { 'plan.$.recipe': recipe } };

      mongoUtil.updatePlanner(query, values).then((updateResult) => {
        if (!updateResult.value) {
          res.status(SERVER_ERROR).json(error(`Could not update ${recipe}, and unknown error occured.`));
          return;
        }
        res.status(CREATED).json(created(`Recipe '${recipe}' added`));
      });
    }
  });
});

router.post('/createPlanner', async (req, res) => {
  const { apiKey, plannerId } = req.body;
  const expectedJson = {
    apiKey: '<apiKey>',
    plannerId: '<plannerId>',
  };
  const failedCheck = checkApiKey(apiKey);

  if (failedCheck) {
    res.status(failedCheck.code).json(failedCheck);
    return;
  }

  if (!plannerId) {
    res.status(UNAUTHORISED).json(badRequest(`Planner could not be created, missing data from JSON body. Expected: ${JSON.stringify(expectedJson)} Got: ${JSON.stringify(req.body)}`));
    return;
  }

  const result = await mongoUtil.findPlanner(plannerId);
  const planner = result[0];
  if (planner) {
    res.status(SERVER_ERROR).json(error('Planner ID already exists'));
    return;
  }

  mongoUtil.addNewPlanner(plannerId).then((data) => {
    if (!data) {
      res.status(SERVER_ERROR).json(error('Could not add a new planner'));
      return;
    }
    res.status(SUCCESS).json(success('Planner created'));
  });
});

module.exports = router;
