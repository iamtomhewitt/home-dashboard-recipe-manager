const mongo = require('mongodb').MongoClient;

const url = process.env.MONGODB_URI || 'mongodb://mongo:27017/recipe_manager';
const recipesCollectionName = 'recipes';
const plannerCollectionName = 'planners';

let db;

module.exports = {

    connectToServer(callback) {
        mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err) {
        return callback(err);
      }
                db = client.db();
                db.listCollections({ name: plannerCollectionName }).next((error, collection) => {
                    if (!collection) {
                        db.collection(plannerCollectionName).updateOne({ planner: { $exists: true } }, {
                            $set: {
                                id: 'test-planner',
              plan: [
                { day: 'Monday', recipe: '' },
                { day: 'Tuesday', recipe: '' },
                { day: 'Wednesday', recipe: '' },
                { day: 'Thursday', recipe: '' },
                { day: 'Friday', recipe: '' },
                { day: 'Saturday', recipe: '' },
                { day: 'Sunday', recipe: '' },
              ],
                            },
                        }, { upsert: true });
                    }
                });
                db.listCollections({ name: recipesCollectionName }).next((error, collection) => {
                    if (!collection) {
                        db.createCollection(recipesCollectionName);
                    }
                });

            return callback(err);
        });
    },

    getDb() {
        return db;
    },
};
