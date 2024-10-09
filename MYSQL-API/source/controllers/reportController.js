// controllers/reportController.js
const Report = require("../models/reportModel.js");
const utils = require("../helpers/utils.js");
const utilsConfig = require("../config/utils.config.js");
const jwt = require("jsonwebtoken");
const externals = require("../config/externals.config.js");

// Controller method to retrieve all Audit
exports.getRunner = async (req, res) => {
  let result = {
    status: 500,
    message: `Error running script`,
  };
  let uniqueId = ``;
  let token = null;
  try {
    // Get the JWT token from the request header
    token = utils.getToken(req);
    console.log(token);

    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    // Verify the JWT token
    jwt.verify(token, utilsConfig.SECRET_KEY, (err, decoded) => {
      if (utils.unauthorized(err, res, decoded) === 401)
        return res.status(401).send({ message: "Unauthorized" });
    });
  } catch (error) {
    token = null;
    console.error("Error in protected route:", error);
  }
  if (token !== null) {
    result = await Report.runPython(
      externals.REPORT.PYTHONFILES.SAMPLE,
      externals.REPORT.RUNNERPATH
    );

    if (result.status == 200) {
      uniqueId = utils.generateUniqueId();
      utils.setValidUniqueId(uniqueId);
    }
  }
  res.status(result.status).send({ message: result.message, id: uniqueId });
};

// Controller method to retrieve all Audit
exports.getAudit = (req, res) => {
  const uniqueId = req.body.uniqueId;
  console.log(req.body);
  let token = null;
  try {
    // Get the JWT token from the request header
    token = utils.getToken(req);

    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    // Verify the JWT token
    jwt.verify(token, utilsConfig.SECRET_KEY, (err, decoded) => {
      Report.getAudit((err, data, message) => {
        if (!utils.isNullOrEmpty(err)) {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Audit.",
          });
        } else {
          let extension = data.extension == `csv` ? `csv` : `txt`;
          res.setHeader(
            "Content-disposition",
            `attachment; fileName=${data.fileName}`
          );
          res.setHeader("Content-type", `text/${extension}`);
          res.send(data.fileContent);
        }
      }, uniqueId);
    });
  } catch (error) {
    console.error("Error in protected route:", error);
  }
};

// Controller method to retrieve all Billing
exports.getBilling = (req, res) => {
  const uniqueId = req.body.uniqueId;
  console.log(req.body);
  let token = null;
  try {
    // Get the JWT token from the request header
    token = utils.getToken(req);

    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    // Verify the JWT token
    jwt.verify(token, utilsConfig.SECRET_KEY, (err, decoded) => {
      Report.getBilling((err, data, message) => {
        if (!utils.isNullOrEmpty(err)) {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Audit.",
          });
        } else {
          let extension = data.extension == `csv` ? `csv` : `txt`;
          res.setHeader(
            "Content-disposition",
            `attachment; fileName=${data.fileName}`
          );
          res.setHeader("Content-type", `text/${extension}`);
          res.send(data.fileContent);
        }
      }, uniqueId);
    });
  } catch (error) {
    console.error("Error in protected route:", error);
  }
};

// Controller method to retrieve all CMDB
exports.getCMDB = (req, res) => {
  const uniqueId = req.body.uniqueId;
  let token = null;
  try {
    // Get the JWT token from the request header
    token = utils.getToken(req);

    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    // Verify the JWT token
    jwt.verify(token, utilsConfig.SECRET_KEY, (err, decoded) => {
      Report.getCMDB((err, data, message) => {
        if (!utils.isNullOrEmpty(err)) {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving CMDB.",
          });
        } else {
          let extension = data.extension == `csv` ? `csv` : `txt`;
          res.setHeader(
            "Content-disposition",
            `attachment; fileName=${data.fileName}`
          );
          res.setHeader("Content-type", `text/${extension}`);
          res.send(data.fileContent);
        }
      }, uniqueId);
    });
  } catch (error) {
    console.error("Error in protected route:", error);
  }
};

