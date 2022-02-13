console.log("couchdb.js se lance...");
// Récupération des clés pour se connecter à couchDB
const couchKeys = require('./keys/couchDB.json');
var user = couchKeys.user;
var pwd = couchKeys.password;
var host = couchKeys.host;
var port = couchKeys.port;
var url = 'http://' + user + ':' + pwd + '@' + host + ':' + port;
// Ouverture de la BDD
const nano = require ('nano')(url);
const prom = require ('nano-promises');
//var db = prom(nano).db.use('strava');
var db = nano.db.use('strava');

module.exports = nano
