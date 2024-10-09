/**
 * @swagger
 * tags:
 *   name: DataTransfer
 *   description: Data transfer management
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// routers/dataTransferRouter.js
const express = require("express");
const router = express.Router();
const dataTransferController = require("../controllers/dataTransferController.js");

/**
 * @swagger
 * /api/datatransfer/:
 *   get:
 *     summary: Retrieve a data transfer for user
 *     tags: [DataTransfer]
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
router.get("/", dataTransferController.get);

/**
 * @swagger
 * /api/datatransfer/testconnection:
 *   get:
 *     summary: Test connection data transfer for user
 *     tags: [DataTransfer]
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
router.get("/testconnection", dataTransferController.testConnection);

/**
 * @swagger
 * /api/datatransfer:
 *   post:
 *     summary: Create data transfer for user
 *     tags: [DataTransfer]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               compartment_name:
 *                 type: string
 *                 example: compartment name
 *               compartment_id:
 *                 type: string
 *                 example: compartment id
 *               cpu_type_id:
 *                 type: number
 *                 example: 1
 *               memory_id:
 *                 type: number
 *                 example: 1
 *               local_storage_id:
 *                 type: number
 *                 example: 1
 *               image:
 *                 type: string
 *                 example: image
 *               display_name:
 *                 type: string
 *                 example: display name
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
router.post("/", dataTransferController.create);

/**
 * @swagger
 * /api/datatransfer:
 *   put:
 *     summary: Update data transfer for user
 *     tags: [DataTransfer]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               compartment_name:
 *                 type: string
 *                 example: compartment name
 *               compartment_id:
 *                 type: string
 *                 example: compartment id
 *               cpu_type_id:
 *                 type: number
 *                 example: 1
 *               memory_id:
 *                 type: number
 *                 example: 1
 *               local_storage_id:
 *                 type: number
 *                 example: 1
 *               image:
 *                 type: string
 *                 example: image
 *               display_name:
 *                 type: string
 *                 example: display name
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
router.put("/", dataTransferController.update);

module.exports = router;
