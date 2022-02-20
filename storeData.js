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
//  .then(writeArray(stravaDb))
  .then(() => {
    console.log("Et voici le tableau des ID Strava : ");
    for (var i = 0; i < existingID.length; i++) {
      console.log("i = " + i + " =>" + existingID[i]);
    }
  })
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
    for (let i = 0; i < data.length; i++) {
      stravaDb.insert(data[i], function(){
        console.log('Boucle d\'insertDoc, i = ' + i);
        // Quand on est sur le dernier élément, alors seulement on appelle le callback !
        if(i==data.length-1){
          console.log('... OK, BDD mise à jour !');
          resolve();
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
        .then(console.log('on a lu le doc et écrit existingID[' + i +'] = ' + existingID[i]));
      });
    })
    .then(resolve());
  })
}

function getDoc(stravaDb, body, i){
  return new Promise((resolve,reject) => {
    console.log("Création d'une ligne dans le tableau des ID Strava...");
    stravaDb.get(body.rows[i].id)
    .then((doc) => {
      console.log("...[" + i + "] = " + doc["id"]);
      existingID[i] = doc["id"];
      console.log('on résout getDoc');
      resolve();
    })
  })
}

module.exports = storeData;
