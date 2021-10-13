/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const loaders = require('./loaders');

require('dotenv').config({ path: path.join(__dirname, '/../../../.env') });

async function startServer() {
  const app = express();
  await loaders(app);
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
