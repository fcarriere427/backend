//*** Intégration des données dans la BDD
//var couchdb = require('./couchdb.js');

function storeData(data) {
  console.log("Début de storeData...");

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

  // ********************
  insertDoc(data, tried)
  // .then(() => console.log('mise à jour OK dans le then de updateDB'))
  // .catch(err => console.log(err))

// ********************

  // Récupération de tous les ID d'activités Strava dans un tableau
  var existingID = [];
  stravaDb.list()
  .then((body) => {
    console.log('on va lister les activités de la BDD...')
    for (var i = 0; i < body.rows.length; i++) {
      console.log("Ligne n°" + i + " / activité = " + body.rows[i]);
      writeArray(i, stravaDb, body, body.rows[i].id)
    }
  })
  .then(() => {
    console.log("Et voici le tableau des ID Strava : ");
    for (var i = 0; i < existingID.length; i++) {
      console.log("i = " + i + " =>" + existingID[i]);
    }
  })
  .catch(err => console.log(err))
}

///// REPRENDRE ICI : on récupère bien les docs en json, mais on ne sait pas extraire les valeurs qui nous  intéressent (par la clé "ID" de Strava)
///// ... donc on ne sait pas remplir le tableau des ID des activités strava
///// ... qui va servir à vérifier si une activité existe déjà avant de l'ajouter à la BDD

//// AUTRE problème à traiter, moins urgent : il faut isoler le process de création initiale de la BDD...
///// ... sinon on ne sait pas s'il faut commencer par remplir la BDD ou le tableau des ID :-/


function writeArray(i, stravaDb, body, data) {
  console.log("On rentre dans writeArray...");
  var param = "{}";
  return new Promise(function(resolve, reject) {
    console.log('on fait un get sur stravaDB avec l\'id = ' + body.rows[i].id);
    var req = stravaDb.get(body.rows[i].id, param, function (doc) {
      console.log('et on obtient l\'enregistrement = ' + doc);
      var stravaID = doc["id"];
      console.log('et on récupère l\'ID Strava = ' + stravaID);
      console.log("puis on renseigne dans le tableau la valeur [" + i + "] = " + doc["id"]);
      existingID[i] = doc["id"];
      resolve();
    })
  })
}

function insertDoc(data){
  // Création d'un enregistrement pour chaque activité
  console.log('Mise à jour de la BDD avec '+ data.length + ' éléments...');
  return new Promise(function(resolve, reject) {
    for (var i = 0; i < data.length; i++) {
      // ICI : mettre un test : si l'enregistrement existe déjà, on ne l'insert pas !
      // ?1 : comment
      console.log('on va insérer une donnée...')
      stravaDb.insert(data[i])
      .then(data => {
        console.log('... ok pour la ligne n°' + i + ' = '+ data);
        if(i==data.length){
          console.log('Dernier enregistrement --> on resolve');
          resolve();
        }
      })
      .catch(err => console.log(err))
    }
    console.log('... OK, BDD mise à jour !');
  })
}

module.exports = storeData;
