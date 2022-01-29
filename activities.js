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
  console.log("0 - on lance reAuthorize, depuis le router");
  var token = reAuthorize();
  console.log("3 - on lance getActivities, depuis le router");
  var str = getActivities(token);
  console.log("6 - Le résultat de getActivities, dans le router = " + str);
  res.status(200).json({
    // récupérer les vraies données Strava :-)
    data: str
  });
  console.log("7 - On va envoyer le retour, depuis le routeur = " + data);
  res.send(data);
});

// Récupère les activités Strava
function getActivities(token){
  //lance le renouvellement de l'access token
  var activities = {};
  console.log("4 - On est dans getActivities, avec token : " + token);
  // appelle API strava avec l'access token qu'on vient de renouveller
  const activities_link = `https://www.strava.com/api/v3/athlete/activities?access_token=${token}`;
  var body = '';
  var req = https.get(activities_link, (res) => {
    var str = '';
    res.on('data', (chunk) => {
      str += chunk;
    })
    res.on('end', () => {
      activities = str;
      // console.log("résultat de getActivities : " + body);
      // ça fonctionne : body contient bien les données Strava !!!
      // inutile ?? return body;
      })
  })
  req.on('error',(e) => {
    console.error(e)
  });
  req.end();
  console.log("5 - on va retourner activities = " + activities);
  return activities;
}

// Renouvelle le token d'access Strava
function reAuthorize(){
  var token = "";
  console.log("1 - on est dans reAuthorize");
  // Récupère les clés nécessaire dans le fichier (dispo en local seulement)
  // et initialise les 3 variables id, secret et token
  var data = fs.readFileSync('./strava_keys.json'), myObj;
  try {
    myObj = JSON.parse(data);
    var id = myObj.id;
    var secret = myObj.secret;
    var refresh_token = myObj.token;
  } catch (err) {
    console.log('There has been an error reading the keys file :-(')
    console.error(err)
  }
// Prépare les éléments pour la requête de renouvellement sur l'API strava
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
  var req = https.request(options, (res) => {
    //*** A revoir : normalement, il faudrait attendre d'avoir tout reçu, donc res.on('end')... mais bon, ça marche :-/
    res.on('data', (chunk) => {
      var data = JSON.parse(chunk);
      token = data.access_token;
      console.log("2 - reAuthorize va renvoyer : " + token);
      return(token);
    });
  })
  req.on('error',(e) => {
    console.error(e)
  });
  req.write(body);
  req.end();
}

module.exports = router;
