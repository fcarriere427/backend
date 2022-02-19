////////////////
// Serveur : gère les requêtes du front
////////////////

const express = require('express')
const app = express()
const port = 3000

var activities_list = require('./activities_list');
app.use('/activities_list', activities_list);

app.listen(port, () => {
  console.log('Serveur à l\'écoute sur localhost:'+ port);
  }
);

module.exports = app;
