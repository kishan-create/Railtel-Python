// controllers/databaseAssessmentController.js
const DatabaseAssessment = require("../models/databaseAssessmentModel.js");
const jwt = require("jsonwebtoken");
const utilsConfig = require("../config/utils.config.js");
const utils = require("../helpers/utils.js");
const log = require("../helpers/log.js");
const tablename = "database_assessment";
const itemTitle = "Database Assessment";

// Controller method to retrieve Database Assessment by token
exports.get = (req, res) => {
  let token = null;
  try {
    // Get the JWT token from the request header
    token = utils.getToken(req);

    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    // Verify the JWT token
    jwt.verify(token, utilsConfig.SECRET_KEY, (err, decoded) => {
      if (utils.unauthorized(err, res, decoded) === 401) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      DatabaseAssessment.get(decoded.userId, (err, data, message) => {
        if (!utils.isNullOrEmpty(err)) {
          console.log(err);
          if (utils.findStringIgnoreCase(err.message, "not found")) {
            res.status(404).send({ message: err.message });
          } else {
            res.status(500).send({ message });
          }
        } else {
          res.send(data);
        }
      });
    });
  } catch (error) {
    console.error("Error in protected route:", error);
  }
};

// Controller method to test connection for Database Assessment by token
exports.testConnection = (req, res) => {
  let token = null;
  try {
    // Get the JWT token from the request header
    token = utils.getToken(req);

    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    console.log("test connection");
    // Verify the JWT token
    jwt.verify(token, utilsConfig.SECRET_KEY, (err, decoded) => {
      if (utils.unauthorized(err, res, decoded) === 401) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      DatabaseAssessment.testConnection(
        decoded.userId,
        (err, data, message) => {
          console.log({ err, data, message });
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
        }
      );
    });
  } catch (error) {
    console.error("Error in protected route:", error);
  }
};

// Controller method to Generate Report for Database Assessment by token
exports.generateReport = (req, res) => {
  let token = null;
  try {
    // Get the JWT token from the request header
    token = utils.getToken(req);

    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    console.log("test connection");
    // Verify the JWT token
    jwt.verify(token, utilsConfig.SECRET_KEY, (err, decoded) => {
      if (utils.unauthorized(err, res, decoded) === 401) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      DatabaseAssessment.generateReport(
        decoded.userId,
        (err, data, message) => {
          console.log({ err, data, message });
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
        }
      );
    });
  } catch (error) {
    console.error("Error in protected route:", error);
  }
};

// Controller method to create Database Assessment by token
exports.create = (req, res) => {
  let token = null;
  try {
    // Get the JWT token from the request header
    token = utils.getToken(req);

    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    jwt.verify(token, utilsConfig.SECRET_KEY, (err, decoded) => {
      if (utils.unauthorized(err, res, decoded) === 401) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      const reqObj = new DatabaseAssessment({
        user_name: req.body.user_name,
        server_name: req.body.server_name,
        user_id: req.body.user_id,
        port: req.body.port,
        connection_url: req.body.connection_url,
        password: req.body.password,
      });
      console.log("postbody:", reqObj);

      DatabaseAssessment.create(
        decoded.userId,
        reqObj,
        (err, data, message) => {
          if (!utils.isNullOrEmpty(err)) {
            console.log(err);
            log.Excecption(
              JSON.stringify(err),
              `${utilsConfig.APP_ERROR_HEAD}: Create ${itemTitle} for user`,
              null,
              `${tablename}`,
              decoded.userId
            );
            if (utils.findStringIgnoreCase(err.message, "not found")) {
              res.status(404).send({ message: err.message });
            } else if (utils.findStringIgnoreCase(err.message, "duplicate")) {
              res.status(500).send({ message: `${itemTitle} already exists` });
            } else {
              res.status(500).send({ message });
            }
          } else {
            log.Activity(
              `Created user ${itemTitle}`,
              data.id,
              `${tablename}`,
              decoded.userId
            );
            res.send({ message });
          }
        }
      );
    });
  } catch (error) {
    console.error(`Create ${itemTitle} error:`, error);
  }
};

// Controller method to update Database Assessment by token
exports.update = (req, res) => {
  let token = null;
  try {
    // Get the JWT token from the request header
    token = utils.getToken(req);

    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    jwt.verify(token, utilsConfig.SECRET_KEY, (err, decoded) => {
      if (utils.unauthorized(err, res, decoded) === 401) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      const reqObj = new DatabaseAssessment({
        user_name: req.body.user_name,
        server_name: req.body.server_name,
        user_id: req.body.user_id,
        port: req.body.port,
        connection_url: req.body.connection_url,
        password: req.body.password,
      });
      console.log("postbody:", reqObj);

      DatabaseAssessment.update(
        decoded.userId,
        reqObj,
        (err, data, message) => {
          if (!utils.isNullOrEmpty(err)) {
            let errlogmsg = `${utilsConfig.APP_ERROR_HEAD}: Update user ${itemTitle}`;
            console.error(err, errlogmsg);
            log.Excecption(
              JSON.stringify(err),
              errlogmsg,
              req.params.id,
              `${tablename}`,
              decoded.userId
            );
            if (utils.findStringIgnoreCase(err.message, "not found")) {
              res.status(404).send({ message: err.message });
            } else {
              res.status(500).send({ message });
            }
          } else {
            log.Activity(message, data.id, `${tablename}`, decoded.userId);
            res.send({ message });
          }
        }
      );
    });
  } catch (error) {
    console.error(`Update ${tablename} error:`, error);
  }
};
