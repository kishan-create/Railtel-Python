// models/activityLogModel.js
const db = require("../helpers/db.js");
const utils = require("../helpers/utils.js");
const tablename = "activity_log";

const ActivityLog = function (obj) {
  this.activity = obj.activity;
  this.table_id = obj.table_id;
  this.table_name = obj.table_name;
  this.logged_by = obj.logged_by;
  this.log_date = utils.getEpoch();
};

ActivityLog.log = (activityLog, result) => {
  activityLog.log_date = utils.getEpoch();
  db.connection.query(
    `INSERT INTO ${tablename} SET ?`,
    activityLog,
    (err, res) => {
      if (!utils.isNullOrEmpty(err)) {
        console.error("Error creating activity log: ", err);
        result(err, null);
        return;
      }
      console.log("Created activity log: ", {
        id: res.insertId,
        ...activityLog,
      });
      result(null, { id: res.insertId, ...activityLog });
    }
  );
};

module.exports = ActivityLog;
