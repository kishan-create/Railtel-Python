/**
 * @swagger
 * tags:
 *   name: Terraform
 *   description: User management
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// routers/homeRouter.js
const express = require("express");
const router = express.Router();
const terraformController = require("../controllers/terraformController.js");

/**
 * @swagger
 * /api/terraform/apply:
 *   post:
 *     summary: Validate JWT bearer token
 *     tags: [Terraform]
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post("/apply", terraformController.ApplyTerraform);

module.exports = router;
