////////////////
// Serveur : gère les requêtes du front
////////////////

const express = require('express')
const app = express()
const port = 3000
var router = express.Router();

var router_js = require('./router');

app.use(function timeLog(req, res, next) {
  let newDate = new Date(Date.now());
  console.log(`***** App use: ${newDate.toDateString()} ${newDate.toTimeString()}`);
  next();
});

app.use(router_js);

app.listen(port, () => {
  console.log('Serveur à l\'écoute sur localhost:'+ port);
});

module.exports = app;
