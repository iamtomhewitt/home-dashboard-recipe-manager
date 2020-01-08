const express = require('express');

const app = express();
const bodyParser = require('body-parser');

const recipeRoutes = require('./routes/recipe-routes');
const plannerRoutes = require('./routes/planner-routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).send('Recipe manager is up and running!');
});

app.use('/recipes', recipeRoutes);
app.use('/planner', plannerRoutes);

const port = 3001;
app.listen(process.env.PORT || port, () => { });

module.exports = app;
