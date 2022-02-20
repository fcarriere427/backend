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
  console.log('Début de updateDB...');
  readID(stravaDb)
  .then(() => insertNew(data,stravaDb));

  // majBD(data, stravaDb)
  // .then(() => writeArray(stravaDb))
  // .then(() => {
  //   for (let i = 0; i < existingID.length; i++) {
  //     console.log('existingID[' + i + '] = ' + existingID[i]);
  //   }
  // })


}

///// REPRENDRE ICI : on récupère bien les docs en json, mais on ne sait pas extraire les valeurs qui nous  intéressent (par la clé "ID" de Strava)
///// ... donc on ne sait pas remplir le tableau des ID des activités strava
///// ... qui va servir à vérifier si une activité existe déjà avant de l'ajouter à la BDD

//// AUTRE problème à traiter, moins urgent : il faut isoler le process de création initiale de la BDD...
///// ... sinon on ne sait pas s'il faut commencer par remplir la BDD ou le tableau des ID :-/

function insertNew(data, stravaDb){
  // Création d'un enregistrement pour chaque activité
  return new Promise((resolve, reject) => {
    console.log('Mise à jour de la BDD avec '+ data.length + ' éléments...');
    var count = 0;
    for (let i = 0; i < data.length; i++) {
      console.log('data[i] = ' + data[i].toString());
      if(true) {
        stravaDb.insert(data[i], function(){
          count = count + 1;
        })
      }
      // Quand on est sur le dernier élément, alors seulement on appelle le callback !
      if(count==data.length){
        console.log('... OK, BDD mise à jour !');
        resolve();
      }
    }
  })
}

function readID(stravaDb) {
  return new Promise((resolve, reject) => {
    console.log("Création du tableau avec les ID Strava, à partir de la BDD existante...");
    var count = 0;
    // pour chaque ligne de la BDD, on va écrire un élément dans le tableau existingID
    stravaDb.list()
    .then((body) => {
      body.rows.forEach((item, i) => {
        stravaDb.get(body.rows[i].id)
        .then((doc) => {
          existingID[i] = doc["id"];
          count = count + 1;
          if(count==body.rows.length){
            console.log('... tableau des ID Strava créé !');
            resolve();
          }
        })
      });
    })
  })
}

module.exports = updateDB;
