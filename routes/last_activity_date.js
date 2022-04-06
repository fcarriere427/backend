const db = require('../db');

module.exports = {
    path: "/strava/last_activity_date",
    config: (router) => {
        router
            .get("/", (req, res) => {
              db.readLastActivityDate()
              .then (date => {// au format "2022-04-02T07:43:20Z"
                let newDate = new Date(date);
                let date_str = newDate.toLocaleDateString('fr-FR') + ' at ' + newDate.toLocaleTimeString('fr-FR');
                let final = date_str.substring(0, date_str.length - 3); // on enlève les secondes
                console.log("... Envoi de la date de la dernière activité (= " + final + ")");
                res.setHeader('content-type', 'application/json');
                res.status(200).json({ last_activity_date: final});
                })
              })
            .post("/", (req, res) => res.send("No POST here!"));
        return router;
    },
};
