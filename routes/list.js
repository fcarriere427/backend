const dbFun = require('../dbFunctions');

module.exports = {
    path: "/strava/list",
    config: (router) => {
        router
            .get("/", (req, res) => {
              dbFun.readDB(req.query.id) // année pour filtrer
              .then((data) => {
                console.log("... liste des activités renvoyée, OK !");
                res.status(200).json(data);
              })
            })
            .post("/", (req, res) => res.send("No POST here!"));
        return router;
    },
};
