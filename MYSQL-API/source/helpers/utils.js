const jwt = require("jsonwebtoken");
const utilsConfig = require("../config/utils.config.js");
const { spawn } = require("child_process");
const fs = require("fs");

// Function to generate JWT
const getToken = (req) => {
  let token = null;
  try {
    const authHeader = req.headers["authorization"];
    token = authHeader ? authHeader.split(" ")[1] : null;
  } catch (err) {
    console.log("getToken", err);
  }
  return token;
};

// Function to generate JWT
const generateToken = (payload) => {
  return jwt.sign(payload, utilsConfig.SECRET_KEY, { expiresIn: "1h" });
};

// Function to generate JWT
const validateToken = (payload, res) => {
  jwt.verify(payload, utilsConfig.SECRET_KEY, (err, decoded) => {
    if (unauthorized(err, res, decoded) === 401) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    // Token is valid, proceed with protected resource
    console.log("Protected resource accessed by user: " + decoded.username);
    res.send("Protected resource accessed by user: " + decoded.username);
  });
};

// Function to generate JWT
const getTokenValue = (payload, res) => {
  jwt.verify(payload, utilsConfig.SECRET_KEY, (err, decoded) => {
    unauthorized(err, decoded, false);
    return decoded;
  });
};

function getEpoch() {
  return Math.floor(new Date().getTime() / 1000.0);
}

function getRandom(digits = 4) {
  let repeat = "0".repeat(digits <= 1 ? digits : digits - 1);
  return Math.floor(
    parseInt("1" + repeat) + Math.random() * parseInt("9" + repeat)
  );
}

function isNullOrEmpty(obj) {
  return obj === undefined || obj === null || obj === "";
}

function getValueIfNullOrEmpty(obj, objValue = null) {
  return isNullOrEmpty(obj) ? objValue : obj;
}

function findStringIgnoreCase(obj, search) {
  try {
    return getValueIfNullOrEmpty(obj).toLowerCase().includes(search);
  } catch (err) {
    console.log(err);
    return false;
  }
}

const fetchExceptionHandle = (err, res, itemTitle, msg = null) => {
  let returnValue = {};
  let errmsg = ``;
  if (!isNullOrEmpty(err)) {
    console.error(`Error while fetching ${itemTitle}`, err);
    returnValue = {
      errobj: err,
      data: null,
      message: `Error while fetching ${itemTitle}`,
    };
  } else if (res.length) {
    console.log(`${itemTitle} found:`, res[0]);
    returnValue = {
      errobj: null,
      data: res[0],
      message: !isNullOrEmpty(msg) ? msg : `${itemTitle} found`,
    };
  } else {
    errmsg = !isNullOrEmpty(msg) ? msg : `${itemTitle} not found`;
    returnValue = {
      errobj: { message: errmsg },
      data: null,
      message: errmsg,
    };
  }
  console.log(`returnValue::${itemTitle}>>`, returnValue);

  return returnValue;
};

const createExceptionHandle = (err, res, itemTitle, createObj, msg = null) => {
  let returnValue = {};
  let errmsg = "";
  if (!isNullOrEmpty(err)) {
    errmsg = `Unable to create ${itemTitle}`;
    console.error(errmsg, err);
    returnValue = { errobj: err, data: null, message: errmsg };
  } else if (res.changedRows > 0 || res.affectedRows > 0) {
    errmsg = !isNullOrEmpty(msg) ? msg : `Created ${itemTitle}`;
    console.log("res::", res);
    let data = {
      id: res.insertId,
      ...createObj,
    };
    console.log(res, data.message, errmsg, data);
    returnValue = { errobj: null, data: data, message: errmsg };
  } else {
    errmsg = `Invalid user Id`;
    returnValue = {
      errobj: { message: errmsg },
      data: null,
      message: errmsg,
    };
  }
  console.log(`returnValue::${itemTitle}>>`, returnValue);

  return returnValue;
};

