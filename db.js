//////// Fonctions nécessaires aux API 

// Récupération des clés pour se connecter à couchDB
const couchKeys = require('./keys/couchDB.json');
var user = couchKeys.user;
var pwd = couchKeys.password;
var host = couchKeys.host;
var port = couchKeys.port;
var url = 'http://' + user + ':' + pwd + '@' + host + ':' + port;
// Ouverture de la BDD
const nano = require ('nano')(url);
const DBNAME = 'strava'
var stravaDb = nano.db.use(DBNAME);

// Renvoie la date de la dernière activité, au  format "2022-04-02T07:43:20Z" (UTC)
function readLastActivityDate() {
  return new Promise((resolve, reject) => {
    stravaDb.view('strava', 'activities_by_date',{limit: 1, include_docs: true, descending: true}, function(err,body) {
      if (!err) {
          // for each... mais il n'y a qu'une ligne normalement !
          body.rows.forEach(doc => { resolve(doc.doc.start_date) })
      } else {
          console.log('error readLastActivityDate = ' + JSON.stringify(err));
      }
    });
  })
}

// Renvoie un json avec les distances (km) pour toutes les années
function yearDistances() {
  let year_distances = [];
  return new Promise((resolve, reject) => {
    stravaDb.view('strava', 'group_by_month', {reduce: true, group_level: 1}, function(err,body) {
      if (!err) {
        body.rows.forEach(doc => {
          let year = doc.key.toString();
          let distance = Math.round(doc.value/1000*10)/10;
          year_distances[`${year}`] = `${distance}`;
        });
        let response = JSON.stringify(Object.assign({}, year_distances));
        resolve(response);
      } else {
        console.log('error yearDistances = ' + JSON.stringify(err));
      }
    });
  })
}

// Renvoie un json avec les distances (km) pour tous les mois de toutes les années
function monthDistances() {
  let month_distances = [];
  return new Promise((resolve, reject) => {
    stravaDb.view('strava', 'group_by_month', {reduce: true, group_level: 2}, function(err,body) {
      if (!err) {
        body.rows.forEach(doc => {
          let month = doc.key.toString().replace(",", "-");
          let distance = Math.round(doc.value/1000*10)/10;
          month_distances[`${month}`] = `${distance}`;
        });
        let response = JSON.stringify(Object.assign({}, month_distances));
        resolve(response);
      } else {
        console.log('error monthDistances = ' + JSON.stringify(err));
      }
    });
  })
}

// Renvoie la liste des activités d'une année donnée (?year=xxxx), au format JSON
function activitiesList(year) {
  let s_key = year + "-12-31T23:59:59Z"; // attention, on est en ordre descendant !
  let e_key = year + "-01-01T00:00:00Z";
  return new Promise((resolve, reject) => {
    stravaDb.view('strava', 'activities_by_date',{startkey: s_key, endkey: e_key, include_docs: true, descending: true}, function(err,body) {
      if (!err) {
        resolve(body.rows);
      } else {
        console.log('error activitiesList = ' + err);
      }
    });
  })
}

// Renvoie toutes les infos pour une activité donnée (?id=xxxxxx)
function activityDetail(id) {
  return new Promise((resolve, reject) => {
    const idNum = parseInt(id); /// des heures pour trouver ça... :-(
    stravaDb.view('strava', 'activities_by_id', {key: idNum, include_docs: true}, function(err,body) {
      if (!err) {
        // for each... mais il n'y a qu'une ligne normalement !
        body.rows.forEach(doc => { resolve(doc.doc) })
      } else {
        console.log('error activityDetail = ' + JSON.stringify(err));
      }
    });
  })
}


module.exports = {
   readLastActivityDate,
   yearDistances,
   monthDistances,
   activitiesList,
   activityDetail
 }
