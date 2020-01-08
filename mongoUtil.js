const mongo = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const databaseName = 'recipe_manager';

let db;

module.exports = {

    connectToServer(callback) {
        mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            db = client.db(databaseName);
            db.createCollection('recipes');

            // Create collections
            db.collection('planner').updateOne({ planner: { $exists: true } }, {$set:{
                planner: [
                    {
                        day: 'Monday',
                        recipe: '',
                    },
                    {
                        day: 'Tuesday',
                        recipe: '',
                    },
                    {
                        day: 'Wednesday',
                        recipe: '',
                    },
                    {
                        day: 'Thursday',
                        recipe: '',
                    },
                    {
                        day: 'Friday',
                        recipe: '',
                    },
                    {
                        day: 'Saturday',
                        recipe: '',
                    },
                    {
                        day: 'Sunday',
                        recipe: '',
                    },
                ],
            }}, { upsert: true });
            return callback(err);
        });
    },

    getDb() {
        return db;
    },
};
