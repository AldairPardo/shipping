import { Response } from "express";
import { AuthRequest } from "@utils/middlewares/checkRole.middleware";
import { RouteDto } from "../dtos/route.dto";
import { RouteManager } from "../managers/route.manager";

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
}
