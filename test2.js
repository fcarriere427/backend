const https = require('https');
const fs = require('fs');

// function test() {
//   var prom = new Promise((resolve,reject) => {
//     console.log("createur de la promise");
//     resolve("retour créateur");
//   });
//
//   prom.then((value) => {
//     console.log("retour du createur = " + value);
//   });
// }

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

function getActivities() {
  //// Préparation des éléments pour la requête de renouvellement sur l'API strava
  // Lecture des clés Strava dans un fichier
  var data = fs.readFileSync('./strava_keys.json'), myObj;
  // Récupération dans 3 variables locales
  try {
    myObj = JSON.parse(data);
    var id = myObj.id;
    var secret = myObj.secret;
    var refresh_token = myObj.token;
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
  //// REPRENDRE ICI
  // Lance la requête de renouvellement de l'access_token
  httpsRequest(options,body).then(function(body) {
    token = body.access_token;
    console.log("token = " + token);
    //return token; // utile ?
  }).then(function(body) {
    console.log("et là on peut appeler getActivities avec token = " + token);
    var options = `https://www.strava.com/api/v3/athlete/activities?access_token=${token}`;
    var body = '';
    httpsRequest(options).then(function(body) {
      console.log("activities = " + body);  
    })
  })
}

getActivities()
