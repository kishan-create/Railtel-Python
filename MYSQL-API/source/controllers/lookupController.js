// controllers/lookupController.js
const Lookup = require("../models/lookupModel.js");
const utils = require("../helpers/utils.js");

// Controller method to retrieve all countries
exports.getCountries = (req, res) => {
  Lookup.getCountries((err, data, message) => {
    if (!utils.isNullOrEmpty(err)) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving countries.",
      });
    } else {
      res.send(data);
    }
  });
};

// Controller method to retrieve all CPU types
exports.getCpuTypes = (req, res) => {
  Lookup.getCpuTypes((err, data, message) => {
    if (!utils.isNullOrEmpty(err)) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving CPU types.",
      });
    } else {
      res.send(data);
    }
  });
};

// Controller method to retrieve all local storages
exports.getLocalStorages = (req, res) => {
  Lookup.getLocalStorages((err, data, message) => {
    if (!utils.isNullOrEmpty(err)) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving local storages.",
      });
    } else {
      res.send(data);
    }
  });
};

// Controller method to retrieve all memories
exports.getMemories = (req, res) => {
  Lookup.getMemories((err, data, message) => {
    if (!utils.isNullOrEmpty(err)) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving memories.",
      });
    } else {
      res.send(data);
    }
  });
};
