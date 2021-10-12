const bodyParser = require('body-parser');
const express = require('express');
const listEndpoints = require('express-list-endpoints');
const path = require('path')

const plannerRoute = require('../api/planner');
const recipeRoute = require('../api/recipe');
const shoppingListRoute = require('../api/shopping-list');
const { version } = require('../../package.json');

module.exports = async (app) => {
  const buildFolder = path.join(__dirname + '/../../../frontend/build')
  console.log(buildFolder)
  console.log(path.join(buildFolder, '/index.html'))
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/planner', plannerRoute);
  app.use('/recipes', recipeRoute);
  app.use('/shoppingList', shoppingListRoute);
  app.use(express.static(buildFolder))

  app.get('/health', (req, res) => {
    res.json({ status: 'UP', version, endpoints: listEndpoints(app) });
  });
  
  // Anything that doesn't match the above, send back the index.html file
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildFolder, '/index.html'))
  })
};
