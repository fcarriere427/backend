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
  var data = fs.readFileSync('./strava_keys.json'), myObj;
  try {
    myObj = JSON.parse(data);
    var id = myObj.id;
    var secret = myObj.secret;
    var token = myObj.token;
    console.log(id);
  } catch (err) {
    console.log('There has been an error reading the keys file :-(')
    console.error(err)
  }

  const auth_link = "https://www.strava.com/oauth/token"

}

reAuthorize()
