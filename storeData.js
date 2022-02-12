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

couch.db.create('test2', function(err) {
  if (err) {
    console.error(err);
  }
});


// module.exports =
