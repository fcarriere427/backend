// ***********************
// Préambule : il faut définir la route dans le fichier de conf de nginx (as a reverse proxy)
// Voir le bloc existant /etc/nginx/sites-available/letsq.xyz
// ***********************

// Définition du router
const express = require('express');
const fs = require('fs');
const https = require('https');
var router = express.Router();

// Fonctions d'accès à la DB
const updateDB = require('./updateDB');

// Récupération des clés et tokens
// /!\ Suppose qu'on a fait les premières opérations d'authentification (on a un refresh_token, même obsolète --> cf. doc API Strava + postman)
const keys = require('./keys/strava.json');
const tokens =  require('./keys/tokens.json');
var client_id = keys.client_id;
var client_secret = keys.client_secret;
var access_token = tokens.access_token;
var expires_at = tokens.expires_at;
var refresh_token = tokens.refresh_token;

router.use(function timeLog(req, res, next) {
  let newDate = new Date(Date.now());
  console.log(`***** Appel de fetch_activities : ${newDate.toDateString()} ${newDate.toTimeString()}`);
  // console.log('client_id : ' + client_id);
  // console.log('client_secret : ' + client_secret);
  // console.log('access_token : ' + access_token);
  // console.log('expires_at : ' + expires_at);
  // console.log('refresh_token : ' + refresh_token);
  next();
});

router.get('/', function(req, res) {
  //Décider si besoin de renouveller les tokens
  current_time = Math.trunc(Date.now()/1000);
  if (current_time > expires_at) {
    // Si oui, on renouvelle, et on lance getActivities
    renewTokens()
//TO DO : supprimer / récréer la DB ? --> fonction à créer dans updateDB
    .then(() => getActivities(1)) // on commence par la page 1
    .then((data) => res.status(200).json(data))
  } else {
    // Sinon, on lance getActivities sans renouveller
//TO DO : supprimer / récréer la DB ? --> fonction à créer dans updateDB
    getActivities(1) // on commence par la page 1
    .then((data) => res.status(200).json(data))
  }
});

// REQUETE POUR RECUPERER LES ACTIVITES
function getActivities(page) {
  return new Promise(function(resolve, reject) {
    // nbActivities = 614 le 20/02/22 (lu sur le dashboard Strava)
    var nbActivities = 100;
    var nbPages = 7;
    // Lance la requête de récupération des activités : attention limite par page... --> obligé de faire une boucle
    // on ne met pas de bloc d'incrémentation dans le for : on le fait dans un then pour forcer la séquentialité
    console.log('Récupération des activités Strava, pour la page ' + page);
    var options = `https://www.strava.com/api/v3/athlete/activities?page=` + page + `&per_page=`+ nbActivities + `&access_token=${access_token}`;
    httpsRequest(options)
    .then(data => {
      console.log('... OK, activités de la page ' + page + ' récupérées !')
      updateDB(data, page)
      .then((data) => {
        console.log('... OK, données de la page ' + page + ' injectées dans la DB !')
        // on passe à la page suivante
        page = page + 1;
        getActivities(page);
        // si on est à la dernière page, on s'arrête
        if (page == nbPages) {
//// TO DO : récupérer le nb d'activités dans la DB // fake for now
          var number_activities = 527;
          resolve(number_activities)
        };
      })
    })
    .catch((err) => console.log(err))
  });
}

// REQUETE POUR RENOUVELLER LE REFRESH_TOKEN
function renewTokens() {
  console.log("Renouvellement des tokens...");
  return new Promise(function(resolve, reject) {
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
    httpsRequest(options,body)
    // Met à jours les clés Strava (dans le fichier ./keys/strava_keys.json)
    .then((res) => {
      access_token = res.access_token;
      expires_at = res.expires_at;
      refresh_token = res.refresh_token;
      local_keys = JSON.stringify({
        refresh_token: refresh_token,
        access_token: access_token,
        expires_at: expires_at
      })
      // semble se faire après ??? pas grave, on sauve en asynchrone : pas besoin d'attendre pour renvoyer la réponse...
      saveData(local_keys, './keys/tokens.json');
      access_token = tokens.access_token;
      expires_at = tokens.expires_at;
      refresh_token = tokens.refresh_token;
    })
    console.log("... OK, tokens renouvellés !");
    resolve();
  })
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
