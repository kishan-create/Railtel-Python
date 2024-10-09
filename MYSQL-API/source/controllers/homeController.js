// controllers/homeController.js
const utils = require("../helpers/utils.js");

// Controller method to validate JWT bearer token
exports.validateToken = (req, res) => {
  let token = null;
  try {
    // Get the JWT token from the request header
    token = utils.getToken(req);

    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    console.log(token, res);
    // Verify the JWT token
    utils.validateToken(token, res);
  } catch (error) {
    // Handle errors
    console.error("Error in protected route:", error);
    res.status(500).send("Internal Server Error");
  }
};
