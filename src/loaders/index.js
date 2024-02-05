const mongooseLoader = require("./mongoose");
const expressLoader = require("./express");
const routerLoader = require("./routers");
const errorLoader = require("./error");

const appLoader = async (app) => {
  await mongooseLoader();
  await expressLoader(app);
  await routerLoader(app);
  await errorLoader(app);
};

module.exports = appLoader;
