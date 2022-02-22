////////////////
// Serveur : gère les requêtes du front
////////////////

const express = require('express')
const app = express()
const port = 3000
var router = express.Router();

var list_activities = require('./list_activities');
var update_activities = require('./update_activities');
var reload_activities = require('./reload_activities');

app.use(function timeLog(req, res, next) {
  let newDate = new Date(Date.now());
  console.log(`***** App use: ${newDate.toDateString()} ${newDate.toTimeString()}`);
  next();
});

app.use(list_activities);
app.use(update_activities);
app.use(reload_activities);

app.listen(port, () => {
  console.log('Serveur à l\'écoute sur localhost:'+ port);
});

module.exports = app;
