// Définition du router
const express = require('express');
var router = express.Router();

router.use(function timeLog(req, res, next) {
  let newDate = new Date(Date.now());
  console.log(`***** Appel de strava_app : ${newDate.toDateString()} ${newDate.toTimeString()}`);
  next();
});

router.get('/', function(req, res) {
  console.log('on est dans strava_app !');
  res.status(200).send('on est dans strava_app !');
});

module.exports = router;
