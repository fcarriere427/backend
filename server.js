////////////////
// Serveur : gère les requêtes du front
////////////////

const express = require('express')
const app = express()
const port = 3000

var list_activities = require('./list_activities');
app.use('/list_activities', list_activities);

var fetch_activities = require('./fetch_activities');
app.use('/fetch_activities', fetch_activities);

app.listen(port, () => {
  console.log('Serveur à l\'écoute sur localhost:'+ port);
  }
);

module.exports = app;
