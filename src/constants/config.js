require("dotenv").config();

const CONFIG = {
  PORT: process.env.PORT,
  MONGODB_ENDPOINT: process.env.MONGODB_ENDPOINT,
  CLIENT_URL: process.env.CLIENT_URL,
};

module.exports = CONFIG;
