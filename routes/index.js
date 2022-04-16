// Create routers defined by all files in the directory

const express = require("express");
module.exports = (app) => {
    require("fs")
        .readdirSync(__dirname)
        .forEach((file) => {
            if (file === "index.js") return;
            const router = express.Router();
            const routeModule = require(require("path").join(__dirname, file));
            const path =
                routeModule.path ||
                "/" +
                    (file !== "root.js"
                        ? file.replace(".js", "")
                        : "");
            const route = routeModule.config
                ? routeModule.config(router)
                : routeModule(router);
            app.use(path, route);
        });
};
