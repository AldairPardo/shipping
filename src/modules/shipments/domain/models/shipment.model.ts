import { ReceiverDto } from "@modules/shipments/domain/dtos/receiver.dto";
import { DimensionsDto } from "../dtos/dimensions.dto";
import { SenderDto } from "@modules/shipments/domain/dtos/sender.dto";
import { ShipmentDto } from "../dtos/shipment.dto";
import { ShipmentStatus } from "../enums/status.enum";
import { createHash } from "crypto";
import { v1 as uuid } from "uuid";
import { LocationDto } from "@modules/shipments/domain/dtos/location.dto";

export class Shipment {
    readonly id: string;
    readonly trackingCode: string;
    readonly description?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(
        readonly sender: SenderDto,
        readonly receiver: ReceiverDto,
        readonly origin: LocationDto,
        readonly destination: LocationDto, 
        public dimensions: DimensionsDto,
        public declaredValue: number,
        public status: ShipmentStatus = ShipmentStatus.PENDING,
        options?: {
            id?: string;
            trackingCode?: string;
            description?: string;
            createdAt?: Date;
            updatedAt?: Date;
        }
    ) {
        this.id = options?.id ?? Shipment.newId;
        this.trackingCode = options?.trackingCode ?? Shipment.newTrackingCode;
        this.description = options?.description;
        this.createdAt = options?.createdAt ?? new Date();
        this.updatedAt = options?.updatedAt ?? new Date();
    }

    toJson(): ShipmentDto {
        return {
            id: this.id,
            trackingCode: this.trackingCode,
            sender: this.sender,
            receiver: this.receiver,
            origin: this.origin,
            destination: this.destination,
            dimensions: this.dimensions,
            declaredValue: this.declaredValue,
            status: this.status,
            description: this.description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }

    static fromJson(json: ShipmentDto, sender: SenderDto): Shipment {
        return new Shipment(
            sender,
            json.receiver,
            json.origin,
            json.destination,
            json.dimensions,
            json.declaredValue,
            json.status,
            {
                id: json.id,
                trackingCode: json.trackingCode,
                description: json.description,
                createdAt: json.createdAt,
                updatedAt: json.updatedAt,
            }
        );
    }

    private static get newTrackingCode(): string {
        const baseId = uuid();
        const hash = createHash("md5").update(baseId);
        return hash.digest("hex").slice(0, 6).toUpperCase();
    }

    private static get newId(): string {
        const baseId = uuid();
        const hash = createHash("md5").update(baseId);
        return hash.digest("hex").slice(0, 8).toUpperCase();
    }
}
