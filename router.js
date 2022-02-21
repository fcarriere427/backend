////////////////
// Router
////////////////

const express = require('express')
const app = express()
const port = 3000
var router = express.Router();

router.get('/strava_app/', function(req, res, next) {
  console.log('/strava_app has been called')
  next();
});

router.get('/strava_app/list_activities', function(req, res, next) {
  console.log('/strava_app/list_activities has been called')
  next();
});

// var list_activities = require('./list_activities');
// router.get('/list_activities', list_activities);

// var fetch_activities = require('./fetch_activities');
// router.get('/fetch_activities', fetch_activities);

module.exports = router;
