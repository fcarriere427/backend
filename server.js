////////////////
// Serveur : gère les requêtes du front
////////////////

const express = require('express')
const app = express()
const port = 3000
const actitiesRoute = require(".routes");

app.use("routes", activitiesRouter);

app.get('/activities', (req, res) => {
  try{
    res.json("réponse du serveur !");
  } catch (err) {
    res.status(500);
    res.json({
      error: true,
      errorMsg: err,
    })
  }
});

app.listen(port, () => {
  console.log("Running on http://localhost:${port}");
  }
);

module.exports = app;
