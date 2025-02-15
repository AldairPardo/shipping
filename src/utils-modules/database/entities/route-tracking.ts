import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { RouteEntity } from "./route.entity";
import { RouteTracking } from "@modules/shipment-routes/domain/models/route-tracking.model";

@Entity("route_tracking")
export class RouteTrackingEntity {
    @PrimaryColumn()
    id!: string;

    @ManyToOne(() => RouteEntity, (route) => route.tracking)
    @JoinColumn({ name: "route_id" })
    route!: RouteEntity;

    @Column()
    city!: string;

    @Column()
    department!: string;

    @CreateDateColumn()
    timestamp!: Date;

    loadModel(model: RouteTracking, route: RouteEntity) {
        this.id = model.id;
        this.route = route;
        this.city = model.city;
        this.department = model.department;
        this.timestamp = model.timestamp;
    }

    toModel(): RouteTracking {
        return new RouteTracking(
            this.route.id,
            this.city,
            this.department,
            {
                id: this.id,
                timestamp: this.timestamp,
            }
        );
    }
}
