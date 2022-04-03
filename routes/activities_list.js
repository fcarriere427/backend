const dbFun = require('../dbFunctions');

module.exports = {
    path: "/strava/activities_list",
    config: (router) => {
        router
            .get("/", (req, res) => {
              dbFun.activitiesList(req.query.year) // année pour filtrer
              .then((data) => {
                console.log("... liste des activités renvoyée, OK !");
                res.status(200).json(data);
              })
            })
            .post("/", (req, res) => res.send("No POST here!"));
        return router;
    },
};
