const mongo = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const databaseName = 'recipe_manager';

let db;

module.exports = {

    connectToServer(callback) {
        mongo.connect(process.env.MONGODB_URI || url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            db = client.db(process.env.MONGODB_DATABASE_NAME || databaseName);

            // Create collections
            db.createCollection('recipes');
            db.collection('planner').updateOne({ planner: { $exists: true } }, {
                $set: {
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
                },
            }, { upsert: true });
            return callback(err);
        });
    },

    getDb() {
        return db;
    },
};
