const express = require('express');
const service = require('../services/recipe');

const route = express.Router();

route.get('/', async (req, res) => {
  const { recipes } = await service.getData();
  return res.status(200).json(recipes);
});

route.post('/', async (req, res) => {
  try {
    const { ingredients, name, steps } = req.body;
    await service.saveRecipe(ingredients, name, steps);
    return res.status(200).json({ message: `${name} saved!` });
  }
  catch (e) {
    return res.status(500).json({ message: e.message })
  }
});

module.exports = route;