const projectRouter = require("../routers/projects");
const indexRouter = require("../routers/index");

async function routerLoader(app) {
  app.use("/", indexRouter);
  app.use("/projects", projectRouter);
}

module.exports = routerLoader;
