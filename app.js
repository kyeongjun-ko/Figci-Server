require("dotenv").config();

const express = require("express");
const cors = require("cors");
const appLoader = require("./src/loaders/index");

const indexRouter = require("./routes/index");
const projectsRouter = require("./routes/projects");

const app = express();

(async () => {
  await appLoader(app);
})();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/projects", projectsRouter);

module.exports = app;
