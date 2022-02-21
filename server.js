////////////////
// Serveur : gère les requêtes du front
////////////////

const express = require('express')
const app = express()
const port = 3000

app.use(function timeLog(req, res, next) {
  let newDate = new Date(Date.now());
  console.log(`***** App use: ${newDate.toDateString()} ${newDate.toTimeString()}`);
  next();
});

var router = require('./router');
app.get('/strava_app', router);

app.listen(port, () => {
  console.log('Serveur à l\'écoute sur localhost:'+ port);
});

module.exports = app;
