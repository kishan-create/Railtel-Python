/**
 * @swagger
 * tags:
 *   name: Lookup
 *   description: Lookup management
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// routers/lookupRouter.js
const express = require("express");
const router = express.Router();
const lookupController = require("../controllers/lookupController.js");

/**
 * @swagger
 * /api/lookups/countries:
 *   get:
 *     summary: Retrieve countries
 *     tags: [Lookup]
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
router.get("/countries", lookupController.getCountries);

/**
 * @swagger
 * /api/lookups/cputypes:
 *   get:
 *     summary: Retrieve CPU types
 *     tags: [Lookup]
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
router.get("/cputypes", lookupController.getCpuTypes);

/**
 * @swagger
 * /api/lookups/localstorages:
 *   get:
 *     summary: Retrieve local storages
 *     tags: [Lookup]
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
router.get("/localstorages", lookupController.getLocalStorages);

/**
 * @swagger
 * /api/lookups/memories:
 *   get:
 *     summary: Retrieve memories
 *     tags: [Lookup]
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
router.get("/memories", lookupController.getMemories);

module.exports = router;
