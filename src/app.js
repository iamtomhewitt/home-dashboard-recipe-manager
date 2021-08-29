const express = require('express');
const loaders = require('./loaders');

require('dotenv').config()

async function startServer() {
  console.log(process.env.FIREBASE)
  const app = express();
  await loaders(app);
  const port = process.env.PORT || 3001

  app.listen(port, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Server ready on port: ${port}`);
  });
}

startServer();