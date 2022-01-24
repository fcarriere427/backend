const fs = require('fs');
const https = require('https');

function reAuthorize(){
  // Récupère les clés nécessaire dans le fichier (dispo en local seulement)
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

// fait la requête POST de renouvellement sur l'API strava
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
  // lance la requête, et enchaine sur getActivities
  const req = https.request(options, (res) => {
    res.on('data', d => {
        console.log('on récupère access token');
//***  CA PLANTE ICI : on ne récupère rien, juste "undefined"...
//        var token = d.access_token;
        console.log('on va lancer getActivities avec d = ', d);
//        getActivities(token);
      });
    })
  req.on('error',(e) => {
    console.error(e)
  });
  req.write(body);
  req.end();
  }

function getActivities(token){
  // appelle API strava avec l'access token qu'on vient de renouveller
  const activities_link = `https://www.strava.com/api/v3/athlete/activities?access_token=${token}`;
  console.log('URL for get request:',activities_link);
  https.get(activities_link, (res) => {
    console.log('statusCode:',res.statusCode);
//    .then(function (response) {return response.json();})
//    .then(function (data) {appendData(data);})
//    .then(function (data) {saveData(data);})
//    .catch(function (err) {console.log('error: ' + err);})
  })
}

reAuthorize()
