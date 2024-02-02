const projectRouter = require("../routers/projects");

async function routerLoader(app) {
  app.use("/projects", projectRouter);
}

module.exports = routerLoader;
