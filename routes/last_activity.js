const dbFun = require('../dbFunctions');

module.exports = {
    path: "/strava/last_activity",
    config: (router) => {
        router
            .get("/", (req, res) => {
              dbFun.readLastActivityDate()
              .then(date => {
                console.log("... date de la dernière activité renvoyée ! = " + date);
                res.status(200).json(date);
              })
            })
            .post("/", (req, res) => res.send("No POST here!"));
        return router;
    },
};
