import { Response } from "express";
import { ShipmentDto } from "../dtos/shipment.dto";
import { ShipmentManager } from "../managers/shipment.manager";
import { AuthRequest } from "@utils/middlewares/checkRole.middleware";
import { Role } from "@modules/auth/domain/enums/role.enum";
import { AssignShipmentDto } from "../dtos/assign-shipment.dto";
import { ShipmentStatus } from "../enums/status.enum";

export class ShipmentController {
    static async createShipment(req: AuthRequest, res: Response) {
        try {
            const payload: ShipmentDto = req.body;
            payload.senderId = req.user?.id as string;
            const shipment = await ShipmentManager.createShipment(payload);
            res.status(201).json(shipment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getShipment(req: AuthRequest, res: Response) {
        try {
            const { trackingCode } = req.params;
            const senderId = req.user?.role === Role.CUSTOMER ? req.user.id : undefined;
            const driverId = req.user?.role === Role.DRIVER ? req.user.id : undefined;
            const shipment = await ShipmentManager.getShipment(
                trackingCode,
                senderId,
                driverId
            );
            res.json(shipment);
        } catch (error) {
            res.status(error.status || 400).json({ message: error.message });
        }
    }

    static async getShipments(req: AuthRequest, res: Response) {
        try {
            const shipments = await ShipmentManager.getShipments(
                req.user?.id as string
            );
            res.json(shipments);
        } catch (error) {
            res.status(error.status || 400).json({ message: error.message });
        }
    }

    static async assignRoute(req: AuthRequest, res: Response) {
        try {
            const { trackingCode } = req.params;
            const payload: AssignShipmentDto = req.body;

            await ShipmentManager.assignRoute(trackingCode, payload.routeId);
            res.json("Ruta asignada con éxito");
        } catch (error) {
            res.status(error.status || 400).json({ message: error.message });
        }
    }

    static async finishShipment(req: AuthRequest, res: Response) {
        try {
            const { trackingCode } = req.params;
            const driverId = req.user?.role === Role.DRIVER ? req.user.id : undefined;
            await ShipmentManager.updateShipmentStatus(trackingCode, ShipmentStatus.DELIVERED, driverId);
            res.json("Envío finalizado");
        } catch (error) {
            res.status(error.status || 400).json({ message: error.message });
        }
    }

    static async getShipmentStatus(req: AuthRequest, res: Response) {
        try {
            const { trackingCode } = req.params;
            const status = await ShipmentManager.getShipmentStatus(trackingCode);
            res.json({ status});
        } catch (error) {
            res.status(error.status || 400).json({ message: error.message });
        }
    }
}
