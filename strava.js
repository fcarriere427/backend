const fs = require('fs');
const https = require('https');

function getActivities(res){
  // appelle API strava avec l'access token qu'on vient de renouveller
  const activities_link = `https://www.strava.com/api/v3/athlete/activities?access_token=${res.access_token}`
  fetch(activities_link)
    .then(function (response) {return response.json();})
//    .then(function (data) {appendData(data);})
    .then(function (data) {saveData(data);})
    .catch(function (err) {console.log('error: ' + err);})
}

function saveData(data) {
  fs.writeFile('strava_data.txt', data, 'utf-8', (err) => {
      console.log('File created')
  })
}

function reAuthorize(){
  var id;
  var secret;
  var token;
  try {
    const keys = fs.readFileSync('strava_keys.json', 'utf8')
    id = keys.client_id;
    secret = keys.client_secret;
    token = keys.refresh_token;
    console.log(id);
  } catch (err) {
    console.error(err)
  }

  const auth_link = "https://www.strava.com/oauth/token"

}

reAuthorize()
