/**
 * @swagger
 * tags:
 *   name: DBTest
 *   description: DBTest management
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// routers/dbTestRouter.js
const express = require("express");
const router = express.Router();
const dbTestController = require("../controllers/dbTestController.js");

/**
 * @swagger
 * /api/dbtest/getmysqlstatus:
 *   get:
 *     summary: Retrieve MySQL connection status
 *     tags: [DBTest]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
router.get("/getmysqlstatus", dbTestController.getMySQLStatus);

/**
 * @swagger
 * /api/dbtest/getoraclestatus:
 *   get:
 *     summary: Retrieve Oracle connection status
 *     tags: [DBTest]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
router.get("/getoraclestatus", dbTestController.getOracleStatus);

module.exports = router;
