////////////////
// Serveur : gère les requêtes du front
////////////////

const express = require('express')

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017'
const dbName = 'strava';
MongoClient.connect(url, function(err, client) {
  console.log("Connecté à MongoDB");
  const db = client.db(dbName);
  client.close();
});

const app = express()
const port = 3000

var activities = require('./activities');
app.use('/activities', activities);

app.listen(port, () => {
  console.log('Serveur à l\'écoute sur localhost:'+ port);
  }
);

module.exports = app;