const updateExceptionHandle = (
  err,
  res,
  itemTitle,
  record,
  updateObj,
  msg = null
) => {
  let returnValue = {};
  let errmsg = "";
  console.error(`errmsg`, errmsg, err);
  if (!isNullOrEmpty(err)) {
    errmsg = `Unable to update ${itemTitle}`;
    returnValue = { errobj: err, data: null, message: errmsg };
  } else if (res.changedRows > 0 || res.affectedRows > 0) {
    errmsg = !isNullOrEmpty(msg) ? msg : `Updated ${itemTitle}`;
    if (isNullOrEmpty(record)) record = { id: null };
    let data = {
      id: record.id,
      ...updateObj,
      message: errmsg,
    };
    console.log(res, data.message, errmsg, data);
    returnValue = { errobj: null, data: data, message: errmsg };
  } else {
    errmsg = `Invalid user Id`;
    returnValue = {
      errobj: { message: errmsg },
      data: null,
      message: errmsg,
    };
  }
  console.log(`returnValue::${itemTitle}>>`, returnValue);

  return returnValue;
};

function unauthorized(err = null, decoded = null, return401 = true) {
  if (!isNullOrEmpty(err)) {
    console.log("Unauthorized");
    if (return401) {
      return 401;
    }
  } else if (isNullOrEmpty(decoded)) {
    // Token is valid, proceed with protected resource
    console.log("Protected resource accessed by user: ", decoded);
  }
  return 200;
}

const generateUniqueString = (prefix = `prefix`) => {
  let ts = String(new Date().getTime()),
    out = "";
  for (let i = 0; i < ts.length; i += 2) {
    out += Number(ts.substring(i, 2)).toString(36);
  }
  return prefix + out;
};

const validIds = new Set();

// Function to generate a unique ID (e.g., UUID)
const generateUniqueId = () => {
  // Implement your unique ID generation logic here
  // Generate a unique ID (e.g., UUID)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const setValidUniqueId = (uniqueId) => {
  // Store the ID in memory and set its validity period (e.g., 1 hour)
  validIds.add(uniqueId);
  setTimeout(() => {
    validIds.delete(uniqueId);
  }, 3600 * 1000); // 1 hour in milliseconds}
};

const validateUniqueId = (uniqueId) => {
  return !validIds.has(uniqueId);
};

const executeCommand = async (command, args) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn(command, args);

    // Capture stdout and stderr data
    let stdoutData = "";
    let stderrData = "";

    // Listen for stdout data
    pythonProcess.stdout.on("data", (data) => {
      stdoutData += data.toString();
    });

    // Listen for stderr data
    pythonProcess.stderr.on("data", (data) => {
      stderrData += data.toString();
    });

    // Listen for process exit
    pythonProcess.on("close", (code) => {
      // Check if the process exited with an error
      if (code !== 0) {
        // Reject the promise with an error message
        reject(
          new Error(`Python script exited with code ${code}: ${stderrData}`)
        );
      } else {
        // Resolve the promise with the stdout data
        resolve(stdoutData);
      }
    });

    // Handle spawn errors
    pythonProcess.on("error", (err) => {
      // Reject the promise with the error
      reject(err);
    });
  });
};

const downloadFile = (filePath) => {
  try {
    // Stream the file to the response
    const fileStream = fs.createReadStream(filePath);

    // Variable to store the content of the file
    let fileContent = "";

    // Listen for data events and concatenate the chunks
    fileStream.on("data", (chunk) => {
      fileContent += chunk.toString();
    });

    // Once the stream ends, return the file content
    return new Promise((resolve, reject) => {
      fileStream.on("end", () => {
        // // console.log(fileContent);
        resolve({
          status: 200,
          message: "File content retrieved successfully",
          fileContent: fileContent,
          context: {
            "Content-Type": "text/csv",
            "Content-Disposition": 'attachment; filename="example.txt"',
          },
        });
      });

      // Handle stream error
      fileStream.on("error", (error) => {
        console.error("Error reading file:", error);
        reject(error);
      });
    });
  } catch (error) {
    console.error(error);
    return {
      status: 404,
      message: "File not found",
    };
  }
};

module.exports = {
  getToken,
  generateToken,
  validateToken,
  getTokenValue,
  getEpoch,
  getRandom,
  isNullOrEmpty,
  getValueIfNullOrEmpty,
  findStringIgnoreCase,
  fetchExceptionHandle,
  createExceptionHandle,
  updateExceptionHandle,
  unauthorized,
  generateUniqueString,
  validIds,
  setValidUniqueId,
  generateUniqueId,
  validateUniqueId,
  executeCommand,
  downloadFile,
};
