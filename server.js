////////////////
// Serveur : gère les requêtes du front
////////////////

const express = require('express')
const app = express()
const port = 3000
var router = express.Router();
var list_activities = require('./list_activities');

router.get('/', function(req, res, next) {
  console.log('/ has been called');
  //list_activities;
  res.end();
});

router.get('/strava_app/', function(req, res, next) {
  console.log('/strava_app has been called');
  //list_activities;
  res.end();
});

router.get('/strava_app/list_activities', function(req, res, next) {
  console.log('/strava_app/list_activities has been called')
  res.end();
});

app.use(function timeLog(req, res, next) {
  let newDate = new Date(Date.now());
  console.log(`***** App use: ${newDate.toDateString()} ${newDate.toTimeString()}`);
  next();
});

app.use(router);

app.listen(port, () => {
  console.log('Serveur à l\'écoute sur localhost:'+ port);
});

module.exports = app;
