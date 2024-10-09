/**
 * @swagger
 * tags:
 *   name: OciConfiguration
 *   description: Oci configuration management
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// routers/ociConfigurationRouter.js
const express = require("express");
const router = express.Router();
const ociConfigurationController = require("../controllers/ociConfigurationController.js");

/**
 * @swagger
 * /api/ociconfiguration/:
 *   get:
 *     summary: Retrieve a oci configuration for user
 *     tags: [OciConfiguration]
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
router.get("/", ociConfigurationController.get);

/**
 * @swagger
 * /api/ociconfiguration/testconnection:
 *   get:
 *     summary: Test connection oci configuration for user
 *     tags: [OciConfiguration]
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
router.get("/testconnection", ociConfigurationController.testConnection);

/**
 * @swagger
 * /api/ociconfiguration:
 *   post:
 *     summary: Create oci configuration for user
 *     tags: [OciConfiguration]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               availability_domain:
 *                 type: string
 *                 example: availability domain
 *               backup_policy:
 *                 type: string
 *                 example: backup policy
 *               boot_volume_size:
 *                 type: string
 *                 example: boot volume size
 *               preserve_boot_volume:
 *                 type: string
 *                 example: preserve boot volume
 *               compartment_name:
 *                 type: string
 *                 example: compartment name
 *               load_balancer_timeout:
 *                 type: string
 *                 example: load balancer timeout
 *               client_prefix:
 *                 type: string
 *                 example: client prefix
 *               vcn_cidr:
 *                 type: string
 *                 example: vcn cidr
 *               vcn_sub_cidr:
 *                 type: string
 *                 example: vcn sub cidr
 *               mgmt_sub_cidr:
 *                 type: string
 *                 example: mgmt sub cidr
 *               ssh_pub_key_1:
 *                 type: string
 *                 example: ssh pub key 1
 *               ssh_pub_key_2:
 *                 type: string
 *                 example: ssh pub key 2
 *               db_system_size:
 *                 type: string
 *                 example: db system size
 *               db_system_count:
 *                 type: string
 *                 example: db system count
 *               db_edition:
 *                 type: string
 *                 example: db edition
 *               db_version:
 *                 type: string
 *                 example: db version
 *               db_host_user_name:
 *                 type: string
 *                 example: db host user name
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
router.post("/", ociConfigurationController.create);

/**
 * @swagger
 * /api/ociconfiguration:
 *   put:
 *     summary: Update oci configuration for user
 *     tags: [OciConfiguration]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               availability_domain:
 *                 type: string
 *                 example: availability domain
 *               backup_policy:
 *                 type: string
 *                 example: backup policy
 *               boot_volume_size:
 *                 type: string
 *                 example: boot volume size
 *               preserve_boot_volume:
 *                 type: string
 *                 example: preserve boot volume
 *               compartment_name:
 *                 type: string
 *                 example: compartment name
 *               load_balancer_timeout:
 *                 type: string
 *                 example: load balancer timeout
 *               client_prefix:
 *                 type: string
 *                 example: client prefix
 *               vcn_cidr:
 *                 type: string
 *                 example: vcn cidr
 *               vcn_sub_cidr:
 *                 type: string
 *                 example: vcn sub cidr
 *               mgmt_sub_cidr:
 *                 type: string
 *                 example: mgmt sub cidr
 *               ssh_pub_key_1:
 *                 type: string
 *                 example: ssh pub key 1
 *               ssh_pub_key_2:
 *                 type: string
 *                 example: ssh pub key 2
 *               db_system_size:
 *                 type: string
 *                 example: db system size
 *               db_system_count:
 *                 type: string
 *                 example: db system count
 *               db_edition:
 *                 type: string
 *                 example: db edition
 *               db_version:
 *                 type: string
 *                 example: db version
 *               db_host_user_name:
 *                 type: string
 *                 example: db host user name
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
router.put("/", ociConfigurationController.update);

module.exports = router;
