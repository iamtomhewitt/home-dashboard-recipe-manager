const express = require('express');
const service = require('../services/recipe');

const route = express.Router();

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
