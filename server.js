////////////////
// Serveur : gère les requêtes du front
// ***********************
// Prérequis NGINX : définir la route (reverse proxy) dans le fichier de conf nginx (dans /etc/nginx/sites-available/letsq.xyz)
// ***********************

//// Require
const express = require('express')
const fs = require('fs');
const https = require('https');
// Fonctions d'accès à la DB
const dbFun = require('./dbFunctions');
// /!\ Clés Strava: suppose qu'on a fait les premières opérations d'authentification (on a un refresh_token, même obsolète --> cf. doc API Strava + postman)
const keys = require('./keys/strava.json');
const tokens =  require('./keys/tokens.json');

// Definition
const app = express()
const port = 3001

// Récupération des clés et tokens Strava
var client_id = keys.client_id;
var client_secret = keys.client_secret;
var access_token = tokens.access_token;
var expires_at = tokens.expires_at;
var refresh_token = tokens.refresh_token;

// création et lancement du serveur
require("./routes")(app);
app.listen(port, () =>
    console.log(`App listening at http://localhost:${port}`)
);

//Log console à chaque appel
app.use(function timeLog(req, res, next) {
  let newDate = new Date(Date.now());
  console.log(`Appel de l'app server.js : ${newDate.toDateString()} ${newDate.toTimeString()}`);
  // ci-dessous : pour problème CORS en dev (avec react, pour accès local)
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/////////////////////////////
//////// FONCTIONS //////////
/////////////////////////////

// REQUETE POUR RECUPERER LE SOMMAIRE DES ACTIVITES (https://developers.strava.com/docs/reference/#api-models-SummaryActivity)
// NB : parfois besoin des activités détaillées (https://developers.strava.com/docs/reference/#api-models-DetailedActivity) --> pas fait ici
async function getActivities(nbPages) {
  var page = 1;
  var nbActivities = 100;
  var count = 0;
  // Lance la requête de récupération des activités
  for(let i = 0; i < nbPages; i++){
    var page = i+1;
    console.log('Récupération des activités Strava, pour la page ' + page + ' sur ' + nbPages + '...');
    var options = `https://www.strava.com/api/v3/athlete/activities?page=` + page + `&per_page=`+ nbActivities + `&access_token=${access_token}`;
    await httpsRequest(options)
    .then(data => dbFun.updateDB(data, page))
    .then(data => count = count + data)
    .catch((err) => console.log(err))
  }
  // on renvoie le nb total d'activités créées
  return(count);
}

// REQUETE POUR RECUPERER
// Nécessaire pour avoir tout le détail, notamment la ville...
// function getDetailedActivity(id){}

// REQUETE POUR RENOUVELLER LE REFRESH_TOKEN
async function renewTokens() {
  current_time = Math.trunc(Date.now()/1000);
  //Décider si besoin de renouveller les tokens
  if (current_time > expires_at) {
    console.log("Renouvellement des tokens...");
      // Prépare des variables passées à la  requête
    var body = JSON.stringify({
      client_id: client_id,
      client_secret: client_secret,
      refresh_token: refresh_token,
      grant_type: 'refresh_token'
    })
    var options = {
      hostname: 'www.strava.com',
      port: 443,
      path: '/oauth/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': body.length
      }
    }
    // Lance la requête de renouvellement de l'access_token
    await httpsRequest(options,body)
    // Met à jours les clés Strava (dans le fichier ./keys/strava_keys.json)
    .then((res) => {
      // On renouvelles les tokens locaux
      access_token = res.access_token;
      expires_at = res.expires_at;
      refresh_token = res.refresh_token;
      // on les sauvegarde dans le fichier local en asynchrone (besoin d'attendre pour renvoyer la réponse)
      console.log("... OK, tokens renouvellés !");
      local_keys = JSON.stringify({
        refresh_token: refresh_token,
        access_token: access_token,
        expires_at: expires_at
      })
      saveData(local_keys, './keys/tokens.json');
    })
    .catch(err => console.log('Error: ' + err))
  } else {
    console.log("Tokens valides, pas de renouvellement");
  }
  return(0);
}

function httpsRequest(params, postData) {
    //console.log("Requête http... avec : " + params);
    return new Promise(function(resolve, reject) {
      var req = https.request(params, function(res) {
          // cumulate data
          var body = [];
          res.on('data', function(chunk) {
              body.push(chunk);
          });
          // resolve on end
          res.on('end', function() {
              try {
                body = JSON.parse(Buffer.concat(body).toString()); // --> renvoie un tableau
              }
              catch(e) {
                reject(e);
              }
              resolve(body);
          });
      });
      if (postData) {
          req.write(postData);
      }
      req.on('error', error => {
        console.log("Erreur httpsRequest");
        console.error(error);
      })
      // IMPORTANT
      req.end();
  });
}

function saveData(data, filename) {
  console.log("Sauvegarde des nouveaux tokens...");
  return new Promise(function(resolve, reject) {
    fs.writeFile(filename, data, 'utf-8', (err) => {
        if (err) reject(err);
        else {
          console.log("... OK, tokens sauvegardés !");
          resolve(data);
        }
    });
  });
}

app.listen(port, () => {
  console.log('Serveur à l\'écoute sur localhost:'+ port);
});

module.exports = app;
