const express = require("express");
const cors = require("cors");
const path = require("path");

async function expressLoader(app) {
  app.set("view engine", "pug");
  app.set("views", `${__dirname}/../views`);
  app.use(express.static(path.join(__dirname, "../public")));

  app.use(
    cors({
      origin: "*",
      methods: "GET, POST",
      credentials: true,
      optionsSuccessStatus: 204,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
}

module.exports = expressLoader;
