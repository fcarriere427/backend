module.exports = {
    path: "/strava/testAPI",
    config: (router) => {
        router
            .get("/", (req, res) => {
              console.log('... Appel de testAPI');
              res.status(200).json({ cumulAnnuel: '427' });
            })
            .post("/", (req, res) => res.send("No POST here!"));
        return router;
    },
};
