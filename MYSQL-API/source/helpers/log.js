const ActivityLog = require("../models/activityLogModel.js");
const ErrorLog = require("../models/errorLogModel.js");

const Activity = (
  activity,
  table_id = null,
  table_name = null,
  logged_by = null
) => {
  try {
    ActivityLog.log(
      {
        activity: activity,
        table_id: table_id,
        table_name: table_name,
        logged_by: logged_by,
      },
      (logerr, datalog) => {
        console.log("data:", datalog);
        console.log("Activity Log error:", logerr);
      }
    );
  } catch (errlog) {
    console.log("Activity Log exception:", errlog);
  }
};

const Excecption = (
  error_message = null,
  source = null,
  table_id = null,
  table_name = null,
  logged_by = null
) => {
  try {
    ErrorLog.log(
      {
        error_message: error_message,
        source: source,
        table_id: table_id,
        table_name: table_name,
        logged_by: logged_by,
      },
      (errlog1, datalog) => {
        console.log("Error Log error:", errlog1);
      }
    );
  } catch (errlog) {
    console.log("Error Log exception:", errlog);
  }
};

module.exports = { Activity, Excecption };
