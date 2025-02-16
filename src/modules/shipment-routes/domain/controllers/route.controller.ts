import { Response } from "express";
import { AuthRequest } from "@utils/middlewares/checkRole.middleware";
import { RouteDto } from "../dtos/route.dto";
import { RouteManager } from "../managers/route.manager";
import { Role } from "@modules/auth/domain/enums/role.enum";
import { RouteTrackingDto } from "../dtos/route-tracking.dto";

export class RouteController {
    static async createRoute(req: AuthRequest, res: Response) {
        try {
            const payload: RouteDto = req.body;
            const route = await RouteManager.createRoute(payload);
            res.status(201).json(route);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getRoute(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const driverId = req.user?.role === Role.DRIVER ? req.user.id : undefined;
            const route = await RouteManager.getRoute(id, driverId);
            res.json({ route });
        } catch (error) {
            res.status(error.status || 400).json({ message: error.message });
        }
    }

    static async assignDriver(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const { driverId } = req.body;
            await RouteManager.updateDriver(id, driverId);
            res.json({ message: "Driver assigned" });
        } catch (error) {
            res.status(error.status || 400).json({ message: error.message });
        }
    }

    static async addTracking(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const driverId = req.user?.id as string;
            const routeTracking: RouteTrackingDto = req.body;
            await RouteManager.addTracking(id, routeTracking, driverId);
            res.json({ message: "Tracking added" });
        } catch (error) {
            res.status(error.status || 400).json({ message: error.message });
        }
    }

    static async finishRoute(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const driverId = req.user?.id as string;
            await RouteManager.finishRoute(id, driverId);
            res.json({ message: "Route finished" });
        } catch (error) {
            res.status(error.status || 400).json({ message: error.message });
        }
    }
}
