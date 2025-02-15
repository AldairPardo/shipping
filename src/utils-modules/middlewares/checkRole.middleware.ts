import { Role } from "@modules/auth/domain/enums/role.enum";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: { id: string; role: string };
}

export const checkRole = (allowedRoles: Role[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                res.status(401).json({ message: "No token provided" });
                return;
            }

            const token = authHeader.split(" ")[1]; // Bearer <token>
            if (!token) {
                res.status(401).json({ message: "Invalid token format" });
                return;
            }

            // Verificar el token
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET as string
            ) as { id: string; role: Role };

            // Verificar si el usuario tiene un rol permitido
            if (!allowedRoles.includes(decoded.role)) {
                res.status(403).json({ message: "Access denied" });
                return;
            }

            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
    };
};
