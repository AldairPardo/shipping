import { Request, Response } from "express";
import { AuthManager } from "../managers/auth.manager";
import { CreateUserDto } from "@modules/users/domain/dtos/user.dto";

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const payload: CreateUserDto = req.body;
            const user = await AuthManager.register(payload);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const data = await AuthManager.login(email, password);
            res.json(data);
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
}
