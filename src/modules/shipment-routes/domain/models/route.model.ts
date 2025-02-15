import { Shipment } from "@modules/shipments/domain/models/shipment.model";
import { RouteTracking } from "./route-tracking.model";
import { CitieDto } from "../dtos/citie.dto";
import { RouteDto } from "../dtos/route.dto";
import { createHash } from "crypto";
import { v1 as uuid } from "uuid";

export class Route {
    readonly id: string;
    readonly shipments?: Shipment[];
    readonly tracking?: RouteTracking[];
    readonly driverId?: string;
    public startedAt?: Date;
    public finishedAt?: Date;
    public isActive!: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(
        readonly cities: CitieDto[],
        readonly vehicleId: number, 
        options?: {
            id?: string;
            shipments?: Shipment[];
            tracking?: RouteTracking[];
            driverId?: string;
            startedAt?: Date;
            finishedAt?: Date;
            isActive?: boolean;
            createdAt?: Date;
            updatedAt?: Date;
        }
    ) {
        this.id = options?.id ?? Route.newId;
        this.shipments = options?.shipments;
        this.tracking = options?.tracking;
        this.driverId = options?.driverId;
        this.startedAt = options?.startedAt;
        this.finishedAt = options?.finishedAt;
        this.isActive = options?.isActive ?? false;
        this.createdAt = options?.createdAt ?? new Date();
        this.updatedAt = options?.updatedAt ?? new Date();
    }

    toJson(): RouteDto {
        return {
            id: this.id,
            shipments: this.shipments?.map((shipment) => shipment.toJson()),
            tracking: this.tracking?.map((tracking) => tracking.toJson()),
            cities: this.cities,
            vehicleId: this.vehicleId,
            driverId: this.driverId,
            startedAt: this.startedAt,
            finishedAt: this.finishedAt,
            isActive: this.isActive,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }

    static fromJson(json: RouteDto): Route {
        return new Route(
            json.cities,
            json.vehicleId,
            {
                id: json.id,
                tracking: json.tracking?.map((tracking) => RouteTracking.fromJson(tracking)),
                driverId: json.driverId,
                startedAt: json.startedAt,
                finishedAt: json.finishedAt,
                isActive: json.isActive,
                createdAt: json.createdAt,
                updatedAt: json.updatedAt,
            }
        );
    }

    private static get newId(): string {
        const baseId = uuid();
        const hash = createHash("md5").update(baseId);
        return hash.digest("hex").slice(0, 8).toUpperCase();
    }
}
