// Définition du router
const express = require('express');
var router = express.Router();

router.use(function timeLog(req, res, next) {
  let newDate = new Date(Date.now());
  console.log(`Appel de update_activities : ${newDate.toDateString()} ${newDate.toTimeString()}`);
  next();
});

router.get('/strava_app/update', function(req, res) {
  var msg = 'TO DO : récupérer les dernières activités';
  console.log(msg);
  res.status(200).send(msg);
});

module.exports = router;
