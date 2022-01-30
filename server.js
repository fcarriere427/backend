////////////////
// Serveur : gère les requêtes du front
////////////////

const express = require('express')
const app = express()
const port = 3000

var activities = require('./activities');
app.use('/activities', activities);

app.listen(port, () => {
  console.log('Server running on localhost:'+ port);
  }
);

module.exports = app;
