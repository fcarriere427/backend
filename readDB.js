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

async function readDB() {
  stravaDb.get('_design/strava', { revs_info: true }, function(err, body) {
    if (err) {
      await createViewDB();
    } else {
      return new Promise((resolve, reject) => {
        stravaDb.list())
        .then((body) => {
          console.log('body.rows[1] = ' + JSON.stringify(body.rows[1]));
          resolve(body.rows);
        })
      })
    }
  });
}

function createViewDB() {
  return new Promise((resolve, reject) => {
    stravaDb.insert(
    {"views":
      {"activities_by_date":
        {"map": function (doc) { emit (doc.start_date, doc); } }
      }
      // {"activities_by_distance":
      //   {"map": function (doc) { emit (doc.distance, doc); } }
      // }
    },
    '_design/strava',
    function (error, response) {
      if (!error){
        console.log('OK, design created! response = ' + response + ' + error = ' + error);
      } else {
        console.log('OK, design created! response = ' + response + ' + error = ' + error);
      }
    })
  })
}


module.exports = readDB;
