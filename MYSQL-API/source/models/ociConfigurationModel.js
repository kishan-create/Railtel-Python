// models/ociConfigurationModel.js
const db = require("../helpers/db.js");
const utils = require("../helpers/utils.js");
const tablename = "oci_configuration";
const usertable = "user_info";
const itemTitle = "OCI Configuration";

const OciConfiguration = function (obj) {
  this.availability_domain = obj.availability_domain;
  this.backup_policy = obj.backup_policy;
  this.boot_volume_size = obj.boot_volume_size;
  this.preserve_boot_volume = obj.preserve_boot_volume;
  this.compartment_name = obj.compartment_name;
  this.load_balancer_timeout = obj.load_balancer_timeout;
  this.client_prefix = obj.client_prefix;
  this.vcn_cidr = obj.vcn_cidr;
  this.vcn_sub_cidr = obj.vcn_sub_cidr;
  this.mgmt_sub_cidr = obj.mgmt_sub_cidr;
  this.ssh_pub_key_1 = obj.ssh_pub_key_1;
  this.ssh_pub_key_2 = obj.ssh_pub_key_2;
  this.db_system_size = obj.db_system_size;
  this.db_system_count = obj.db_system_count;
  this.db_edition = obj.db_edition;
  this.db_version = obj.db_version;
  this.db_host_user_name = obj.db_host_user_name;
};

class CreateOciConfiguration {
  constructor(obj, created_by) {
    this.availability_domain = obj.availability_domain;
    this.backup_policy = obj.backup_policy;
    this.boot_volume_size = obj.boot_volume_size;
    this.preserve_boot_volume = obj.preserve_boot_volume;
    this.compartment_name = obj.compartment_name;
    this.load_balancer_timeout = obj.load_balancer_timeout;
    this.client_prefix = obj.client_prefix;
    this.vcn_cidr = obj.vcn_cidr;
    this.vcn_sub_cidr = obj.vcn_sub_cidr;
    this.mgmt_sub_cidr = obj.mgmt_sub_cidr;
    this.ssh_pub_key_1 = obj.ssh_pub_key_1;
    this.ssh_pub_key_2 = obj.ssh_pub_key_2;
    this.db_system_size = obj.db_system_size;
    this.db_system_count = obj.db_system_count;
    this.db_edition = obj.db_edition;
    this.db_version = obj.db_version;
    this.db_host_user_name = obj.db_host_user_name;
    this.created_by = created_by;
    this.created_date = utils.getEpoch();
    this.status = obj.status || 1;
  }
  static test() {
    return null;
  }
}

class UpdateOciConfiguration {
  constructor(obj, updated_by) {
    this.availability_domain = obj.availability_domain;
    this.backup_policy = obj.backup_policy;
    this.boot_volume_size = obj.boot_volume_size;
    this.preserve_boot_volume = obj.preserve_boot_volume;
    this.compartment_name = obj.compartment_name;
    this.load_balancer_timeout = obj.load_balancer_timeout;
    this.client_prefix = obj.client_prefix;
    this.vcn_cidr = obj.vcn_cidr;
    this.vcn_sub_cidr = obj.vcn_sub_cidr;
    this.mgmt_sub_cidr = obj.mgmt_sub_cidr;
    this.ssh_pub_key_1 = obj.ssh_pub_key_1;
    this.ssh_pub_key_2 = obj.ssh_pub_key_2;
    this.db_system_size = obj.db_system_size;
    this.db_system_count = obj.db_system_count;
    this.db_edition = obj.db_edition;
    this.db_version = obj.db_version;
    this.db_host_user_name = obj.db_host_user_name;
    this.updated_by = updated_by;
    this.update_date = utils.getEpoch();
  }
  static test() {
    return null;
  }
}

OciConfiguration.primaryQuery = `SELECT 
tbl.id, tbl.availability_domain, tbl.backup_policy, tbl.boot_volume_size, 
tbl.preserve_boot_volume, tbl.compartment_name, tbl.load_balancer_timeout, tbl.client_prefix, 
tbl.vcn_cidr, tbl.vcn_sub_cidr, tbl.mgmt_sub_cidr, tbl.ssh_pub_key_1, tbl.ssh_pub_key_2, tbl.db_system_size, 
tbl.db_system_count, tbl.db_edition, tbl.db_version, tbl.db_host_user_name, 
IF(tbl.created_by IS NOT NULL, u2.first_name + u2.last_name, '') creator_name, 
tbl.update_date, IFNULL(tbl.updated_by, '') updated_by, 
IF(tbl.updated_by IS NOT NULL, u3.first_name + u3.last_name, '') updater_name 
FROM ${tablename} tbl 
LEFT JOIN ${usertable} u2 ON u2.id = tbl.created_by 
LEFT JOIN ${usertable} u3 ON u3.id = tbl.created_by `;

OciConfiguration.testConnection = async (userId, result) => {
  const query = `${OciConfiguration.primaryQuery} WHERE tbl.created_by = ${userId} `;
  const record = await db.executeQuery(`${query}`);
  if (utils.isNullOrEmpty(record)) {
    result({ message: `${itemTitle} not found` }, null, `failed`);
  } else {
    result(null, [], "passed");
  }
};

OciConfiguration.get = (id, result) => {
  db.connection.query(
    `${OciConfiguration.primaryQuery} WHERE tbl.created_by = ?`,
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

OciConfiguration.create = (userId, reqObj, result) => {
  console.log("reqObj:", reqObj);
  let createObj = new CreateOciConfiguration(reqObj, userId);
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

OciConfiguration.update = async (userId, reqObj, result) => {
  let updateObj = new UpdateOciConfiguration(reqObj, userId);
  console.log(reqObj, updateObj, userId);
  const query = `${OciConfiguration.primaryQuery} WHERE tbl.created_by = ${userId} `;
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

module.exports = OciConfiguration;
