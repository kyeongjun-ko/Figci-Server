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

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);

  res.send("Something broke!", err);
});

module.exports = app;
