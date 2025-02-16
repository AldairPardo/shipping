import { AppDataSource } from "@utils/database/config/database";
import { Shipment } from "../domain/models/shipment.model";
import { ShipmentEntity } from "@utils/database/entities/shipment.entity";
import { UserEntity } from "@utils/database/entities/user.entity";

export class ShipmentRepository {
    static async save(shipment: Shipment): Promise<void> {
        const entity = new ShipmentEntity();
        entity.loadModel(shipment, { id: shipment.sender.id } as UserEntity);
        await AppDataSource.getRepository(ShipmentEntity).save(entity);
    }

    static async findByTrackingCode(
        trackingCode: string
    ): Promise<Shipment | undefined> {
        const entity = await AppDataSource.getRepository(
            ShipmentEntity
        ).findOne({
            where: { tracking_code: trackingCode },
            relations: ["sender","route","tracking"],
        });
        return entity?.toModel();
    }

    static async findBySender( senderId: string): Promise<Shipment[]> {
        const entities = await AppDataSource.getRepository(ShipmentEntity).find({
            where: { sender: { id: senderId } },
            relations: ["sender"],
        });
        return entities.map((entity) => entity.toModel());
    }

    static async findByQuery(query: any): Promise<Shipment[]> {
        const entities = await AppDataSource.getRepository(ShipmentEntity).find({
            where: query,
            relations: ["tracking", "sender", "route"],
        });
        return entities.map((entity) => entity.toModel());
    }
}
