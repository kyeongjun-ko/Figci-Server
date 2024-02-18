const projectRouter = require("../routers/projects");
const oauthRouter = require("../routers/oauth");

async function routerLoader(app) {
  app.use("/projects", projectRouter);
  app.use("/oauth", oauthRouter);
}

module.exports = routerLoader;
