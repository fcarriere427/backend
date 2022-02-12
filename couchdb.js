var nano = require('nano');

module.exports = nano(process.env.COUCHDB_URL || 'http://admin:Boubou13@192.168.1.35:5984');
