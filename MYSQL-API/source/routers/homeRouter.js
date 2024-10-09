/**
 * @swagger
 * tags:
 *   name: Home
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
const homeController = require("../controllers/homeController.js");

/**
 * @swagger
 * /api/home/validatetoken:
 *   get:
 *     summary: Validate JWT bearer token
 *     tags: [Home]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get("/validatetoken", homeController.validateToken);

module.exports = router;
