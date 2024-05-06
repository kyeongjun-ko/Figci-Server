const projectRouter = require("../routers/projects");
const oauthRouter = require("../routers/oauth");
const userRouter = require("../routers/user");

const routerLoader = async (app) => {
  app.use("/projects", projectRouter);
  app.use("/oauth", oauthRouter);
  app.use("/user", userRouter);
};

module.exports = routerLoader;
