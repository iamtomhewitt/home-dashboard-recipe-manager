const express = require('express');
const service = require('../services/planner');

const route = express.Router();

route.get('/all', async (req, res) => {
  const { planners } = await service.getData();
  return res.status(200).json({ planners });
});

route.get('/day', async (req, res) => {
  try {
    const { id, day } = req.query;
    const { plan } = await service.getPlanner(id);
    const planForDay = plan.find((p) => p.day === day);
    return res.status(200).json({ ...planForDay });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

route.put('/', async (req, res) => {
  try {
    const { body, query } = req;
    const { id } = query;

    await service.updatePlanner(id, body);
    return res.status(200).json({});
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

route.get('/:id', async (req, res) => {
  try {
    const planner = await service.getPlanner(req.params.id);
    return res.status(200).json(planner);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

module.exports = route;
