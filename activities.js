const https = require('https');
const express = require('express');
const fs = require('fs');

var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Router Activities appelé à : ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res) {
    // promesse sur reAuthorise, récupérer l'access access_token
    console.log("0 - on lance reAuthorize, depuis le router");
    let promise = new Promise(function(resolve){
      var token = reAuthorize();
      resolve(token);
    })
    promise.then(result => {
        console.log("3 - Réponse de la promesse (result) = " + result);
        // getActivities(token);
    })

    // requeter async sur Strava pour récuperer les activités
    // console.log("1 - on lance getActivities, depuis le router");

    // retourner les data dans un json (vers le front test.js qui appelle cette route)
    // console.log("2 - on lance reAuthorize, depuis le router");

});

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
