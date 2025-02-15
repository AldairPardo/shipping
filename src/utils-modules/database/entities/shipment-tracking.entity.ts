import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { ShipmentStatus } from "@modules/shipments/domain/enums/status.enum";
import { ShipmentEntity } from "./shipment.entity";
import { ShipmentTracking } from "@modules/shipments/domain/models/shipment-tracking.model";

@Entity("shipment_tracking")
export class ShipmentTrackingEntity {
    @PrimaryColumn()
    id!: string;

    @ManyToOne(() => ShipmentEntity, (shipment) => shipment.tracking)
    @JoinColumn({ name: "shipment_id" })
    shipment!: ShipmentEntity;
    
    @Column()
    status!: ShipmentStatus;

    @Column({ nullable: true })
    description?: string;

    @CreateDateColumn()
    timestamp!: Date;


    loadModel(model: ShipmentTracking, shipment: ShipmentEntity) {
        this.id = model.id;
        this.shipment = shipment;
        this.status = model.status;
        this.description = model.description;
        this.timestamp = model.timestamp;
    }

    toModel(): ShipmentTracking {
        return new ShipmentTracking(
            this.shipment.id,
            this.status,
            {
                id: this.id,
                description: this.description,
                timestamp: this.timestamp,
            }
        );
    }
}
