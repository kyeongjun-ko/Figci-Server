const createHttpError = require("http-errors");
const ERROR = require("../constants/error");

const getUserInformation = async (req, res, next) => {
  const accessToken = req.headers.authorization;

  try {
    const getMyInformation = await fetch("https://api.figma.com/v1/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const myInformation = await getMyInformation.json();

    if (myInformation.status === 403) {
      return res.status(200).json({
        result: "error",
        status: 403,
        message: "Invalid Token",
      });
    }

    res.status(200).json(myInformation);
  } catch (err) {
    const customError = createHttpError(
      ERROR.SERVER_ERROR.status,
      ERROR.SERVER_ERROR.message,
    );

    next(customError);
  }
};

module.exports = { getUserInformation };
