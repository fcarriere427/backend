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
  var str = '';
  callback = function(res) {
    res.on('data', function(chunk){
      str += chunk;
    });
    res.on('end', function(){
      console.log('str:', str);
      console.log('req.data:', req.data);
      const data = JSON.parse(str);
      const token = data.access_token;
      console.log('on va lancer getActivities');
      getActivities(token);
    });
  }
  // lance la requête, et enchaine sur getActivities
  console.log('on lance la requete POST');
  var req = https.request(options, callback).end();
}

function getActivities(token){
  // appelle API strava avec l'access token qu'on vient de renouveller
  const activities_link = `https://www.strava.com/api/v3/athlete/activities?access_token=${token}`;
  console.log('on va lancer la requete GET');
  const req = https.get(activities_link, (res) => {
    res.on('data', d => {
      console.log('d: ', d);
    })
    res.on('end', d => {
      console.log('d: ', d);
      saveData(d);
    })
  })
  req.on('error',(e) => {
    console.error(e);
  })
}

function saveData(data) {
  fs.writeFile('out', data, 'utf-8', (err) => {
      console.log('File created')
  })
}

reAuthorize()
