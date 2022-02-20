//*** Intégration des données dans la BDD

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

var existingID = [];

function updateDB(data) {
  return new Promise((resolve, reject) => {
    console.log('   ... mise à jour de la DB ...');
    readID(stravaDb)
    .then(() => insertNew(data,stravaDb))
    .then(() => console.log('... mise à jour DB OK !'))
    .then(() => resolve(data))
  })
}

//// A TRAITER  : il faut isoler le process de création initiale de la BDD...

function insertNew(data, stravaDb){
  // Création d'un enregistrement pour chaque activité
  return new Promise((resolve, reject) => {
    console.log('  ... Mise à jour de la DB avec '+ data.length + ' éléments...');
    var count = 0;
    var count_insert = 0;
    for (let i = 0; i < data.length; i++) {
      if(!existingID.includes(data[i].id)) {
        stravaDb.insert(data[i], function(){
          count = count + 1;
          count_insert = count_insert + 1;
          if(count==data.length){
            console.log('      ... OK, DB mise à jour avec ' + count_insert + ' élements (sur les ' + data.length + ' initiaux)');
            resolve();
          }
        })
      } else {
        count = count + 1;
        if(count==data.length){
          console.log('      ... OK, DB mise à jour avec ' + count_insert + ' élements (sur les ' + data.length + ' initiaux)');
          resolve();
        }
      }
    }
  })
}

function readID(stravaDb) {
  return new Promise((resolve, reject) => {
    console.log("      ... mise à jour du tableau des ID Strava, à partir de la BDD existante...");
    var count = 0;
    // pour chaque ligne de la BDD, on va écrire un élément dans le tableau existingID
    stravaDb.list()
    .then((body) => {
      if (body.rows.length == 0){
        // si la BDD est vide, on ne fait rien
        console.log("      ... pas d\'ID existant, la BDD est vide !");
        resolve();
      }
      else {
        // sinon on remplit le tableau existingID
        body.rows.forEach((item, i) => {
          stravaDb.get(body.rows[i].id)
          .then((doc) => {
            existingID[i] = doc["id"];
            count = count + 1;
            //console.log('   ... count = ' + count);
            if(count==body.rows.length){
              console.log('      ... tableau des ID Strava mis à jour !');
              resolve();
            }
          })
        })
      }
    })
  })
}

module.exports = updateDB;
