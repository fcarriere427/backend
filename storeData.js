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
  console.log('nano = ' + JSON.stringify(nano));
  var stravaDb = nano.db.use('strava');

    // Création d'un enregistrement pour chaque activité
  for (var i = 0; i < data.length; i++) {
// ICI : mettre un test : si l'enregistrement existe déjà, on ne l'insert pas !
// ?1 : comment
    stravaDb.insert(data[i])
    .catch((err) => console.log());
  }
  console.log('BdD mise à jour !');

  // Récupération de tous les ID d'activités Strava dans un tableau
  var existingID = [];
  stravaDb.list()
  .then((body) => {
    console.log('on va lister les activités...')
    body.rows.forEach((doc) => {
      console.log(doc);
    })
  });
}

module.exports = storeData;
