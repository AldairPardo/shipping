import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";
import { ShipmentEntity } from "./shipment.entity";
import { RouteTrackingEntity } from "./route-tracking";
import { CitieDto } from "@modules/shipment-routes/domain/dtos/citie.dto";
import { Route } from "@modules/shipment-routes/domain/models/route.model";

@Entity("route")
export class RouteEntity {
    @PrimaryColumn()
    id!: string;

    @Column({ type: "json" })
    cities!: CitieDto[];
    
    @Column({ type: "bigint" })
    start_time!: number;

    @Column({ nullable: true })
    finished_at?: Date;

    @Column({ default: false })
    is_active!: boolean;

    @Column({ nullable: true })
    driver_id?: string;

    @Column()
    vehicle_id!: number;

    @Column()
    estimated_hours!: number;

    @OneToMany(() => ShipmentEntity, (shipment) => shipment.route)
    shipments?: ShipmentEntity[];

    @OneToMany(() => RouteTrackingEntity, (tracking) => tracking.route)
    tracking?: RouteTrackingEntity[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    loadModel(model: Route) {
        this.id = model.id;
        this.cities = model.cities;
        this.start_time = model.startTime;
        this.finished_at = model.finishedAt;
        this.is_active = model.isActive;
        this.driver_id = model.driverId;
        this.estimated_hours = model.estimatedHours;
        this.vehicle_id = model.vehicleId;
        this.created_at = model.createdAt;
        this.updated_at = model.updatedAt;
    }

    toModel(): Route {
        return new Route(
            this.cities,
            this.vehicle_id,
            this.start_time,
            this.estimated_hours,
            {
                id: this.id,
                tracking: this.tracking?.map((tracking) => tracking.toModel()),
                driverId: this.driver_id,
                finishedAt: this.finished_at,
                isActive: this.is_active,
                createdAt: this.created_at,
                updatedAt: this.updated_at,
            }
        );
    }
}
