var couch = require('./couchdb');

couch.db.create('test2', function(err) {
  if (err) {
    console.error(err);
  }
});
