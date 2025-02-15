import { RouteEntity } from "@utils/database/entities/route.entity";
import { AppDataSource } from "@utils/database/config/database";
import { Route } from "../domain/models/route.model";

export class RouteRepository {
    static async save(route: Route): Promise<void> {
        const entity = new RouteEntity();
        entity.loadModel(route);
        await AppDataSource.getRepository(RouteEntity).save(entity);
    }

    static async findById(id: string): Promise<Route | undefined> {
        const entity = await AppDataSource.getRepository(RouteEntity).findOne({
            where: { id },
            relations: ["tracking"],
        });
        return entity?.toModel();
    }

    static async findByDriver(driverId: string): Promise<Route[] | undefined> {
        const entity = await AppDataSource.getRepository(RouteEntity).find({
            where: { driver_id: driverId },
            relations: ["tracking"],
        });
        return entity?.map((route) => route.toModel());
    }

    static async update(route: Route): Promise<void> {
        const entity = new RouteEntity();
        entity.loadModel(route);
        await AppDataSource.getRepository(RouteEntity).update(
            {
                id: route.id,
            },
            entity
        );
    }
}
