const mongo = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const databaseName = 'recipe_manager';

let db;

module.exports = {

    connectToServer(callback) {
        mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            db = client.db(databaseName);
            db.collection('recipes');
            db.collection('planner');
            return callback(err);
        });
    },

    getDb() {
        return db;
    },
};
