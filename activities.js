const https = require('https');
const express = require('express');
const fs = require('fs');
const reAuthorize = require('./reAuthorize');
const newProm = require('./newProm');

var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Router Activities appelé à : ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res) {
    console.log("router - 0 - avant l'appel à newProm")
    return new Promise((resolve, reject) => {
      newProm();
      console.log("router - 1 - à l'intérieur de la promise du router")
    })
    console.log("router - 2 - après l'appel à newProm")
});

module.exports = router;
