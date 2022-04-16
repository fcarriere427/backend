const db = require('../db');

module.exports = {
    path: "/api/strava/activity",
    config: (router) => {
        router
            .get("/", (req, res) => {
              db.activityDetail(req.query.id) // id de l'activité
              .then(data => {
                console.log('... activité récupérée, OK !'); // Ex :  data.distance donne bien la distance
                res.setHeader('content-type', 'application/json');
                res.status(200).json(data);
              })
            })
            .post("/", (req, res) => res.send("No POST here!"));
        return router;
    },
};
