////////////////
// Serveur : gère les requêtes du front
////////////////

const express = require('express')
const app = express()
const port = 3000

var activities = require('./activities');

app.use('/activities', activities);

app.get('/', (req, res) => {
  res.send('réponse de server.js');
});

app.get('/activities', (req, res) => {
  res.send('ici il faudrait appeler la route activities');
});

app.listen(port, () => {
  console.log('Running on http://localhost:'+ port);
  }
);

//module.exports = app;
