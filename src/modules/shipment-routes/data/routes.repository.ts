import { RouteEntity } from "@utils/database/entities/route.entity";
import { AppDataSource } from "@utils/database/config/database";
import { Route } from "../domain/models/route.model";

export class RouteRepository {
    static async save(route: Route): Promise<void> {
        const entity = new RouteEntity();
        entity.loadModel(route);
        await AppDataSource.getRepository(RouteEntity).save(entity);
    }
}
