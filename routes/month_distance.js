// for OLD APP only !!!

const dbFun = require('../dbFunctions');

module.exports = {
    path: "/api/strava/month_distance",
    config: (router) => {
        router
            .get("/", (req, res) => {
              dbFun.readMonthTotal()
              .then((data) => {
                console.log('... renvoi des distances par mois, OK !');
                res.status(200).json(data);
              })
            })
            .post("/", (req, res) => res.send("No POST here!"));
        return router;
    },
};
