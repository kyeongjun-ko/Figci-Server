const mongooseLoader = require("./mongoose");
const expressLoader = require("./express");
const routerLoader = require("./routers");

const appLoader = async (app) => {
  await mongooseLoader();
  await expressLoader(app);
  await routerLoader(app);
};

module.exports = appLoader;
