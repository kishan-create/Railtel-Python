// helpers/db.js
const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");
const utils = require("../helpers/utils.js");

const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
});

connection.connect((error) => {
  if (error) {
    console.error("Database connection failed: ", error);
    throw error;
  }
  console.log("Connected to the database");
});

const executeQuery = async function executeQuery(query, singleRow = true) {
  return new Promise((resolve, reject) => {
    console.log("query:", query);
    connection.query(`${query}`, (err, results) => {
      if (!utils.isNullOrEmpty(err)) {
        reject(err);
        return;
      }
      resolve(singleRow ? results[0] : results);
    });
  });
};

module.exports = {
  connection: connection,
  executeQuery: executeQuery,
};
