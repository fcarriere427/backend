function storeData(data) {

  var array = [];
  for (var i = 0; i < data.length; i++) {
    array[i] = 'ID: ' + data[i].id
     + '  // Date: ' + data[i].start_date
     + '  // Distance: ' + Math.round(data[i].distance / 1000 * 100) / 100 + 'km'
     + '  // Time: ' + Math.round(data[i].moving_time/60 * 100) / 100 + "mn"
     + '  // Avg speed: ' + Math.round(1000 / 60 / data[i].average_speed * 100) / 100 + "mn/km";
  }

  console.log("Array = " + array);

  return array;

  // //*** Intégration dans la BDD
  // // Récupération des clés pour se connecter à couchDB
  // console.log("Début de storeData.js...");
  // const couchKeys = require('./keys/couchDB.json');
  // var user = couchKeys.user;
  // var pwd = couchKeys.password;
  // var host = couchKeys.host;
  // var port = couchKeys.port;
  // var url = 'http://' + user + ':' + pwd + '@' + host + ':' + port;
  // const nano = require('nano')(url);
  //
  // // Ouverture de la BDD
  // const db = nano.use('strava');
  //
  // // Insertion des données dans la BDD
  // db.insert(data)
  // .then((data) => console.log('Insertion BDD OK !'))
  // .catch((err) => console.log(err))
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
