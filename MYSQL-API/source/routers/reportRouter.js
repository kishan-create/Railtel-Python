/**
 * @swagger
 * tags:
 *   name: Report
 *   description: Report management
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// routers/reportRouter.js
const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController.js");

/**
 * @swagger
 * /api/report/runner:
 *   get:
 *     summary: Generate report files
 *     tags: [Report]
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
router.get("/runner", reportController.getRunner);

/**
 * @swagger
 * /api/report/audit:
 *   post:
 *     summary: Retrieve Audit
 *     tags: [Report]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uniqueId:
 *                 type: string
 *                 example: 97a703e9-fa89-4945-af6c-6197b4756073
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
router.post("/audit", reportController.getAudit);

/**
 * @swagger
 * /api/report/billing:
 *   post:
 *     summary: Retrieve Billing
 *     tags: [Report]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uniqueId:
 *                 type: string
 *                 example: 97a703e9-fa89-4945-af6c-6197b4756073
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
router.post("/billing", reportController.getBilling);

/**
 * @swagger
 * /api/report/cmdb:
 *   post:
 *     summary: Retrieve CMDB
 *     tags: [Report]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uniqueId:
 *                 type: string
 *                 example: 97a703e9-fa89-4945-af6c-6197b4756073
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
router.post("/cmdb", reportController.getCMDB);

/**
 * @swagger
 * /api/report/osbreakdown:
 *   post:
 *     summary: Retrieve OS Breakdown
 *     tags: [Report]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uniqueId:
 *                 type: string
 *                 example: 97a703e9-fa89-4945-af6c-6197b4756073
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
router.post("/osbreakdown", reportController.getOSBreakdown);

/**
 * @swagger
 * /api/report/instance:
 *   post:
 *     summary: Retrieve Instance
 *     tags: [Report]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uniqueId:
 *                 type: string
 *                 example: 97a703e9-fa89-4945-af6c-6197b4756073
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
router.post("/instance", reportController.getInstance);

/**
 * @swagger
 * /api/report/vmdetails:
 *   post:
 *     summary: Retrieve VM Details
 *     tags: [Report]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uniqueId:
 *                 type: string
 *                 example: 97a703e9-fa89-4945-af6c-6197b4756073
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
router.post("/vmdetails", reportController.getVMDetails);

/**
 * @swagger
 * /api/report/routetable:
 *   post:
 *     summary: Retrieve Route Table
 *     tags: [Report]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uniqueId:
 *                 type: string
 *                 example: 97a703e9-fa89-4945-af6c-6197b4756073
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
router.post("/routetable", reportController.getRouteTable);

/**
 * @swagger
 * /api/report/tagging:
 *   post:
 *     summary: Retrieve Tagging
 *     tags: [Report]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uniqueId:
 *                 type: string
 *                 example: 97a703e9-fa89-4945-af6c-6197b4756073
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
router.post("/tagging", reportController.getTagging);

module.exports = router;
