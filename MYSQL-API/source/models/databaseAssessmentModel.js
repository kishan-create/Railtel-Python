// models/databaseAssessmentModel.js
const db = require("../helpers/db.js");
const utils = require("../helpers/utils.js");
const tablename = "database_assessment";
const usertable = "user_info";
const itemTitle = "Database Assessment";
const oracledb = require("oracledb");
const fs = require("fs");
const path = require("path");
const externals = require("../config/externals.config.js");

const DatabaseAssessment = function (obj) {
  this.user_name = obj.user_name;
  this.server_name = obj.server_name;
  this.user_id = obj.user_id;
  this.port = obj.port;
  this.connection_url = obj.connection_url;
  this.password = obj.password;
};

class CreateDatabaseAssessment {
  constructor(obj, created_by) {
    this.user_name = obj.user_name;
    this.server_name = obj.server_name;
    this.user_id = obj.user_id;
    this.port = obj.port;
    this.connection_url = obj.connection_url;
    this.password = obj.password;
    this.created_by = created_by;
    this.created_date = utils.getEpoch();
    this.status = obj.status || 1;
  }
  static test() {
    return null;
  }
}

class UpdateDatabaseAssessment {
  constructor(obj, updated_by) {
    this.user_name = obj.user_name;
    this.server_name = obj.server_name;
    this.user_id = obj.user_id;
    this.port = obj.port;
    this.connection_url = obj.connection_url;
    this.password = obj.password;
    this.updated_by = updated_by;
    this.update_date = utils.getEpoch();
  }
  static test() {
    return null;
  }
}

DatabaseAssessment.primaryQuery = `SELECT 
tbl.id, tbl.user_name, tbl.server_name, tbl.user_id, tbl.port, tbl.connection_url, tbl.password, 
tbl.created_date, IFNULL(tbl.created_by, '') created_by, 
IF(tbl.created_by IS NOT NULL, u2.first_name + u2.last_name, '') creator_name, 
tbl.update_date, IFNULL(tbl.updated_by, '') updated_by, 
IF(tbl.updated_by IS NOT NULL, u3.first_name + u3.last_name, '') updater_name 
FROM ${tablename} tbl 
LEFT JOIN ${usertable} u2 ON u2.id = tbl.created_by 
LEFT JOIN ${usertable} u3 ON u3.id = tbl.created_by `;

DatabaseAssessment.get = (id, result) => {
  db.connection.query(
    `${DatabaseAssessment.primaryQuery} WHERE tbl.created_by = ?`,
    id,
    (err, res) => {
      let { errobj, data, message } = utils.fetchExceptionHandle(
        err,
        res,
        itemTitle
      );
      result(errobj, data, message);
    }
  );
};

DatabaseAssessment.testConnection = async (userId, result) => {
  const query = `${DatabaseAssessment.primaryQuery} WHERE tbl.created_by = ${userId} `;
  const record = await db.executeQuery(`${query}`);
  if (utils.isNullOrEmpty(record)) {
    result({ message: `${itemTitle} not found` }, null, `failed`);
  } else {
    const OracleDbCreds = {
      user: record.user_id,
      password: record.password,
      connectString: `${record.server_name}:${record.port}/${record.user_name}`, // Format: Hostname:Port/ServiceName
    };
    console.log("DatabaseAssessment", record, OracleDbCreds);
    try {
      // Establish a connection to the Oracle database
      const connection = await oracledb.getConnection(OracleDbCreds);

      // Close the connection
      await connection.close();
      result(null, [], "passed");
    } catch (err) {
      console.log(err);
      result({ message: err.message }, null, err.message);
    }
  }
};

DatabaseAssessment.generateReport = async (userId, result) => {
  const query = `${DatabaseAssessment.primaryQuery} WHERE tbl.created_by = ${userId} `;
  const record = await db.executeQuery(`${query}`);
  if (utils.isNullOrEmpty(record)) {
    result({ message: `${itemTitle} not found` }, null, `failed`);
  } else {
    const OracleDbCreds = {
      user: record.user_id,
      password: record.password,
      connectString: `${record.server_name}:${record.port}/${record.user_name}`, // Format: Hostname:Port/ServiceName
    };
    console.log("DatabaseAssessment", record, OracleDbCreds);
    try {
      // Read the SQL query from the file
      const filePath = externals.DATABASEASSESSMENT.PATH;
      const fileName = externals.DATABASEASSESSMENT.FILES.QUERY;
      const fullFilePath = path.join(filePath, fileName);
      console.log(fullFilePath);
      //// const sqlQuery = fs.readFileSync(fullFilePath, "utf8");
      const sqlQuery = `SELECT SYSDATE FROM DUAL`;

      // Establish a connection to the Oracle database
      const connection = await oracledb.getConnection(OracleDbCreds);

      // Execute the query
      const sqlResult = await connection.execute(sqlQuery);

      // Log the result
      console.log("Query result:", sqlResult.rows);

      // Close the connection
      await connection.close();
      result(null, [], { result: sqlResult.rows, status: "passed" });
    } catch (err) {
      console.log(err);
      result({ message: err.message }, null, err.message);
    }
  }
};

DatabaseAssessment.create = (userId, reqObj, result) => {
  console.log("reqObj:", reqObj);
  let createObj = new CreateDatabaseAssessment(reqObj, userId);
  console.log(reqObj, createObj);
  db.connection.query(
    `INSERT INTO ${tablename} SET ?`,
    createObj,
    (err, res) => {
      let { errobj, data, message } = utils.createExceptionHandle(
        err,
        res,
        itemTitle,
        createObj
      );
      result(errobj, data, message);
    }
  );
};

DatabaseAssessment.update = async (userId, reqObj, result) => {
  let updateObj = new UpdateDatabaseAssessment(reqObj, userId);
  console.clear();
  console.log(reqObj, updateObj, userId);
  const query = `${DatabaseAssessment.primaryQuery} WHERE tbl.created_by = ${userId} `;
  const record = await db.executeQuery(`${query}`);

  db.connection.query(
    `UPDATE ${tablename} SET ? WHERE created_by = ?`,
    [updateObj, userId],
    (err, res) => {
      let { errobj, data, message } = utils.updateExceptionHandle(
        err,
        res,
        itemTitle,
        record,
        updateObj
      );
      result(errobj, data, message);
    }
  );
};

module.exports = DatabaseAssessment;
