// controllers/dataTransferController.js
const DataTransfer = require("../models/dataTransferModel.js");
const jwt = require("jsonwebtoken");
const utilsConfig = require("../config/utils.config.js");
const utils = require("../helpers/utils.js");
const log = require("../helpers/log.js");
const tablename = "data_Transfer";
const itemTitle = "Data Transfer";

// Controller method to retrieve Data Transfer by token
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

      DataTransfer.get(decoded.userId, (err, data, message) => {
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

// Controller method to retrieve Data Transfer by token
exports.testConnection = (req, res) => {
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

      DataTransfer.testConnection(decoded.userId, (err, data, message) => {
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

// Controller method to test connection for Data Transfer by token
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

      console.log("req.body", req.body);

      const reqObj = new DataTransfer({
        compartment_name: req.body.compartment_name,
        compartment_id: req.body.compartment_id,
        cpu_type_id: req.body.cpu_type_id,
        memory_id: req.body.memory_id,
        local_storage_id: req.body.local_storage_id,
        image: req.body.image,
        display_name: req.body.display_name,
      });
      console.log("postbody:", reqObj);

      DataTransfer.create(decoded.userId, reqObj, (err, data, message) => {
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
      });
    });
  } catch (error) {
    console.error(`Create ${itemTitle} error:`, error);
  }
};

// Controller method to update Data Transfer by token
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

      const reqObj = new DataTransfer({
        compartment_name: req.body.compartment_name,
        compartment_id: req.body.compartment_id,
        cpu_type_id: req.body.cpu_type_id,
        memory_id: req.body.memory_id,
        local_storage_id: req.body.local_storage_id,
        image: req.body.image,
        display_name: req.body.display_name,
      });
      console.log("postbody:", reqObj);

      DataTransfer.update(decoded.userId, reqObj, (err, data, message) => {
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
      });
    });
  } catch (error) {
    console.error(`Update ${tablename} error:`, error);
  }
};
