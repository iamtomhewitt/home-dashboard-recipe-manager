const mongo = require('mongodb').MongoClient;

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipe_manager';

let db;

module.exports = {

    connectToServer(callback) {
        mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`Connected to: ${url}`);
                db = client.db();

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
            }
            return callback(err);
        });
    },

    getDb() {
        return db;
    },
};
