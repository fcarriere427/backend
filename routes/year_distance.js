const dbFun = require('../dbFunctions');

module.exports = {
    path: "/strava/year_distance",
    config: (router) => {
        router
            .get("/", (req, res) => {
              console.log("année d'appel : " + req.query.id);
              dbFun.readYearDistance(req.query.id) // année pour filtrer
              .then((data) => {
                console.log("... Envoi de la distance de l'année " + req.query.id + " (= " + data + ")");
                res.status(200).json(data);
              })
            })
            .post("/", (req, res) => res.send("No POST here!"));
        return router;
    },
};
