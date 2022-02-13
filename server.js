////////////////
// Serveur : gère les requêtes du front
////////////////

import nano from 'nano';
import prom from 'nano-promises';

const express = require('express')
const app = express()
const port = 3000

var activities = require('./activities');
app.use('/activities', activities);

app.listen(port, () => {
  console.log('Serveur à l\'écoute sur localhost:'+ port);
  }
);

module.exports = app;
