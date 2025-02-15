import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { ReceiverDto } from "@modules/users/domain/dtos/receiver.dto";
import { DimensionsDto } from "@modules/shipments/domain/dtos/dimensions.dto";
import { Shipment } from "@modules/shipments/domain/models/shipment.model";
import { ShipmentStatus } from "@modules/shipments/domain/enums/status.enum";

@Entity("shipment")
export class ShipmentEntity {
    @PrimaryColumn()
    id!: string;

    @Column()
    tracking_code!: string;

    @ManyToOne(() => UserEntity, (user) => user.shipments)
    @JoinColumn({ name: "sender_id" })
    sender!: UserEntity;

    @Column({ type: "json" })
    receiver!: ReceiverDto;

    @Column({ type: "json" })
    dimensions!: DimensionsDto;

    @Column({ nullable: true })
    description?: string;

    @Column()
    declared_value!: number;

    @Column({
        type: "enum",
        enum: ShipmentStatus,
        default: ShipmentStatus.PENDING,
    })
    status!: ShipmentStatus;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    loadModel(model: Shipment, sender: UserEntity) {
        this.id = model.id;
        this.tracking_code = model.trackingCode;
        this.sender = sender;
        this.receiver = model.receiver;
        this.dimensions = model.dimensions;
        this.declared_value = model.declaredValue;
        this.status = model.status;
        this.description = model.description;
        this.created_at = model.createdAt;
        this.updated_at = model.updatedAt;
    }

    toModel(): Shipment {
        return new Shipment(
            this.tracking_code,
            this.sender.toModel(),
            this.receiver,
            this.dimensions,
            this.declared_value,
            this.status,
            {
                id: this.id,
                description: this.description,
                createdAt: this.created_at,
                updatedAt: this.updated_at,
            }
        );
    }
}
