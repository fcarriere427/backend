//*** Lecture des données dans la BDD

// Récupération des clés pour se connecter à couchDB
const couchKeys = require('./keys/couchDB.json');
var user = couchKeys.user;
var pwd = couchKeys.password;
var host = couchKeys.host;
var port = couchKeys.port;
var url = 'http://' + user + ':' + pwd + '@' + host + ':' + port;
// Ouverture de la BDD
const nano = require ('nano')(url);
//console.log('nano = ' + JSON.stringify(nano));
var stravaDb = nano.db.use('strava');

var views = require('./views.json')

function createViewDB() {
  return new Promise((resolve, reject) => {
    db.insert(
      {"views":
        {"activities_by_date":
          {"map": function (doc) { emit (doc.start_date, doc); } }
        }
        // {"activities_by_distance":
        //   {"map": function (doc) { emit (doc.distance, doc); } }
        // }
      }, '_design/strava', function (error, response) {
        console.log('OK, design created!');
    });
    .then((body) => {
      console.log('body.rows[1] = ' + JSON.stringify(body.rows[1]));
      resolve(body.rows);
    })
  })
}

module.exports = createViewDB;
