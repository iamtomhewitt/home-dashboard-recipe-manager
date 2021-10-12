/* eslint-disable no-console */
const express = require('express');
const loaders = require('./loaders');
const path = require('path')

require('dotenv').config();

async function startServer() {
  const app = express();
  await loaders(app);

  app.use(express.static(path.join(__dirname, '/packages/frontend/build')))
  // Anything that doesn't match the above, send back the index.html file
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/packages/frontend/build/index.html'))
  })
  const port = process.env.PORT || 3001;

  app.listen(port, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Server ready on port: ${port}`);
  });
}

startServer();
