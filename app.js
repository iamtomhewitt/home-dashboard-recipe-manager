const express = require('express');
const bodyParser = require('body-parser');
const mongoUtil = require('./mongoUtil');

const app = express();

const recipeRoutes = require('./routes/recipe-routes');
const plannerRoutes = require('./routes/planner-routes');

const { version } = require('./package.json');

mongoUtil.connectToServer((err) => {
    if (err) throw err;

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/recipes', recipeRoutes);
    app.use('/planner', plannerRoutes);

    app.get('/', (req, res) => {
        res.status(200).send({ status: '🍽📝 SERVER OK', version });
    });

    const port = 3001;
    app.listen(process.env.PORT || port, () => { });
});

module.exports = app;
