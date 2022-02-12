//récupération des clés pour se connecter à couchDB
console.log("Début de storeData.js...");
const couchKeys = require('./keys/couchDB.json');
var user = couchKeys.user;
var pwd = couchKeys.password;
var host = couchKeys.host;
var port = couchKeys.port;
var url = 'http://' + user + ':' + pwd + '@' + host + ':' + port;
console.log("url = " + url);
const nano = require('nano')(url);

//
const db = nano.use('strava');

//var data = ''{ happy: true }, 'rabbit'';
var o = {} // empty Object
var key = 'Orientation Sensor';
o[key] = []; // empty Array, which you can push() values into


var data = {
    sampleTime: '1450632410296',
    data: '76.36731:3.4651554:0.5665419'
};
var data2 = {
    sampleTime: '1450632410296',
    data: '78.15431:0.5247617:-0.20050584'
};
o[key].push(data);
o[key].push(data2);
var doc = JSON.stringify(o);
console.log("doc = " + doc);


db.insert(doc)
.then((data) => console.log(data))
.catch((err) => console.log(err))

// module.exports =
