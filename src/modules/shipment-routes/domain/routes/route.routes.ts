import { Router } from "express";
import { validateDto } from "@utils/middlewares/validateDto.middleware";
import { checkRole } from "@utils/middlewares/checkRole.middleware";
import { Role } from "@modules/auth/domain/enums/role.enum";
import { RouteDto } from "../dtos/route.dto";
import { RouteController } from "../controllers/route.controller";
import { RouteTrackingDto } from "../dtos/route-tracking.dto";

const router = Router();

/**
 * @swagger
 * /routes:
 *   post:
 *     summary: Create a new route
 *     tags: [Routes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RouteDto'
 *     responses:
 *       201:
 *         description: Route created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("", checkRole([Role.ADMIN]), validateDto(RouteDto), RouteController.createRoute);

/**
 * @swagger
 * /routes/{id}:
 *   get:
 *     summary: Get a route by ID
 *     tags: [Routes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Route ID
 *     responses:
 *       200:
 *         description: Route retrieved successfully
 *       404:
 *         description: Route not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/:id", checkRole([Role.ADMIN]), RouteController.getRoute);

/**
 * @swagger
 * /routes/{id}/assign-driver:
 *   put:
 *     summary: Assign a driver to a route
 *     tags: [Routes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Route ID
 *     responses:
 *       200:
 *         description: Driver assigned successfully
 *       404:
 *         description: Route not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put("/:id/assign-driver", checkRole([Role.ADMIN]), RouteController.assignDriver);

/**
 * @swagger
 * /routes/{id}/add-tracking:
 *   put:
 *     summary: Add tracking information to a route
 *     tags: [Routes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Route ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RouteTrackingDto'
 *     responses:
 *       200:
 *         description: Tracking information added successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Route not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put("/:id/add-tracking", checkRole([Role.DRIVER]), validateDto(RouteTrackingDto), RouteController.addTracking);

/**
 * @swagger
 * /routes/{id}/finish:
 *   put:
 *     summary: Finish a route
 *     tags: [Routes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Route ID
 *     responses:
 *       200:
 *         description: Route finished successfully
 *       404:
 *         description: Route not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put("/:id/finish", checkRole([Role.DRIVER]), RouteController.finishRoute);

export const RouteRoutes = router;
