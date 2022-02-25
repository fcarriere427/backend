// ***********************
// Préambule : il faut définir la route dans le fichier de conf de nginx (as a reverse proxy)
// Voir le bloc existant /etc/nginx/sites-available/letsq.xyz
// ***********************

// Définition du router
const express = require('express');
const fs = require('fs');
const https = require('https');
var router = express.Router();

// Récupération des clés et tokens
// /!\ Suppose qu'on a fait les premières opérations d'authentification (on a un refresh_token, même obsolète --> cf. doc API Strava + postman)
const keys = require('./keys/strava.json');
const tokens =  require('./keys/tokens.json');
var client_id = keys.client_id;
var client_secret = keys.client_secret;
var access_token = tokens.access_token;
var expires_at = tokens.expires_at;
var refresh_token = tokens.refresh_token;

// Fonctions d'accès à la DB
const updateDB = require('./updateDB');
const readDB = require('./readDB');

// Log console du router à chaque appel
router.use(function timeLog(req, res, next) {
  let newDate = new Date(Date.now());
  console.log(`Appel de router : ${newDate.toDateString()} ${newDate.toTimeString()}`);
  next();
});

/////////////////////////////
///////// ROUTES ////////////
/////////////////////////////
router.get('/strava_app/list', function(req, res) {
  readDB()
  .then((data) => {
    console.log("data dans le router = " + data.stringify());
    console.log("... et voici la liste des activités !");
    res.status(200).json(data);
  })
});

router.get('/strava_app/update', function(req, res) {
  // NB : copie de /reload, mais avec nbPages = 1
  var nbPages = 1;
  renewTokens()
  .then(() => getActivities(nbPages))
  .then((data) => {
    console.log("... dernières activités récupérées, OK !");
    res.status(200).json(data);
  })
});

router.get('/strava_app/reload', function(req, res) {
  // param de getActivities = nbPages --> ici 7(*100) car 615 activités Strava le 22/02/22 (cf. dashboard Strava) --> il faut mettre la centaine supérieure, pas plus !
  var nbPages = 7;
  renewTokens()
  .then(() => getActivities(nbPages))
  .then((data) => {
    console.log("... toutes activités récupérées, OK !");
    res.status(200).json(data);
  })
});

/////////////////////////////
//////// FONCTIONS //////////
/////////////////////////////

// REQUETE POUR RECUPERER LES ACTIVITES


// REQUETE POUR RECUPERER LES ACTIVITES
async function getActivities(nbPages) {
  var page = 1;
  var nbActivities = 100;
  // Lance la requête de récupération des activités
  for(let i = 0; i < nbPages; i++){
    console.log('Récupération des activités Strava, pour la page ' + (i+1) + ' sur ' + nbPages + '...');
    var options = `https://www.strava.com/api/v3/athlete/activities?page=` + page + `&per_page=`+ nbActivities + `&access_token=${access_token}`;
    await httpsRequest(options)
    .then(data => updateDB(data))
    .catch((err) => console.log(err))
  }
  // fake return!!! Renvoyer le nb de données récupérées = la taille de la DB
  return(527);
}

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

module.exports = router;
