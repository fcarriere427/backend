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
var data = {};
var data = JSON.stringify('salut');

db.insert(data)
.then((data) => console.log(data))
.catch((err) => console.log(err))

// module.exports =
