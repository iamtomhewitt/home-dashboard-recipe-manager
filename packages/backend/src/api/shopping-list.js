const express = require('express');
const service = require('../services/shopping-list');

const route = express.Router();

route.get('/', async (req, res) => {
  const shoppingList = await service.getShoppingList(req.query.id);
  return res.status(200).json(shoppingList);
});

module.exports = route;
