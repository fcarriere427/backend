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


///// ***** A AMELIORER / PERF : on ne devrait pas renouveler l'access token à chaque fois, mais plutôt le tester, et le renouveler si besoin uniquement...
router.get('/', function(req, res) {
  //// Préparation des éléments pour la requête de renouvellement sur l'API strava
  // Lecture des clés Strava dans un fichier
  var data = fs.readFileSync('./keys/strava_keys.json'), myObj;
  // Récupération dans 3 variables locales
  try {
    myObj = JSON.parse(data);
    var id = myObj.id;
    var secret = myObj.secret;
    var refresh_token = myObj.refresh_token;
  } catch (err) {
    console.log('Il manque le fichier des clés Strava !')
    console.error(err)
  }
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
    token = body.access_token;
  })
  .then(function(body) {
    var options = `https://www.strava.com/api/v3/athlete/activities?access_token=${token}`;
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
      // IMPORTANT
      req.end();
  });
}

module.exports = router;
