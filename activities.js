// ***** A AMELIORER / PERF : on ne devrait pas renouveler l'access token à chaque fois, mais plutôt le tester, et le renouveler si besoin uniquement...

// ***********************
// Préambule : il faut définir la route dans le fichier de conf de nginx (as a reverse proxy)
// Voir le bloc existant /etc/nginx/sites-available/letsq.xyz
// ***********************

const express = require('express');
const fs = require('fs');
const https = require('https');
var router = express.Router();

var client_id = "init_id";
var client_secret = "init_secret";
var access_token = "init_access_token";
var expires_at = 0;
var refresh_token = "init_refresh_token";

router.use(function timeLog(req, res, next) {
  console.log('Appel de la route Activities @ : ', Date.now());
  next();
});

router.get('/', function(req, res) {
  // Récupération des clés et tokens
  readData()
  .then( () => {
    //Décider si besoin de renouveller les tokens
    current_time = Math.trunc(Date.now()/1000);
    if (current_time > expires_at) {
      // Si oui, on renouvelle, et on lance getActivities
      renewTokens()
      .then( () => {
        getActivities().
        then( (data) => {
          console.log("RES = " + res);
          res.status(200).json(data)}
        )
      })
    } else {
      // Sinon, on lance getActivities sans renouveller
      getActivities().
      then( (data) => {res.status(200).json(data)} )
    }
  })
});

function httpsRequest(params, postData) {
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
                body = JSON.parse(Buffer.concat(body).toString());
              } catch(e) { reject(e);}
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
        else resolve(data);
    });
  });
}

function readData() {
// à faire, sur la base du saveData, pour lire les fichiers locaux
  console.log("Récupération des clés et tokens...");
  return new Promise(function(resolve, reject) {
    // Récupération des deux clés permanentes
    var data = fs.readFileSync('./keys/strava_keys.json'), myObj;
    try {
      myObj = JSON.parse(data);
      client_id = myObj.client_id;
      client_secret = myObj.client_secret;
    } catch (err) {
      console.error(err)
    }
    // Récupération des tokens
    var data = fs.readFileSync('./keys/tokens.json'), myObj;
    try {
      myObj = JSON.parse(data);
      access_token = myObj.access_token;
      expires_at = myObj.expires_at;
      refresh_token = myObj.refresh_token;
    } catch (err) {
      console.error(err)
    }
    resolve();
  });
}

// REQUETE POUR RECUPERER LES ACTIVITES
function getActivities() {
  console.log("Récupération des activités...");
  return new Promise(function(resolve, reject) {
    var options = `https://www.strava.com/api/v3/athlete/activities?access_token=${access_token}`;
    // Lance la requête de récupération des activités
    httpsRequest(options)
    .then((data) => {
      ///// ***** A AMELIORER : on devrait les stocker dans une BDD...
      resolve(data);
    })
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
      keys = JSON.stringify({
        refresh_token: refresh_token,
        access_token: access_token,
        expires_at: expires_at
      })
      saveData(keys, './keys/tokens.json');
    })
    resolve();
  })
}

module.exports = router;
