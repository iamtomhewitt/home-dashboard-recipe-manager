const express = require('express');
const service = require('../services/shopping-list');

const route = express.Router();

route.get('/', async (req, res) => {
  try {
    const shoppingList = await service.getShoppingList(req.query.id);
    return res.status(200).json(shoppingList);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

module.exports = route;
