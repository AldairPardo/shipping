import { AppDataSource } from "@utils/database/config/database";
import { UserEntity } from "@utils/database/entities/user.entity";
import { User } from "../domain/models/user.model";

export class UserRepository {
    static async findAll(): Promise<User[]> {
        const users = await AppDataSource.getRepository(UserEntity).find();
        return users.map(user => user.toModel());
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
