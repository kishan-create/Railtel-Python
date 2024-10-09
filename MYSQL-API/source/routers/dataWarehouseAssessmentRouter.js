/**
 * @swagger
 * tags:
 *   name: DataWarehouseAssessment
 *   description: Data warehouse assessment management
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// routers/dataWarehouseAssessmentRouter.js
const express = require("express");
const router = express.Router();
const dataWarehouseAssessmentController = require("../controllers/dataWarehouseAssessmentController.js");

/**
 * @swagger
 * /api/datawarehouseassessment/:
 *   get:
 *     summary: Retrieve a data warehouse assessment for user
 *     tags: [DataWarehouseAssessment]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/", dataWarehouseAssessmentController.get);

/**
 * @swagger
 * /api/datawarehouseassessment/testconnection:
 *   get:
 *     summary: Test connection data warehouse assessment for user
 *     tags: [DataWarehouseAssessment]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/testconnection", dataWarehouseAssessmentController.testConnection);

/**
 * @swagger
 * /api/datawarehouseassessment/generatereport:
 *   get:
 *     summary: Generate Report data warehouse assessment for user
 *     tags: [DataWarehouseAssessment]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/generatereport", dataWarehouseAssessmentController.generateReport);

/**
 * @swagger
 * /api/datawarehouseassessment:
 *   post:
 *     summary: Create data warehouse assessment for user
 *     tags: [DataWarehouseAssessment]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *                 example: user name
 *               server_name:
 *                 type: string
 *                 example: server name
 *               user_id:
 *                 type: string
 *                 example: user id
 *               port:
 *                 type: string
 *                 example: port
 *               connection_url:
 *                 type: string
 *                 example: connection url
 *               password:
 *                 type: string
 *                 example: mypassword123
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.post("/", dataWarehouseAssessmentController.create);

/**
 * @swagger
 * /api/datawarehouseassessment:
 *   put:
 *     summary: Update data warehouse assessment for user
 *     tags: [DataWarehouseAssessment]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *                 example: user name
 *               server_name:
 *                 type: string
 *                 example: server name
 *               user_id:
 *                 type: string
 *                 example: user id
 *               port:
 *                 type: string
 *                 example: port
 *               connection_url:
 *                 type: string
 *                 example: connection url
 *               password:
 *                 type: string
 *                 example: mypassword123
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.put("/", dataWarehouseAssessmentController.update);

module.exports = router;
