// models/fileModel.js
const fs = require("fs");

exports.generateCSV = (header = `default`) => {
  // Generate the sample CSV content
  const fileContent = `Name (${header}), Age\nJohn Doe, 30\nJane Smith, 25\n`;

  return fileContent;
};

exports.getFileContent = (filepath) => {
  // Generate the sample CSV content
  const fileContent = fs.readFileSync(filepath);

  return fileContent;
};
