import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { CreateUserDto } from "@modules/users/domain/dtos/user.dto";
import { User } from "@modules/users/domain/models/user.model";
import { UserRepository } from "@modules/users/data/user.repository";
import { CustomError } from "@utils/helpers";

dotenv.config();

export class AuthManager {
    static async register(dto: CreateUserDto): Promise<boolean> {
        const existingUser = await UserRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new CustomError("El usuario ya existe", 400);
        }

        const user = new User(
            dto.firstname,
            dto.lastname,
            dto.email,
            await User.hashPassword(dto.password),
            dto.role,
            {
                phone: dto.phone,
                docType: dto.docType,
                docNumber: dto.docNumber
            }
        );
        await UserRepository.save(user);
        return true;
    }

    static async login(email: string, password: string) {
        const user = await UserRepository.findByEmail(email);

        if (!user || !(await user.comparePassword(password))) {
            throw new CustomError("Credenciales incorrectas", 401);
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "1h",
            }
        );

        return { token };
    }

    async verifyToken(token: string): Promise<any> {
        try {
            return jwt.verify(token, process.env.JWT_SECRET as string);
        } catch {
            return null;
        }
    }
}
