// models/userModel.js
const db = require("../helpers/db.js");
const utils = require("../helpers/utils.js");
const tablename = "user_info";
const countrytable = "country";
const itemTitle = "User";

const User = function (user) {
  this.first_name = user.first_name;
  this.last_name = user.last_name;
  this.phone_number = user.phone_number;
  this.email_id = user.email_id;
  this.password = user.password;
  this.country_id = user.country_id;
};

class RegUser {
  constructor(user) {
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.phone_number = user.phone_number;
    this.phone_code = utils.getRandom();
    this.phone_code_verified = true;
    this.email_id = user.email_id;
    this.email_code = utils.getRandom();
    this.email_code_verified = true;
    this.password = user.password;
    this.country_id = user.country_id;
    this.created_date = utils.getEpoch();
    this.status = user.status || 1;
  }
  static test() {
    return null;
  }
}

User.primaryQuery = `SELECT tbl.id, tbl.first_name, tbl.last_name, 
c.phone_country_code, tbl.phone_number, 
tbl.email_id, tbl.created_date, IFNULL(tbl.created_by, '') created_by, 
IF(tbl.created_by IS NOT NULL, u2.first_name + u2.last_name, '') creator_name 
FROM ${tablename} tbl 
JOIN ${countrytable} c ON c.id = tbl.country_id 
LEFT JOIN ${tablename} u2 ON u2.id = tbl.created_by `;

User.getAll = (result) => {
  db.connection.query(`${User.primaryQuery}`, (err, res) => {
    let { errobj, data, message } = utils.fetchExceptionHandle(
      err,
      res,
      itemTitle
    );
    result(errobj, data, message);
  });
};

User.getById = (id, result) => {
  db.connection.query(
    `${User.primaryQuery} WHERE tbl.id = ?`,
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

User.userLogin = (user, result) => {
  db.connection.query(
    `${User.primaryQuery} WHERE tbl.email_id = ? AND tbl.password = ? `,
    [user.email_id, user.password],
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

User.create = (reqObj, result) => {
  let createObj = new RegUser(reqObj);
  console.log(`createObj`, createObj, reqObj);
  db.connection.query(
    `INSERT INTO ${tablename} SET ?`,
    createObj,
    (err, res) => {
      let { errobj, data, message } = utils.createExceptionHandle(
        err,
        res,
        itemTitle,
        createObj,
        "Successfully registered user"
      );
      result(errobj, data, message);
    }
  );
};

User.resetPassword = async (reqObj, result) => {
  const query = `${User.primaryQuery} WHERE tbl.email_id = '${reqObj.email_id}' `;
  const record = await db.executeQuery(`${query}`);

  db.connection.query(
    `UPDATE ${tablename} SET password = ? WHERE email_id = ? `,
    [reqObj.password, reqObj.email_id],
    (err, res) => {
      let { errobj, data, message } = utils.updateExceptionHandle(
        err,
        res,
        itemTitle,
        record,
        null,
        "Reset user password"
      );
      result(errobj, data, message);
    }
  );
};

User.changePassword = async (reqObj, result) => {
  const query = `${User.primaryQuery} WHERE tbl.id = '${reqObj.id}' `;
  const record = await db.executeQuery(`${query}`);

  if (!utils.isNullOrEmpty(record)) {
    db.connection.query(
      `UPDATE ${tablename} SET password = ? WHERE id = ? `,
      [reqObj.password, reqObj.id],
      (err, res) => {
        let { errobj, data, message } = utils.updateExceptionHandle(
          err,
          res,
          itemTitle,
          record,
          null,
          "Changed user password"
        );
        result(errobj, data, message);
      }
    );
  }
};

module.exports = User;
