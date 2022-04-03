const dbFun = require('../dbFunctions');

module.exports = {
    path: "/strava/year_distance",
    config: (router) => {
        router
            // .get("/", (req, res) => {
            //   dbFun.readYearDistance(req.query.year) // année pour filtrer
            //   .then((data) => {
            //     console.log("... Envoi de la distance de l'année " + req.query.year + " (= " + data + ")");
            //     res.status(200).json({ year_distance: data });
            //   })
            // })
            .get("/", (req, res) => {
              dbFun.readAllYearDistance() // récup du json avec toutes les années
              .then((data) => {
                console.log("... Envoi du json avec les distances par année (= " + data + ")");
                res.status(200).json(data);
              })
            })
            .post("/", (req, res) => res.send("No POST here!"));
        return router;
    },
};
