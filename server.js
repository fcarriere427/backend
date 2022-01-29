////////////////
// Serveur : gère les requêtes du front
////////////////

const express = require('express')
const app = express()
const port = 3000

app.get('/test', (req, res) => {
  res.send('réponse du serveur !');
});

app.listen(port, () => {
  console.log('Running on http://localhost:'+ port);
  }
);

//module.exports = app;
