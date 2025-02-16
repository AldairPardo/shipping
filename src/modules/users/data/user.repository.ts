import { AppDataSource } from "@utils/database/config/database";
import { UserEntity } from "@utils/database/entities/user.entity";
import { User } from "../domain/models/user.model";
import { Like } from "typeorm";

export class UserRepository {
    static async findAll(): Promise<User[]> {
        const users = await AppDataSource.getRepository(UserEntity).find();
        return users.map((user) => user.toModel());
    }

    static async findById(id: string): Promise<User | null> {
        const user = await AppDataSource.getRepository(UserEntity).findOne({
            where: { id },
        });
        return user ? user.toModel() : null;
    }

    static async findByName(name: string): Promise<User[]> {
        const users = await AppDataSource.getRepository(UserEntity).find({
            where: [
                { firstname: Like(`%${name}%`) },
                { lastname: Like(`%${name}%`) },
            ],
        });
        return users.map((user) => user.toModel());
    }

    static async save(user: User): Promise<void> {
        const entity = new UserEntity();
        entity.loadModel(user);
        await AppDataSource.getRepository(UserEntity).save(entity);
    }

    static async findByEmail(email: string): Promise<User | null> {
        const user = await AppDataSource.getRepository(UserEntity).findOne({
            where: { email },
        });

        return user ? user.toModel() : null;
    }
}
