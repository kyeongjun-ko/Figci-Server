require("dotenv").config();

const CONFIG = {
  PORT: process.env.PORT,
  MONGODB_ENDPOINT: process.env.MONGODB_ENDPOINT,
};

module.exports = CONFIG;
