const dbFun = require('./dbFunctions');

module.exports = {
    path: "/update",
    config: (router) => {
        router
            .get("/", (req, res) => {
              var nbPages = 1;
              renewTokens()
              .then(() => getActivities(nbPages))
              .then((data) => {
                console.log("... dernières activités récupérées, OK !");
                res.status(200).json(data);
              })
            })
            .post("/", (req, res) => res.send("No POST here!"));
        return router;
    },
};
