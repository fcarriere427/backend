////////////////
// Serveur : gère les requêtes du front
////////////////

const express = require('express')
const app = express()
const port = 3000

app.use('/', function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});

var list_activities = require('./list_activities');
app.get('/list_activities', list_activities);

var fetch_activities = require('./fetch_activities');
app.get('/fetch_activities', fetch_activities);

app.listen(port, () => {
  console.log('Serveur à l\'écoute sur localhost:'+ port);
  }
);

module.exports = app;
