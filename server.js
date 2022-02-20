////////////////
// Serveur : gère les requêtes du front
////////////////

const express = require('express')
const app = express()
const port = 3000
var router = express.Router();

router.use(function timeLog(req, res, next) {
  let newDate = new Date(Date.now());
  console.log(`***** Appel de list_activities : ${newDate.toDateString()} ${newDate.toTimeString()}`);
  next();
});

router.get('/', function(req, res, next) {
  console.log('App has been called')
});

var list_activities = require('./list_activities');
router.get('/list_activities', list_activities);

var fetch_activities = require('./fetch_activities');
router.get('/fetch_activities', fetch_activities);

app.listen(port, () => {
  console.log('Serveur à l\'écoute sur localhost:'+ port);
});

module.exports = router;
