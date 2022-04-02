const dbFun = require('./dbFunctions');

module.exports = {
    path: "/activity",
    config: (router) => {
        router
            .get("/", (req, res) => {
              dbFun.readRec(req.query.id) // id de l'activité
              .then(data => {
                console.log('... activité récupérée, OK !'); // Ex :  data.distance donne bien la distance
                res.status(200).json(data);
              })
            })
            .post("/", (req, res) => res.send("No POST here!"));
        return router;
    },
};
