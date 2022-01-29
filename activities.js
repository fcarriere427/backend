var express = require('express');
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Tiens, on m\'a appelé à : ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res) {
  res.send('Ici, on va appeler les données Strava');
  res.status.json({
    data: "données strava :-)"
  });
});
// define the about route
router.get('/about', function(req, res) {
  res.send('About activities');
});

module.exports = router;
