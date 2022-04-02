////////////////
// Serveur : gère les requêtes du front
// ***********************
// Prérequis NGINX : définir la route (reverse proxy) dans le fichier de conf nginx (dans /etc/nginx/sites-available/letsq.xyz)
// ***********************

//// Require
const express = require('express')
// Fonctions d'accès à la DB
const dbFun = require('./dbFunctions');
const utils = require('./utils');

// Definition
const app = express()
const port = 3001

// création et lancement du serveur
require("./routes")(app);
app.listen(port, () =>
    console.log(`App listening at http://localhost:${port}`)
);

//Log console à chaque appel
app.use(function timeLog(req, res, next) {
  let newDate = new Date(Date.now());
  console.log(`Appel backend : ${newDate.toDateString()} ${newDate.toTimeString()}`);
  // ci-dessous : pour problème CORS en dev (avec react, pour accès local)
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

module.exports = app;
