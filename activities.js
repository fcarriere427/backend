///// ***** A AMELIORER / PERF : on ne devrait pas renouveler l'access token à chaque fois, mais plutôt le tester, et le renouveler si besoin uniquement...


// ***********************
// Préambule : il faut définir la route dans le fichier de conf de nginx (as a reverse proxy)
// Voir le bloc existant /etc/nginx/sites-available/letsq.xyz
// (A reproduire pour chaque route)
// ***********************

const express = require('express');
const fs = require('fs');
const https = require('https');

var router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log('Appel de la route Activities @ : ', Date.now());
  next();
});


router.get('/', function(req, res) {
  //// Préparation des éléments pour la requête de renouvellement sur l'API strava
  // Lecture des clés Strava dans un fichier
  var data = fs.readFileSync('./keys/strava_keys.json'), myObj;
  // Récupération des clés dans des variables locales
  try {
    myObj = JSON.parse(data);
    var id = myObj.client_id;
    var secret = myObj.client_secret;
    var refresh_token = myObj.refresh_token;
    var access_token = myObj.access_token;
    var expires_at = myObj.expires_at;
  } catch (err) {
    console.log('Il manque le fichier des clés Strava !')
    console.error(err)
  }

  /// ICI : si refresh_expiration < current time, alors lancer une requête avec "refresh_token" et enregistrer les nouveaux codes et times
  /// /!\ attention, il va falloir enchainer les promises...
  /// a priori :
  /// Si refresh_expiration (en secondes) < current time (="Date.now()" qui renvoie des millisecondes)
  /// Then httpsRequest('refresh')
  ///   .then httpsRequest('activities')
  ///   .then res.send(...)
  /// Else httpsRequest('activities')
  ///   .then res.send(...)


  //// REQUETE POUR RENOUVELLER LE REFRESH_TOKEN
  // Prépare des variables passées à la  requête
  var body = JSON.stringify({
    client_id: id,
    client_secret: secret,
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
  httpsRequest(options,body).then(function(body) {
    access_token = myObj.access_token;
    expires_at = myObj.expires_at;
    refresh_token = myObj.refresh_token;

    current_time = Math.trunc(Date.now()/1000);
    difference =  current_time - expires_at;
    console.log("Résultat du refresh_token : ");
    console.log('current time = '+ current_time + " vs. expires_at = " + expires_at);
    console.log('différence = ' + difference);
    if (current_time > expires_at) {
      console.log("là, il faudrait renouveller")
    } else {
      console.log("là, pas la peine de renouveller")
    }

    keys = JSON.stringify({
      refresh_token: refresh_token,
      access_token: access_token,
      expires_at: expires_at
    })
    console.log("Keys = " + keys);
    saveData(keys);
  })
  .then(function(body) {
    var options = `https://www.strava.com/api/v3/athlete/activities?access_token=${access_token}`;
    var body = '';
    // Lance la requête de récupération des activités
    httpsRequest(options)
    .then(function(body) {
      // Ici on a bien les données str dispo --> les renvoyer à la requete
      ///// ***** A AMELIORER : on devrait les stocker dans une BDD...
      res.status(200).json(body);
    })
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
        console.log("message d'erreur httpsRequest);
        console.error(error);
      })
      // IMPORTANT
      req.end();
  });
}

function saveData(data) {
  fs.writeFile('./keys/strava_keys.json', data, 'utf-8', (err) => {
      console.log('Keys file updated')
  })
}

module.exports = router;
