var express = require('express');
var app = express();
var bodyParser = require('body-parser')

var ingredientsRoutes = require('./routes/ingredients-routes')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.status(200).send('SERVER OK');
});

app.use('/ingredients', ingredientsRoutes);

var port = 3001;
app.listen(port, function () { });

console.log("Listening on port: " + port);

module.exports = app;