//*** Intégration des données dans la BDD

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

function storeData(data) {
  console.log("Début de storeData...");
  // Récupération des clés pour se connecter à couchDB
  // ********************
  insertDoc(data, stravaDb)
  .then(() => console.log("Insert OK, maintenant on peut faire autre chose"))
  .then(() => writeArray(stravaDb))
  // .then(() => {
  //    console.log("Et voici le tableau des ID Strava : ");
  //   for (var i = 0; i < existingID.length; i++) {
  //     console.log("i = " + i + " =>" + existingID[i]);
  //   }
  // })
}

///// REPRENDRE ICI : on récupère bien les docs en json, mais on ne sait pas extraire les valeurs qui nous  intéressent (par la clé "ID" de Strava)
///// ... donc on ne sait pas remplir le tableau des ID des activités strava
///// ... qui va servir à vérifier si une activité existe déjà avant de l'ajouter à la BDD

//// AUTRE problème à traiter, moins urgent : il faut isoler le process de création initiale de la BDD...
///// ... sinon on ne sait pas s'il faut commencer par remplir la BDD ou le tableau des ID :-/

function insertDoc(data, stravaDb){
  // Création d'un enregistrement pour chaque activité
  return new Promise((resolve, reject) => {
    console.log('Mise à jour de la BDD avec '+ data.length + ' éléments...');
    var count = 0;
    for (let i = 0; i < data.length; i++) {
      stravaDb.insert(data[i], function(){
        count = count + 1;
        // Quand on est sur le dernier élément, alors seulement on appelle le callback !
        if(count==data.length){
          console.log('... OK, BDD mise à jour !');
          resolve();
        }
      })
    }
  })
}

function writeArray(stravaDb) {
  return new Promise((resolve, reject) => {
    console.log("Création du tableau avec les ID Strava...");
    // pour chaque ligne de la BDD, on va écrire un élément dans le tableau existingID
    stravaDb.list()
    .then((body) => {
      body.rows.forEach((item, i) => {
        // console.log('Nouvel item : ');
        // console.log(item);
        getDoc(stravaDb, body, i)
        .then(console.log('Fin du getDB(' + i + ')'))
      });
    })
    .then(resolve());
  })
}

function getDoc(stravaDb, body, i){
  return new Promise((resolve,reject) => {
    stravaDb.get(body.rows[i].id, function(doc){
      console.log('Récup ligne ' + i + ' dans la BDD');
      existingID[i] = doc["id"];
      console.log('Entrée [' + i + '] = créee dans le tableau existingID, avec : ' + doc["id"]);
      resolve();
    })
  })
}

module.exports = storeData;
