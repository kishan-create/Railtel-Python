// models/dbTestModel.js
const db = require("../helpers/db.js");
const utils = require("../helpers/utils.js");
const oracledb = require("oracledb");
let msgSummary = `Test connection to [dbtype] database`;

const DBTest = function () {
  this.test = {};
};

const OracleDbCreds = {
  user: "system",
  password: "oracle123$",
  connectString: "192.168.20.96:1521/XEPDB1", // Format: Hostname:Port/ServiceName
};

DBTest.getMySQLStatus = (result) => {
  var msg = msgSummary.replace(`[dbtype]`, `MySQL`);
  db.connection.query("SELECT 1 + 1 AS result", (err, res) => {
    let { errobj, data, message } = utils.fetchExceptionHandle(
      err,
      res,
      msg,
      `${msg} is pass`
    );
    result(errobj, data, message);
  });
};

DBTest.getOracleStatus = async (result) => {
  var msg = msgSummary.replace(`[dbtype]`, `Oracle`);
  try {
    // Establish a connection to the Oracle database
    const connection = await oracledb.getConnection(OracleDbCreds);

    // Close the connection
    await connection.close();
    let err = null;
    let { errobj, data, message } = utils.fetchExceptionHandle(
      err,
      [{ message: "Pass" }],
      msg,
      `${msg} is pass`
    );
    result(errobj, data, message);
  } catch (err) {
    // If there is an error, send an error response
    //console.error("Error connecting to Oracle database:", err);
    let { errobj, data, message } = utils.fetchExceptionHandle(
      err,
      [{ message: "Pass" }],
      msg,
      `${msg} is failed`
    );
    console.error(errobj, data, message);
    result(errobj, data, message);
  }
};

module.exports = DBTest;
