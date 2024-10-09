// models/errorLogModel.js
const db = require("../helpers/db.js");
const utils = require("../helpers/utils.js");
const tablename = "error_log";

const ErrorLog = function (obj) {
  this.table_id = obj.table_id;
  this.table_name = obj.table_name;
  this.error_message = obj.error_message;
  this.source = obj.source;
  this.logged_by = obj.logged_by;
  this.log_date = utils.getEpoch();
};

ErrorLog.log = (errorLog, result) => {
  errorLog.log_date = utils.getEpoch();
  db.connection.query(
    `INSERT INTO ${tablename} SET ?`,
    errorLog,
    (err, res) => {
      if (!utils.isNullOrEmpty(err)) {
        console.error("Error creating error log: ", err);
        result(err, null);
        return;
      }
      console.log("Created error log: ", {
        id: res.insertId,
        ...errorLog,
      });
      result(null, { id: res.insertId, ...errorLog });
    }
  );
};

module.exports = ErrorLog;
