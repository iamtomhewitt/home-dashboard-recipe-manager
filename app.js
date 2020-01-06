var express = require('express');
var app = express();
var bodyParser = require('body-parser')

var ingredientsRoutes = require('./routes/ingredients-routes')
var recipeRoutes = require('./routes/recipe-routes')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.status(200).send('Recipe manager is up and running!');
});

app.use('/ingredients', ingredientsRoutes);
app.use('/recipes', recipeRoutes);

var port = 3001;
app.listen(process.env.PORT || port, function () { });

console.log("Listening on port: " + port);

module.exports = app;