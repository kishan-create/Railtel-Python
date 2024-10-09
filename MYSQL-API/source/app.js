// app.js
const express = require("express");
const app = express();
const cors = require('cors');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const userRouter = require("./routers/userRouter.js");
const lookupRouter = require("./routers/lookupRouter.js");
const homeRouter = require("./routers/homeRouter.js");
const dbTestRouter = require("./routers/dbTestRouter.js");
const databaseAssessmentRouter = require("./routers/databaseAssessmentRouter.js");
const dataWarehouseAssessmentRouter = require("./routers/dataWarehouseAssessmentRouter.js");
const ociAdministrationRouter = require("./routers/ociAdministrationRouter.js");
const ociConfigurationRouter = require("./routers/ociConfigurationRouter.js");
const dataTransferRouter = require("./routers/dataTransferRouter.js");
const terraformRouter = require("./routers/terraformRouter.js");
const reportRouter = require("./routers/reportRouter.js");

// Parse requests of content-type: application/json
app.use(express.json());

// Use CORS middleware
app.use(cors());

// Swagger options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "OMF (OCI Migration Factory) API",
      version: "1.0.0",
      description: "API documentation for user-related endpoints",
    },
  },
  apis: ["./routers/*.js"], // Adjust the path accordingly
};

// Initialize Swagger-jsdoc
const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Use user routes
app.use("/api/users", userRouter);
app.use("/api/lookups", lookupRouter);
app.use("/api/home", homeRouter);
app.use("/api/dbtest", dbTestRouter);
app.use("/api/databaseAssessment", databaseAssessmentRouter);
app.use("/api/datawarehouseassessment", dataWarehouseAssessmentRouter);
app.use("/api/ociadministration", ociAdministrationRouter);
app.use("/api/ociconfiguration", ociConfigurationRouter);
app.use("/api/datatransfer", dataTransferRouter);
app.use("/api/terraform", terraformRouter);
app.use("/api/report", reportRouter);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
