// controllers/dbTestController.js
const DBTest = require("../models/dbTestModel.js");
const jwt = require("jsonwebtoken");
const utilsConfig = require("../config/utils.config.js");
const utils = require("../helpers/utils.js");

// Controller method to retrieve all countries
exports.getMySQLStatus = (req, res) => {
  let token = null;
  try {
    // Get the JWT token from the request header
    token = utils.getToken(req);
    console.log(token)

    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    // Verify the JWT token
    jwt.verify(token, utilsConfig.SECRET_KEY, (err, decoded) => {
      if (utils.unauthorized(err, res, decoded) === 401) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      DBTest.getMySQLStatus((err, data, message) => {
        if (!utils.isNullOrEmpty(err)) {
          console.log(err);
          if (utils.findStringIgnoreCase(err.message, "not found")) {
            res.status(404).send({ message: err.message });
          } else {
            res.status(500).send({ message });
          }
        } else {
          res.send({ message });
        }
      });
    });
  } catch (error) {
    console.error("Error in protected route:", error);
  }
};

// Controller method to retrieve all countries
exports.getOracleStatus = (req, res) => {
  let token = null;
  try {
    // Get the JWT token from the request header
    token = utils.getToken(req);
    console.log(token)

    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    // Verify the JWT token
    jwt.verify(token, utilsConfig.SECRET_KEY, (err, decoded) => {
      if (utils.unauthorized(err, res, decoded) === 401) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      DBTest.getOracleStatus((err, data, message) => {
        if (!utils.isNullOrEmpty(err)) {
          console.log(err);
          if (utils.findStringIgnoreCase(err.message, "not found")) {
            res.status(404).send({ message: err.message });
          } else {
            res.status(500).send({ message });
          }
        } else {
          res.send({ message });
        }
      });
    });
  } catch (error) {
    console.error("Error in protected route:", error);
  }
};