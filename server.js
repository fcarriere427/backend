////////////////
// Serveur : gère les requêtes du front
////////////////

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'strava';
let db;
MongoClient.connect(url, function(err, client) {
  console.log("Connecté à MongoDB");
  db = client.db(dbName);
  client.close();
});

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
