const dbFun = require('../dbFunctions');

module.exports = {
    path: "/strava/year_distances",
    config: (router) => {
        router
          .get("/", (req, res) => {
            dbFun.yearDistances() // récup du json avec toutes les années
            .then((data) => {
              console.log("... Envoi du json avec les distances par année");
              res.setHeader('content-type', 'application/json');
              res.status(200).send(data);
            })
          })
          .post("/", (req, res) => res.send("No POST here!"));
        return router;
    },
};
