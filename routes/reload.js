const dbFun = require('../dbFunctions');
const strava = require('../strava');

module.exports = {
    path: "/api/strava/reload",
    config: (router) => {
        router
            .get("/", (req, res) => {
              // param de getActivities = nbPages --> ici 9(*100) car 849 activités Strava le 27/04/24 (cf. dashboard Strava) --> il faut mettre la centaine supérieure, pas plus !
              var nbPages = 9;
              dbFun.renewDB()
              .then(() => strava.renewTokens())
              .then(() => strava.getActivities(nbPages))
              .then((data) => {
                console.log("... toutes activités récupérées, OK !");
                res.status(200).json(data);
              })
            })
            .post("/", (req, res) => res.send("No POST here!"));
        return router;
    },
};
