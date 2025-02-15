import { AppDataSource } from "@utils/database/config/database";
import { ShipmentTracking } from "../domain/models/shipment-tracking.model";
import { ShipmentTrackingEntity } from "@utils/database/entities/shipment-tracking.entity";
import { ShipmentEntity } from "@utils/database/entities/shipment.entity";

export class ShipmentTrackingRepository {
    static async save(shipmentTracking: ShipmentTracking): Promise<void> {
        const entity = new ShipmentTrackingEntity();
        entity.loadModel(shipmentTracking, { id: shipmentTracking.shipmentId } as ShipmentEntity);
        await AppDataSource.getRepository(ShipmentTrackingEntity).save(entity);
    }
}
