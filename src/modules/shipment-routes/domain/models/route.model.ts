import { Shipment } from "@modules/shipments/domain/models/shipment.model";
import { RouteTracking } from "./route-tracking.model";
import { CitieDto } from "../dtos/citie.dto";
import { RouteDto } from "../dtos/route.dto";
import { createHash } from "crypto";
import { v1 as uuid } from "uuid";

export class Route {
    readonly id: string;
    readonly shipments?: Shipment[];
    readonly tracking?: RouteTracking[] = [];
    public driverId?: string;
    public finishedAt?: Date;
    public isActive!: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(
        readonly cities: CitieDto[],
        readonly vehicleId: number,
        public startTime: number,
        public estimatedHours: number,
        options?: {
            id?: string;
            shipments?: Shipment[];
            tracking?: RouteTracking[];
            driverId?: string;
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
            estimatedHours: this.estimatedHours,
            startTime: this.startTime,
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
            json.startTime,
            json.estimatedHours,
            {
                id: json.id,
                tracking: json.tracking?.map((tracking) =>
                    RouteTracking.fromJson(tracking)
                ),
                driverId: json.driverId,
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

    public hasCity(city: string, department: string): boolean {
        return this.cities.some(
            (citie) => citie.department === department && citie.city === city
        );
    }

    public hasVisitedCity(city: string, department: string): boolean {
        return (
            this.tracking?.some(
                (tracking) =>
                    tracking.department === department && tracking.city === city
            ) ?? false
        );
    }

    public get lastTracking(): RouteTracking | undefined {
        return this.tracking?.slice(-1)[0];
    }

    public isLastCity(city: string, department: string): boolean {
        return (
            this.lastTracking?.department === department &&
            this.lastTracking?.city === city
        );
    }

    public isCityAfter(
        originCity: string,
        originDepartment: string,
        destinationCity: string,
        destinationDepartment: string
    ): boolean {
        const originIndex = this.cities.findIndex(
            (citie) =>
                citie.city === originCity &&
                citie.department === originDepartment
        );
        const destinationIndex = this.cities.findIndex(
            (citie) =>
                citie.city === destinationCity &&
                citie.department === destinationDepartment
        );

        if (originIndex === -1 || destinationIndex === -1) {
            throw new Error("One or both cities are not in the route");
        }

        return originIndex > destinationIndex;
    }
}
