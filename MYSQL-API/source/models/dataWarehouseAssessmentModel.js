// models/dataWarehouseAssessmentModel.js
const db = require("../helpers/db.js");
const utils = require("../helpers/utils.js");
const tablename = "data_warehouse_assessment";
const usertable = "user_info";
const itemTitle = "Data Warehouse Assessment";
const oracledb = require("oracledb");
const path = require("path");
const externals = require("../config/externals.config.js");
const { exec } = require("child_process");

const DataWarehouseAssessment = function (obj) {
  this.user_name = obj.user_name;
  this.server_name = obj.server_name;
  this.user_id = obj.user_id;
  this.port = obj.port;
  this.connection_url = obj.connection_url;
  this.password = obj.password;
};

class CreateDataWarehouseAssessment {
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

class UpdateDataWarehouseAssessment {
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

DataWarehouseAssessment.primaryQuery = `SELECT 
tbl.id, tbl.user_name, tbl.server_name, tbl.user_id, tbl.port, tbl.connection_url, tbl.password, 
tbl.created_date, IFNULL(tbl.created_by, '') created_by, 
IF(tbl.created_by IS NOT NULL, u2.first_name + u2.last_name, '') creator_name, 
tbl.update_date, IFNULL(tbl.updated_by, '') updated_by, 
IF(tbl.updated_by IS NOT NULL, u3.first_name + u3.last_name, '') updater_name 
FROM ${tablename} tbl 
LEFT JOIN ${usertable} u2 ON u2.id = tbl.created_by 
LEFT JOIN ${usertable} u3 ON u3.id = tbl.created_by `;

DataWarehouseAssessment.get = (id, result) => {
  db.connection.query(
    `${DataWarehouseAssessment.primaryQuery} WHERE tbl.created_by = ?`,
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

DataWarehouseAssessment.testConnection = async (userId, result) => {
  const query = `${DataWarehouseAssessment.primaryQuery} WHERE tbl.created_by = ${userId} `;
  const record = await db.executeQuery(`${query}`);
  if (utils.isNullOrEmpty(record)) {
    result({ message: `${itemTitle} not found` }, null, `failed`);
  } else {
    const OracleDbCreds = {
      user: record.user_id,
      password: record.password,
      connectString: `${record.server_name}:${record.port}/${record.user_name}`, // Format: Hostname:Port/ServiceName
    };
    console.log("DataWarehouseAssessment", record, OracleDbCreds);
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

DataWarehouseAssessment.generateReport = async (userId, result) => {
  const query = `${DataWarehouseAssessment.primaryQuery} WHERE tbl.created_by = ${userId} `;
  const record = await db.executeQuery(`${query}`);
  if (utils.isNullOrEmpty(record)) {
    result({ message: `${itemTitle} not found` }, null, `failed`);
  } else {
    const OracleDbCreds = {
      user: record.user_id,
      password: record.password,
      connectString: `${record.server_name}:${record.port}/${record.user_name}`, // Format: Hostname:Port/ServiceName
    };
    //// username/password@localhost:1521/XE
    console.log("DataWarehouseAssessment", record, OracleDbCreds);
    try {
      const filePath = externals.DATAWAREHOUSEASSESSMENT.PATH;
      const fileName = externals.DATAWAREHOUSEASSESSMENT.FILES.SHELL;
      const fullFilePath = path.join(filePath, fileName);
      const creds = `${OracleDbCreds.user}/${OracleDbCreds.password}@${OracleDbCreds.connectString}`;
      console.log(fullFilePath, creds);

      // Execute the shell script
      exec(`${fullFilePath} ${creds}`, (error, stdout, stderr) => {
        if (error) {
          console.error("Error executing shell script:", error);
          result({ message: `Error executing shell script` }, null, `Error executing shell script`);
          return;
        }
        console.log("Script output:", stdout);
        console.error("Script errors:", stderr);
        result(null, [], `Script executed successfully`);
      });
    } catch (err) {
      console.log(err);
      result({ message: err.message }, null, err.message);
    }
  }
};

DataWarehouseAssessment.create = (userId, reqObj, result) => {
  console.log("reqObj:", reqObj);
  let createObj = new CreateDataWarehouseAssessment(reqObj, userId);
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

DataWarehouseAssessment.update = async (userId, reqObj, result) => {
  let updateObj = new UpdateDataWarehouseAssessment(reqObj, userId);
  console.log(reqObj, updateObj, userId);
  const query = `${DataWarehouseAssessment.primaryQuery} WHERE tbl.created_by = ${userId} `;
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

module.exports = DataWarehouseAssessment;
