const https = require('https');
const express = require('express');
const fs = require('fs');

const getActivities = require('./getActivities');

var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Tiens, on m\'a appelé à : ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res) {
  var str = getActivities();
  res.status(200).json({
    // renvoyer les données Strava :-)
    data: str
  });
});

module.exports = router;