// Controller method to retrieve all OS Breakdown
exports.getOSBreakdown = (req, res) => {
  const uniqueId = req.body.uniqueId;
  let token = null;
  try {
    // Get the JWT token from the request header
    token = utils.getToken(req);

    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    // Verify the JWT token
    jwt.verify(token, utilsConfig.SECRET_KEY, (err, decoded) => {
      Report.getOSBreakdown((err, data, message) => {
        if (!utils.isNullOrEmpty(err)) {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while retrieving OS Breakdown.",
          });
        } else {
          let extension = data.extension == `csv` ? `csv` : `txt`;
          res.setHeader(
            "Content-disposition",
            `attachment; fileName=${data.fileName}`
          );
          res.setHeader("Content-type", `text/${extension}`);
          res.send(data.fileContent);
        }
      }, uniqueId);
    });
  } catch (error) {
    console.error("Error in protected route:", error);
  }
};

// Controller method to retrieve all Instance
exports.getInstance = async (req, res) => {
  const uniqueId = req.body.uniqueId;
  let token = null;
  try {
    // Get the JWT token from the request header
    token = utils.getToken(req);

    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    // Verify the JWT token
    jwt.verify(token, utilsConfig.SECRET_KEY, (err, decoded) => {
      Report.getInstance((err, data, message) => {
        if (!utils.isNullOrEmpty(err)) {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Instance.",
          });
        } else {
          let extension = data.extension == `csv` ? `csv` : `txt`;
          res.setHeader(
            "Content-disposition",
            `attachment; fileName=${data.fileName}`
          );
          res.setHeader("Content-type", `text/${extension}`);
          res.send(data.fileContent);
        }
      }, uniqueId);
    });
  } catch (error) {
    console.error("Error in protected route:", error);
  }
};

// Controller method to retrieve all VM Details
exports.getVMDetails = (req, res) => {
  const uniqueId = req.body.uniqueId;
  let token = null;
  try {
    // Get the JWT token from the request header
    token = utils.getToken(req);

    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    // Verify the JWT token
    jwt.verify(token, utilsConfig.SECRET_KEY, (err, decoded) => {
      Report.getVMDetails((err, data, message) => {
        if (!utils.isNullOrEmpty(err)) {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving VM Details.",
          });
        } else {
          let extension = data.extension == `csv` ? `csv` : `txt`;
          res.setHeader(
            "Content-disposition",
            `attachment; fileName=${data.fileName}`
          );
          res.setHeader("Content-type", `text/${extension}`);
          res.send(data.fileContent);
        }
      }, uniqueId);
    });
  } catch (error) {
    console.error("Error in protected route:", error);
  }
};

// Controller method to retrieve all Route Table
exports.getRouteTable = (req, res) => {
  const uniqueId = req.body.uniqueId;
  let token = null;
  try {
    // Get the JWT token from the request header
    token = utils.getToken(req);

    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    // Verify the JWT token
    jwt.verify(token, utilsConfig.SECRET_KEY, (err, decoded) => {
      Report.getRouteTable((err, data, message) => {
        if (!utils.isNullOrEmpty(err)) {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while retrieving Route Table.",
          });
        } else {
          let extension = data.extension == `csv` ? `csv` : `txt`;
          res.setHeader(
            "Content-disposition",
            `attachment; fileName=${data.fileName}`
          );
          res.setHeader("Content-type", `text/${extension}`);
          res.send(data.fileContent);
        }
      }, uniqueId);
    });
  } catch (error) {
    console.error("Error in protected route:", error);
  }
};

// Controller method to retrieve all Tagging
exports.getTagging = (req, res) => {
  const uniqueId = req.body.uniqueId;
  let token = null;
  try {
    // Get the JWT token from the request header
    token = utils.getToken(req);

    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    // Verify the JWT token
    jwt.verify(token, utilsConfig.SECRET_KEY, (err, decoded) => {
      Report.getTagging((err, data, message) => {
        if (!utils.isNullOrEmpty(err)) {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Tagging.",
          });
        } else {
          let extension = data.extension == `csv` ? `csv` : `txt`;
          res.setHeader(
            "Content-disposition",
            `attachment; fileName=${data.fileName}`
          );
          res.setHeader("Content-type", `text/${extension}`);
          res.send(data.fileContent);
        }
      }, uniqueId);
    });
  } catch (error) {
    console.error("Error in protected route:", error);
  }
};
