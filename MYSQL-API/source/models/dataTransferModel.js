// models/dataTransferModel.js
const db = require("../helpers/db.js");
const utils = require("../helpers/utils.js");
const tablename = "data_transfer";
const usertable = "user_info";
const itemTitle = "Data Transfer";

const DataTransfer = function (obj) {
  this.compartment_name = obj.compartment_name;
  this.compartment_id = obj.compartment_id;
  this.cpu_type_id = obj.cpu_type_id;
  this.memory_id = obj.memory_id;
  this.local_storage_id = obj.local_storage_id;
  this.image = obj.image;
  this.display_name = obj.display_name;
};

class CreateDataTransfer {
  constructor(obj, created_by) {
    this.compartment_name = obj.compartment_name;
    this.compartment_id = obj.compartment_id;
    this.cpu_type_id = obj.cpu_type_id;
    this.memory_id = obj.memory_id;
    this.local_storage_id = obj.local_storage_id;
    this.image = obj.image;
    this.display_name = obj.display_name;
    this.created_by = created_by;
    this.created_date = utils.getEpoch();
    this.status = obj.status || 1;
  }
  static test() {
    return null;
  }
}

class UpdateDataTransfer {
  constructor(obj, updated_by) {
    this.compartment_name = obj.compartment_name;
    this.compartment_id = obj.compartment_id;
    this.cpu_type_id = obj.cpu_type_id;
    this.memory_id = obj.memory_id;
    this.local_storage_id = obj.local_storage_id;
    this.image = obj.image;
    this.display_name = obj.display_name;
    this.updated_by = updated_by;
    this.update_date = utils.getEpoch();
  }
  static test() {
    return null;
  }
}

DataTransfer.primaryQuery = `SELECT 
tbl.compartment_name, tbl.compartment_id, tbl.cpu_type_id,
tbl.memory_id, tbl.local_storage_id, tbl.image, tbl.display_name, 
tbl.created_date, IFNULL(tbl.created_by, '') created_by, 
IF(tbl.created_by IS NOT NULL, u2.first_name + u2.last_name, '') creator_name, 
tbl.update_date, IFNULL(tbl.updated_by, '') updated_by, 
IF(tbl.updated_by IS NOT NULL, u3.first_name + u3.last_name, '') updater_name 
FROM ${tablename} tbl 
LEFT JOIN ${usertable} u2 ON u2.id = tbl.created_by 
LEFT JOIN ${usertable} u3 ON u3.id = tbl.created_by `;

DataTransfer.get = (id, result) => {
  db.connection.query(
    `${DataTransfer.primaryQuery} WHERE tbl.created_by = ?`,
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

DataTransfer.testConnection = async (userId, result) => {
  const query = `${DataTransfer.primaryQuery} WHERE tbl.created_by = ${userId} `;
  const record = await db.executeQuery(`${query}`);  
  if (utils.isNullOrEmpty(record)) {
    result({ message: `${itemTitle} not found` }, null, `failed`);
  } else {
    result(null, [], "passed");
  }
};

DataTransfer.create = (userId, reqObj, result) => {
  console.log("reqObj:", reqObj);
  let createObj = new CreateDataTransfer(reqObj, userId);
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

DataTransfer.update = async (userId, reqObj, result) => {
  let updateObj = new UpdateDataTransfer(reqObj, userId);
  console.clear();
  console.log(reqObj, updateObj, userId);
  const query = `${DataTransfer.primaryQuery} WHERE tbl.created_by = ${userId} `;
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

module.exports = DataTransfer;
