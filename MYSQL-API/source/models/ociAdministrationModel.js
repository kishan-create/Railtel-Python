// models/ociAdministrationModel.js
const db = require("../helpers/db.js");
const utils = require("../helpers/utils.js");
const tablename = "oci_administration";
const usertable = "user_info";
const itemTitle = "OCI Administration";

const OciAdministration = function (obj) {
  this.oci_endpoint = obj.oci_endpoint;
  this.tenancy_id = obj.tenancy_id;
  this.user_ocid = obj.user_ocid;
  this.private_key = obj.private_key;
  this.oci_region = obj.oci_region;
  this.fingure_print = obj.fingure_print;
};

class CreateOciAdministration {
  constructor(obj, created_by) {
    this.oci_endpoint = obj.oci_endpoint;
    this.tenancy_id = obj.tenancy_id;
    this.user_ocid = obj.user_ocid;
    this.private_key = obj.private_key;
    this.oci_region = obj.oci_region;
    this.fingure_print = obj.fingure_print;
    this.created_by = created_by;
    this.created_date = utils.getEpoch();
    this.status = obj.status || 1;
  }
  static test() {
    return null;
  }
}

class UpdateOciAdministration {
  constructor(obj, updated_by) {
    this.oci_endpoint = obj.oci_endpoint;
    this.tenancy_id = obj.tenancy_id;
    this.user_ocid = obj.user_ocid;
    this.private_key = obj.private_key;
    this.oci_region = obj.oci_region;
    this.fingure_print = obj.fingure_print;
    this.updated_by = updated_by;
    this.update_date = utils.getEpoch();
  }
  static test() {
    return null;
  }
}

OciAdministration.primaryQuery = `SELECT 
tbl.id, tbl.oci_endpoint, tbl.tenancy_id, tbl.user_ocid, 
tbl.private_key, tbl.oci_region, tbl.fingure_print, 
IF(tbl.created_by IS NOT NULL, u2.first_name + u2.last_name, '') creator_name, 
tbl.update_date, IFNULL(tbl.updated_by, '') updated_by, 
IF(tbl.updated_by IS NOT NULL, u3.first_name + u3.last_name, '') updater_name 
FROM ${tablename} tbl 
LEFT JOIN ${usertable} u2 ON u2.id = tbl.created_by 
LEFT JOIN ${usertable} u3 ON u3.id = tbl.created_by `;

OciAdministration.testConnection = async (userId, result) => {
  const query = `${OciAdministration.primaryQuery} WHERE tbl.created_by = ${userId} `;
  const record = await db.executeQuery(`${query}`);
  if (utils.isNullOrEmpty(record)) {
    result({ message: `${itemTitle} not found` }, null, `failed`);
  } else {
    result(null, [], "passed");
  }
};

OciAdministration.get = (id, result) => {
  db.connection.query(
    `${OciAdministration.primaryQuery} WHERE tbl.created_by = ?`,
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

OciAdministration.create = (userId, reqObj, result) => {
  console.log("reqObj:", reqObj);
  let createObj = new CreateOciAdministration(reqObj, userId);
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

OciAdministration.update = async (userId, reqObj, result) => {
  let updateObj = new UpdateOciAdministration(reqObj, userId);
  console.log(reqObj, updateObj, userId);
  const query = `${OciAdministration.primaryQuery} WHERE tbl.created_by = ${userId} `;
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

module.exports = OciAdministration;
