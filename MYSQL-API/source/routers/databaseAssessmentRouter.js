/**
 * @swagger
 * tags:
 *   name: DatabaseAssessment
 *   description: Database assessment management
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// routers/databaseAssessmentRouter.js
const express = require("express");
const router = express.Router();
const databaseAssessmentController = require("../controllers/databaseAssessmentController.js");

/**
 * @swagger
 * /api/databaseassessment/:
 *   get:
 *     summary: Retrieve a database assessment for user
 *     tags: [DatabaseAssessment]
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
router.get("/", databaseAssessmentController.get);

/**
 * @swagger
 * /api/databaseassessment/testconnection:
 *   get:
 *     summary: Test connection database assessment for user
 *     tags: [DatabaseAssessment]
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
router.get("/testconnection", databaseAssessmentController.testConnection);

/**
 * @swagger
 * /api/databaseassessment/generatereport:
 *   get:
 *     summary: Generate Report database assessment for user
 *     tags: [DatabaseAssessment]
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
router.get("/generatereport", databaseAssessmentController.generateReport);

/**
 * @swagger
 * /api/databaseassessment:
 *   post:
 *     summary: Create database assessment for user
 *     tags: [DatabaseAssessment]
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
router.post("/", databaseAssessmentController.create);

/**
 * @swagger
 * /api/databaseassessment:
 *   put:
 *     summary: Update database assessment for user
 *     tags: [DatabaseAssessment]
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
router.put("/", databaseAssessmentController.update);

module.exports = router;
