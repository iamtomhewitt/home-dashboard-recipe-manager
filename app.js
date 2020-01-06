var express = require('express');
var app = express();
var bodyParser = require('body-parser')

var ingredientsRoutes = require('./routes/ingredients-routes')
var recipeRoutes = require('./routes/recipe-routes')
var plannerRoutes = require('./routes/planner-routes')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.status(200).send('Recipe manager is up and running!');
});

app.use('/ingredients', ingredientsRoutes);
app.use('/recipes', recipeRoutes);
app.use('/planner', plannerRoutes);

var port = 3001;
app.listen(process.env.PORT || port, function () { });

console.log("Listening on port: " + port);

module.exports = app;