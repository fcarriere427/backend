const dbFun = require('../dbFunctions');

module.exports = {
    path: "/strava/last_activity",
    config: (router) => {
        router
            .get("/", (req, res) => {
              dbFun.readLastActivityDate()
              .then(data => {
                console.log("... date de la dernière activité renvoyée !");
                res.status(200).json(data);
              })
            })
            .post("/", (req, res) => res.send("No POST here!"));
        return router;
    },
};
