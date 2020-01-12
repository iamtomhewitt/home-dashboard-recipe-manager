const mongo = require('mongodb').MongoClient;

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipe_manager';

let db;

module.exports = {

    connectToServer(callback) {
        mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err) {
                console.error(err);
            } else {
                db = client.db();
            }
            return callback(err);
        });
    },

    getDb() {
        return db;
    },
};
