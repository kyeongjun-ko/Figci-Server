const express = require("express");
const cors = require("cors");
const CONFIG = require("../constants/config");

async function expressLoader(app) {
  app.use(
    cors({
      methods: "GET, POST",
      origin: CONFIG.CLIENT_URL,
      credentials: true,
      optionsSuccessStatus: 204,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
}

module.exports = expressLoader;
