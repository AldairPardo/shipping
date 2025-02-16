import { Router } from "express";
import { validateDto } from "@utils/middlewares/validateDto.middleware";
import { ShipmentController } from "../controllers/shipment.controller";
import { ShipmentDto } from "../dtos/shipment.dto";
import { checkRole } from "@utils/middlewares/checkRole.middleware";
import { Role } from "@modules/auth/domain/enums/role.enum";
import { AssignShipmentDto } from "../dtos/assign-shipment.dto";

const router = Router();

/**
 * @swagger
 * /shipments:
 *   post:
 *     summary: Create a new shipment
 *     tags: [Shipments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShipmentDto'
 *     responses:
 *       201:
 *         description: Shipment created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("", checkRole([Role.CUSTOMER]), validateDto(ShipmentDto), ShipmentController.createShipment);

/**
 * @swagger
 * /shipments/{trackingCode}:
 *   get:
 *     summary: Get shipment details by tracking code
 *     tags: [Shipments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trackingCode
 *         schema:
 *           type: string
 *         required: true
 *         description: Tracking code of the shipment
 *     responses:
 *       200:
 *         description: Shipment details retrieved successfully
 *       404:
 *         description: Shipment not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/:trackingCode", checkRole([Role.CUSTOMER, Role.ADMIN, Role.DRIVER]), ShipmentController.getShipment);

/**
 * @swagger
 * /shipments:
 *   get:
 *     summary: Get all shipments for the customer
 *     tags: [Shipments]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of shipments retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("", checkRole([Role.CUSTOMER]), ShipmentController.getShipments);

/**
 * @swagger
 * /shipments/{trackingCode}/assign:
 *   post:
 *     summary: Assign a route to a shipment
 *     tags: [Shipments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trackingCode
 *         schema:
 *           type: string
 *         required: true
 *         description: Tracking code of the shipment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignShipmentDto'
 *     responses:
 *       200:
 *         description: Route assigned successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/:trackingCode/assign", checkRole([Role.ADMIN]), validateDto(AssignShipmentDto), ShipmentController.assignRoute);

/**
 * @swagger
 * /shipments/{trackingCode}/finish:
 *   put:
 *     summary: Mark a shipment as finished
 *     tags: [Shipments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trackingCode
 *         schema:
 *           type: string
 *         required: true
 *         description: Tracking code of the shipment
 *     responses:
 *       200:
 *         description: Shipment marked as finished successfully
 *       404:
 *         description: Shipment not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put("/:trackingCode/finish", checkRole([Role.DRIVER]), ShipmentController.finishShipment);

/**
 * @swagger
 * /shipments/{trackingCode}/status:
 *   get:
 *     summary: Get the status of a shipment
 *     tags: [Shipments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trackingCode
 *         schema:
 *           type: string
 *         required: true
 *         description: Tracking code of the shipment
 *     responses:
 *       200:
 *         description: Shipment status retrieved successfully
 *       404:
 *         description: Shipment not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/:trackingCode/status", checkRole([Role.CUSTOMER]), ShipmentController.getShipmentStatus);

/**
 * @swagger
 * /shipments/statistics/{type}:
 *   get:
 *     summary: Get shipment statistics
 *     tags: [Shipments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *         description: Type of statistics to retrieve
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/statistics/:type", checkRole([Role.ADMIN]), ShipmentController.getStatistics);

export const ShipmentRoutes = router;
