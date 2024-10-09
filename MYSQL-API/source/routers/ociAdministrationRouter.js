/**
 * @swagger
 * tags:
 *   name: OciAdministration
 *   description: Oci administration management
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// routers/ociAdministrationRouter.js
const express = require("express");
const router = express.Router();
const ociAdministrationController = require("../controllers/ociAdministrationController.js");

/**
 * @swagger
 * /api/ociadministration/:
 *   get:
 *     summary: Retrieve a oci administration for user
 *     tags: [OciAdministration]
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
router.get("/", ociAdministrationController.get);

/**
 * @swagger
 * /api/ociadministration/testconnection:
 *   get:
 *     summary: Test connection oci administration for user
 *     tags: [OciAdministration]
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
router.get("/testconnection", ociAdministrationController.testConnection);

/**
 * @swagger
 * /api/ociadministration:
 *   post:
 *     summary: Create oci administration for user
 *     tags: [OciAdministration]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oci_endpoint:
 *                 type: string
 *                 example: oci endpoint
 *               tenancy_id:
 *                 type: string
 *                 example: tenancy id
 *               user_ocid:
 *                 type: string
 *                 example: user ocid
 *               private_key:
 *                 type: string
 *                 example: private key
 *               oci_region:
 *                 type: string
 *                 example: oci region
 *               fingure_print:
 *                 type: string
 *                 example: fingure print
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
router.post("/", ociAdministrationController.create);

/**
 * @swagger
 * /api/ociadministration:
 *   put:
 *     summary: Update oci administration for user
 *     tags: [OciAdministration]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oci_endpoint:
 *                 type: string
 *                 example: oci endpoint
 *               tenancy_id:
 *                 type: string
 *                 example: tenancy id
 *               user_ocid:
 *                 type: string
 *                 example: user ocid
 *               private_key:
 *                 type: string
 *                 example: private key
 *               oci_region:
 *                 type: string
 *                 example: oci region
 *               fingure_print:
 *                 type: string
 *                 example: fingure print
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
router.put("/", ociAdministrationController.update);

module.exports = router;
