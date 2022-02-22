// Définition du router
const express = require('express');
var router = express.Router();

router.use(function timeLog(req, res, next) {
  let newDate = new Date(Date.now());
  console.log(`***** Appel de list_activities : ${newDate.toDateString()} ${newDate.toTimeString()}`);
  next();
});

router.get('/', function(req, res) {
  res.status(200).send('on est dans list_activities !');
});

module.exports = list_activities;
