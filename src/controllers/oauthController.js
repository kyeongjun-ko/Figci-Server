const generateApiUri = require("../utils/generateURI");

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectURI = process.env.REDIRECT_URI;
const figmaURI = process.env.FIGMA_URI;

let accessToken = "";

const requestToken = async (req, res, next) => {
  const { code } = req.query;

  const queryParams = {
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectURI,
    code,
    grant_type: "authorization_code",
  };

  const API_URI = generateApiUri(figmaURI, "api/oauth/token", queryParams);

  const response = await fetch(API_URI, { method: "POST" });
  const responseJson = await response.json();

  accessToken = responseJson.access_token;

  res.status(200).render("connect");
};

const getToken = (req, res, next) => {
  res.status(200).json({ accessToken });

  accessToken = "";
};

module.exports = { requestToken, getToken };
