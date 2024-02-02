require("dotenv").config();

const CONFIG = {
  PORT: process.env.PORT,
  MONGODB_ENDPOINT: process.env.MONGODB_ENDPOINT,
  CLIENT_URL: process.env.CLIENT_URL,
  DEV_TOKEN: process.env.DEV_FIGMA_SECRET_TOKEN,
  DEV_FILE_KEY: process.env.DEV_FIGMA_TEST_FILE_KEY,
};

module.exports = CONFIG;
