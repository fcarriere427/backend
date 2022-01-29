const https = require('https');
const express = require('express');
const fs = require('fs');

var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Router Activities appelé à : ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res) {
    // promesse sur reAuthorise, récupérer l'access access_token
    console.log("0 - on lance reAuthorize, depuis le router");
    let token = new Promise(function(resolve){
      token = reAuthorize();
      resolve(token);
    })
    token.then(result => {
        console.log("1 - Réponse de la promesse (token) = " + token);
        // getActivities(token);
    })

    // requeter async sur Strava pour récuperer les activités
    // console.log("1 - on lance getActivities, depuis le router");

    // retourner les data dans un json (vers le front test.js qui appelle cette route)
    // console.log("2 - on lance reAuthorize, depuis le router");

});

module.exports = router;
