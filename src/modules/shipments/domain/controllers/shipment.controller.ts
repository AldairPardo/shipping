import { Response } from "express";
import { CreateShipmentDto } from "../dtos/shipment.dto";
import { ShipmentManager } from "../managers/shipment.manager";
import { AuthRequest } from "@utils/middlewares/checkRole.middleware";
import { Role } from "@modules/auth/domain/enums/role.enum";

export class ShipmentController {
    static async createShipment(req: AuthRequest, res: Response) {
        try {
            const payload: CreateShipmentDto = req.body;
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
            const userId = req.user?.role === Role.CUSTOMER ? req.user.id : undefined;
            const shipment = await ShipmentManager.getShipment(
                trackingCode,
                userId
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
}
