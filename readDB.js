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

const createViewDB = require('./createViewDB');

async function readDB() {
  stravaDb.get('_design/strava', { revs_info: true }, function(err, body) {
    async if (err) {
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

module.exports = readDB;
