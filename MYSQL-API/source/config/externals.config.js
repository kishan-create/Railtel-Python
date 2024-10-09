// external paths
module.exports = {
  DATABASEASSESSMENT: {
    PATH: "../../Assessment/Database",
    FILES: { QUERY: "orasrpt.sql" },
  },
  DATAWAREHOUSEASSESSMENT: {
    PATH: "../../Assessment/Datawarehouse",
    FILES: { SHELL: "adb_schema_advisor.sh" },
  },
  REPORT: {
    //D:\Users\ShyamD\Source\Repos\OMF\OCI\Reporting_automation\OCI_Reporting_Automation\results\compile
    PATH: "..\\..\\Reporting_automation\\OCI_Reporting_Automation\\report_scripts",
    RUNNERPATH: "..\\..\\Reporting_automation\\OCI_Reporting_Automation",
    CSVPATH: "..\\..\\Reporting_automation\\results\\compile",
    PYTHONFILES: {
      SAMPLE: "sample.py",
      RUNNER: "runner.py",
      AUDIT: "audit_report.py",
      BILLING: "billable_report.py",
      CMDB: "cmdb_report.py",
      OSBREAKDOWN: "os_breakdown_report.py",
      INSTANCE: "report.py",
      VMDETAILS: "vm_details.py",
      ROUTETABLE: "route_table.py",
      TAGGING: "tagging_report.py",
    },
    CSVFILES: {
      AUDIT: "instances.csv",
      BILLING: "instances.csv",
      CMDB: "instances.csv",
      OSBREAKDOWN: "instances.csv",
      INSTANCE: "instances.csv",
      VMDETAILS: "instances.csv",
      ROUTETABLE: "instances.csv",
      TAGGING: "instances.csv",
    },
  },
};
