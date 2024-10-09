// models/lookupModel.js
const db = require("../helpers/db.js");
const utils = require("../helpers/utils.js");

const Lookup = function () {
  this.test = {};
};

Lookup.getCountries = (result) => {
  db.connection.query(`SELECT * FROM country`, (err, res) => {
    if (!utils.isNullOrEmpty(err)) {
      console.error("Error while fetching countries", err);
      result(err, null);
      return;
    }
    console.log("Countries:", res);
    result(null, res);
  });
};

Lookup.getCpuTypes = (result) => {
  db.connection.query(`SELECT * FROM cpu_type`, (err, res) => {
    if (!utils.isNullOrEmpty(err)) {
      console.error("Error while fetching cpu types", err);
      result(err, null);
      return;
    }
    console.log("Countries:", res);
    result(null, res);
  });
};

Lookup.getLocalStorages = (result) => {
  db.connection.query(`SELECT * FROM local_storage`, (err, res) => {
    if (!utils.isNullOrEmpty(err)) {
      console.error("Error while fetching local storages", err);
      result(err, null);
      return;
    }
    console.log("Countries:", res);
    result(null, res);
  });
};

Lookup.getMemories = (result) => {
  db.connection.query(`SELECT * FROM memory`, (err, res) => {
    if (!utils.isNullOrEmpty(err)) {
      console.error("Error while fetching memories", err);
      result(err, null);
      return;
    }
    console.log("Countries:", res);
    result(null, res);
  });
};

module.exports = Lookup;
