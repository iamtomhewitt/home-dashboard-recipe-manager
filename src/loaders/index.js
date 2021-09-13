const expressLoader = require('./express');
const corsLoader = require('./cors');

module.exports = async (app) => {
  await corsLoader(app);
  await expressLoader(app);
};
