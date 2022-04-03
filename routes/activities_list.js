const dbFun = require('../dbFunctions');

module.exports = {
    path: "/strava/activities_list",
    config: (router) => {
        router
            .get("/", (req, res) => {
              dbFun.activitiesList(req.query.year) // année pour filtrer
              .then((data) => {
                console.log("... liste des activités renvoyée, OK !");
                res.setHeader('content-type', 'application/json');
                res.status(200).send(data);
              })
            })
            .post("/", (req, res) => res.send("No POST here!"));
        return router;
    },
};
