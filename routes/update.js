const strava = require('../strava');

module.exports = {
    path: "/api/strava/update",
    config: (router) => {
        router
            .get("/", (req, res) => {
              var nbPages = 1;
              strava.renewTokens()
              .then(() => strava.getActivities(nbPages))
              .then((data) => {
                console.log("... " + data + "dernière(s) activité(s) récupérée(s), OK !");
                res.status(200).json(data);
              })
            })
            .post("/", (req, res) => res.send("No POST here!"));
        return router;
    },
};
