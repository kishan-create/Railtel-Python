// models/reportModel.js
const utils = require("../helpers/utils.js");
const externals = require("../config/externals.config.js");

const REPORTTYPE = {
  AUDIT: "Audit",
  BILLING: "Billing",
  CMDB: "CMDB",
  OSBREAKDOWN: "OS Breakdown",
  INSTANCE: "Instance",
  VMDETAILS: "VM Details",
  ROUTETABLE: "Route Table",
  TAGGING: "Tagging",
};

const Report = function () {
  this.test = {};
};

Report.runPython = async (fileName, filePath) => {
  let res = {
    status: 500,
    message: `Error running script`,
  };
  try {
    const fullfilePath = `${filePath}\\${fileName}`;
    console.log(filePath, fileName, fullfilePath);

    await utils
      .executeCommand(`python`, [fullfilePath])
      .then((result) => {
        res = {
          status: 200,
          message: `Successfully running script`,
        };
        console.log("Script output:", result);
      })
      .catch((error) => {
        console.error("Error running script:", error);
      });
  } catch (errObj) {
    console.log("errObj", errObj);
    res = { status: 500, message: `Exception running script` };
  }
  console.log(res);
  return res;
};

Report.getReport = async (result, fileName, uniqueId) => {
  let filePath = externals.REPORT.CSVPATH;
  if (!utils.validateUniqueId(uniqueId)) {
    let val = await utils.downloadFile(`${filePath}\\${fileName}`);
    if (val.status !== 200) {
      result({ message: val.message }, null, `failed`);
    } else if (val.status === 200) {
      result(
        null,
        {
          fileName: fileName,
          extension: `csv`,
          fileContent: val.fileContent,
        },
        `success`
      );
    }
  } else {
    result({ message: `Invalid report token` }, null, `failed`);
  }
};

Report.getAudit = async (result, uniqueId) => {
  await Report.getReport(result, externals.REPORT.CSVFILES.AUDIT, uniqueId);
};

Report.getBilling = async (result, uniqueId) => {
  await Report.getReport(result, externals.REPORT.CSVFILES.BILLING, uniqueId);
};

Report.getCMDB = async (result, uniqueId) => {
  await Report.getReport(result, externals.REPORT.CSVFILES.CMDB, uniqueId);
};

Report.getOSBreakdown = async (result, uniqueId) => {
  await Report.getReport(result, externals.REPORT.CSVFILES.OSBREAKDOWN, uniqueId);
};

Report.getInstance = async (result, uniqueId) => {
  await Report.getReport(result, externals.REPORT.CSVFILES.INSTANCE, uniqueId);
};

Report.getVMDetails = async (result, uniqueId) => {
  await Report.getReport(result, externals.REPORT.CSVFILES.VMDETAILS, uniqueId);
};

Report.getRouteTable = async (result, uniqueId) => {
  await Report.getReport(result, externals.REPORT.CSVFILES.ROUTETABLE, uniqueId);
};

Report.getTagging = async (result, uniqueId) => {
  await Report.getReport(result, externals.REPORT.CSVFILES.TAGGING, uniqueId);
};

module.exports = Report;
