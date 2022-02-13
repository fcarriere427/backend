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
  var db = nano.db.use('strava');

  // Création d'un enregistrement pour chaque activité
  for (var i = 0; i < data.length; i++) {
    console.log('Boucle for avec i = ' + i);
    db.insert(data[i])
    .catch((err) => console.log());
  }
  console.log('Fin de l\'insertion dans la BDD !');
}

module.exports = storeData;
