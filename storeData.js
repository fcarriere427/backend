//*** Intégration des données dans la BDD

function storeData(data) {
  // Récupération des clés pour se connecter à couchDB
  console.log("Début de storeData.js...");
  const couchKeys = require('./keys/couchDB.json');
  var user = couchKeys.user;
  var pwd = couchKeys.password;
  var host = couchKeys.host;
  var port = couchKeys.port;
  var url = 'http://' + user + ':' + pwd + '@' + host + ':' + port;
  const nano = require('nano')(url);

  // Ouverture de la BDD
  const db = nano.use('strava');

  // Création d'un enregistrement pour chaque activité
  insertData(data)
  .then(console.log('Fin de l\'insertion dans la BDD !'));
}

function insertData (data) {
  return new Promise(function(res,err) {
    for (var i = 0; i < data.length; i++) {
      // Insertion des données dans la BDD
      db.insert(data[i])
      .then(() => console.log('Insertion BDD de l\'enregistrement n°' + i))
      .catch((err) => console.log(err))
    }
    resolve(data);
  });
}


module.exports = storeData;

/// example of OK json Object

// var o = {} // empty Object
// var key = 'Orientation Sensor';
// o[key] = []; // empty Array, which you can push() values into
// var data = {
//     sampleTime: '1450632410296',
//     data: '76.36731:3.4651554:0.5665419'
// };
// var data2 = {
//     sampleTime: '1450632410296',
//     data: '78.15431:0.5247617:-0.20050584'
// };
// o[key].push(data);
// o[key].push(data2);
// var doc = JSON.stringify(o);
// db.insert(doc);
