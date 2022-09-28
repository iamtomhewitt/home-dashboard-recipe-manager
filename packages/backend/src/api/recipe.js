const express = require('express');
const service = require('../services/recipe');

const route = express.Router();

route.post('/', async (req, res) => {
  try {
    const { id } = req.query;
    const { ingredients, name, steps } = req.body;

    if (!id) {
      return res.status(400).json({ message: '\'id\' is missing from query parameter' });
    }

    await service.saveRecipe(ingredients, name, steps, id);
    return res.status(200).json({ message: `${name} saved!` });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

route.put('/', async (req, res) => {
  try {
    const { id } = req.query;
    const { ingredients, name, steps, originalName } = req.body;

    if (!id) {
      return res.status(400).json({ message: '\'id\' is missing from query parameter' });
    }

    await service.updateRecipe(ingredients, name, steps, originalName, id);
    return res.status(200).json({ message: `${name} updated!` });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

route.delete('/', async (req, res) => {
  try {
    const { name, id } = req.query;

    if (!id) {
      return res.status(400).json({ message: '\'id\' is missing from query parameter' });
    }

    await service.deleteRecipe(name, id);
    return res.status(200).json({ message: `${name} deleted!` });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

module.exports = route;
