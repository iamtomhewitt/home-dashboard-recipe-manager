const express = require('express');
const route = express.Router();

const firebase = require('../services/firebase');

route.get('/:id', async (req, res) => {
  const planner = await firebase.getPlanner(req.params.id);
  return res.status(200).json({ planner });
});

module.exports = route;