const https = require('https');
const express = require('express');
const fs = require('fs');

var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Tiens, on m\'a appelé à : ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res) {
  var str = getActivities();
  res.status(200).json({
    // récupérer les vraies données Strava :-)
    data: str
  });
  // res.send('Ici, on va appeler les données Strava');
});

// Récupère les activités Strava
function getActivities(){
  //lance le renouvellement de l'access token
  reAuthorize()
  .then(result => {
    console.log("On va lancer getActivities avec token : " + token);
    // appelle API strava avec l'access token qu'on vient de renouveller
    const activities_link = `https://www.strava.com/api/v3/athlete/activities?access_token=${token}`;
    var body = '';
    var req = https.get(activities_link, (res) => {
      var str = '';
      res.on('data', (chunk) => {
        str += chunk;
      })
      res.on('end', () => {
        body = str;
      })
    })
    req.on('error',(e) => {
      console.error(e)
    });
    req.write(body);
    req.end();
  })
}

// Renouvelle le token d'access Strava
function reAuthorize(){
  return new Promise((successCallback) => {
    console.log("on lance la promesse de reAuthorize");
    // Récupère les clés nécessaire dans le fichier (dispo en local seulement)
    // et initialise les 3 variables id, secret et token
    var data = fs.readFileSync('./strava_keys.json'), myObj;
    try {
      myObj = JSON.parse(data);
      var id = myObj.id;
      var secret = myObj.secret;
      var token = myObj.token;
    } catch (err) {
      console.log('There has been an error reading the keys file :-(')
      console.error(err)
    }
  // Prépare les éléments pour la requête de renouvellement sur l'API strava
    var body = JSON.stringify({
      client_id: id,
      client_secret: secret,
      refresh_token: token,
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
    var req = https.request(options, (res) => {
      var token = "";
      //*** A revoir : normalement, il faudrait attendre d'avoir tout reçu, donc res.on('end')... mais bon, ça marche :-/
      res.on('data', (chunk) => {
        var data = JSON.parse(chunk);
        token = data.access_token;
        console.log("reAuthorize va renvoyer : " + token);
        successCallback(token);
      });
    })
    req.on('error',(e) => {
      console.error(e)
    });
    req.write(body);
    req.end();
  });
}

module.exports = router;
