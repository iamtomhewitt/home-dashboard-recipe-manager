const mongo = require('mongodb').MongoClient;

const url = process.env.MONGODB_URI || 'mongodb://mongo:27017/recipe_manager';
const RECIPES = 'recipes';
const PLANNER = 'planners';

let db;

module.exports = {

  connectToServer(callback) {
    mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
      if (err) {
        return callback(err);
      }
      db = client.db();
      // Create the collections if they do not exist
      db.listCollections({ name: PLANNER }).next((error, collection) => {
        if (!collection) {
          db.collection(PLANNER).updateOne({ planner: { $exists: true } }, {
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
      db.listCollections({ name: RECIPES }).next((error, collection) => {
        if (!collection) {
          db.createCollection(RECIPES);
        }
      });

      return callback(err);
    });
  },

  getDb() {
    return db;
  },

  addRecipe: (name, serves, ingredients, steps) => db.collection(RECIPES).insertOne({
    name,
    serves,
    ingredients,
    steps,
  }),

  deleteRecipe: (recipeName) => db.collection(RECIPES).deleteOne({ name: recipeName }),

  findRecipe: (recipeName) => db.collection(RECIPES).findOne({ name: recipeName }),

  findRecipes: () => db.collection(RECIPES).find().toArray(),

  updateRecipe: (originalName, newName, ingredients, steps, serves) => db.collection(RECIPES).updateOne({ name: originalName }, {
    $set: {
      name: newName, ingredients, steps, serves,
    },
  }),

  findPlanner: (plannerId) => db.collection(PLANNER).find({ id: plannerId }).toArray(),

  updatePlanner: (query, values) => db.collection(PLANNER).findOneAndUpdate(query, values),

  addNewPlanner: (plannerId) => db.collection(PLANNER).insertOne(
    {
      id: plannerId,
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
  ),
};
