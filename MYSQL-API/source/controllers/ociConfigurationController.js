// controllers/ociConfigurationController.js
const OciConfiguration = require("../models/ociConfigurationModel.js");
const jwt = require("jsonwebtoken");
const utilsConfig = require("../config/utils.config.js");
const utils = require("../helpers/utils.js");
const log = require("../helpers/log.js");
const tablename = "oci_configuration";
const itemTitle = "OCI Configuration";

// Controller method to retrieve OCI Configuration by token
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
      if (utils.unauthorized(err, res, decoded) === 401)
        return res.status(401).send({ message: "Unauthorized" });

      OciConfiguration.get(decoded.userId, (err, data, message) => {
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

// Controller method to test connection for OCI Configuration by token
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

      OciConfiguration.testConnection(decoded.userId, (err, data, message) => {
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

// Controller method to create OCI Configuration by token
exports.create = (req, res) => {
  let token = null;
  try {
    // Get the JWT token from the request header
    token = utils.getToken(req);

    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    jwt.verify(token, utilsConfig.SECRET_KEY, (err, decoded) => {
      if (utils.unauthorized(err, res, decoded) === 401)
        return res.status(401).send({ message: "Unauthorized" });

      const reqObj = new OciConfiguration({
        availability_domain: req.body.availability_domain,
        backup_policy: req.body.backup_policy,
        boot_volume_size: req.body.boot_volume_size,
        preserve_boot_volume: req.body.preserve_boot_volume,
        compartment_name: req.body.compartment_name,
        load_balancer_timeout: req.body.load_balancer_timeout,
        client_prefix: req.body.client_prefix,
        vcn_cidr: req.body.vcn_cidr,
        vcn_sub_cidr: req.body.vcn_sub_cidr,
        mgmt_sub_cidr: req.body.mgmt_sub_cidr,
        ssh_pub_key_1: req.body.ssh_pub_key_1,
        ssh_pub_key_2: req.body.ssh_pub_key_2,
        db_system_size: req.body.db_system_size,
        db_system_count: req.body.db_system_count,
        db_edition: req.body.db_edition,
        db_version: req.body.db_version,
        db_host_user_name: req.body.db_host_user_name,
      });
      console.log("postbody:", reqObj);

      OciConfiguration.create(decoded.userId, reqObj, (err, data, message) => {
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

// Controller method to update OCI Configuration by token
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

      const reqObj = new OciConfiguration({
        availability_domain: req.body.availability_domain,
        backup_policy: req.body.backup_policy,
        boot_volume_size: req.body.boot_volume_size,
        preserve_boot_volume: req.body.preserve_boot_volume,
        compartment_name: req.body.compartment_name,
        load_balancer_timeout: req.body.load_balancer_timeout,
        client_prefix: req.body.client_prefix,
        vcn_cidr: req.body.vcn_cidr,
        vcn_sub_cidr: req.body.vcn_sub_cidr,
        mgmt_sub_cidr: req.body.mgmt_sub_cidr,
        ssh_pub_key_1: req.body.ssh_pub_key_1,
        ssh_pub_key_2: req.body.ssh_pub_key_2,
        db_system_size: req.body.db_system_size,
        db_system_count: req.body.db_system_count,
        db_edition: req.body.db_edition,
        db_version: req.body.db_version,
        db_host_user_name: req.body.db_host_user_name,
      });
      console.log("postbody:", reqObj);

      OciConfiguration.update(decoded.userId, reqObj, (err, data, message) => {
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
