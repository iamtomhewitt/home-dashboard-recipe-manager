const express = require('express');
const firebase = require('../services/firebase');

const route = express.Router();

route.get('/all', async (req, res) => {
  const { planners } = await firebase.getData();
  return res.status(200).json({ planners });
});

route.get('/day', async (req, res) => {
  try {
    const { id, day } = req.query;
    const { planner: plan } = await firebase.getPlanner(id);
    const planForDay = plan.find(p => p.day === day);
    return res.status(200).json({ ...planForDay });
  }
  catch (e) {
    return res.status(500).json({ message: e.message })
  }
});

route.put('/', async (req, res) => {
  try {
    const { body, query } = req;
    const { id } = query;

    await firebase.updatePlanner(id, body)
    return res.status(200).json({});
  }
  catch (e) {
    return res.status(500).json({ message: e.message })
  }
})

route.get('/:id', async (req, res) => {
  try {
    const { planner } = await firebase.getPlanner(req.params.id);
    return res.status(200).json({ planner });
  }
  catch (e) {
    return res.status(500).json({ message: e.message })
  }
});

module.exports = route;