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

function appendData(data) {
  var mainContainer = document.getElementById("main");
  for (var i = 0; i < data.length; i++) {
    var div = document.createElement("div");
    // pour référence : https://developers.strava.com/docs/reference/#api-models-SummaryActivity
    div.innerHTML = 'ID: ' + data[i].id
      + '  // Date: ' + data[i].start_date
      + '  // Distance: ' + Math.round(data[i].distance / 1000 * 100) / 100 + 'km'
      + '  // Time: ' + Math.round(data[i].moving_time/60 * 100) / 100 + "mn"
      + '  // Avg speed: ' + Math.round(1000 / 60 / data[i].average_speed * 100) / 100 + "mn/km";
    mainContainer.appendChild(div);
  }
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
