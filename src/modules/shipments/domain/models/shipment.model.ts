import { ReceiverDto } from "@modules/users/domain/dtos/receiver.dto";
import { DimensionsDto } from "../dtos/dimensions.dto";
import { SenderDto } from "@modules/users/domain/dtos/sender.dto";
import { ShipmentDto } from "../dtos/shipment.dto";
import { ShipmentStatus } from "../enums/status.enum";
import { createHash } from "crypto";
import { v1 as uuid } from "uuid";

export class Shipment {
    readonly id: string;
    readonly description?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(
        readonly trackingCode: string,
        readonly sender: SenderDto,
        readonly receiver: ReceiverDto,
        public dimensions: DimensionsDto,
        public declaredValue: number,
        public status: ShipmentStatus = ShipmentStatus.PENDING,
        options?: {
            id?: string;
            description?: string;
            createdAt?: Date;
            updatedAt?: Date;
        }
    ) {
        this.id = options?.id ?? Shipment.newId;
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
            dimensions: this.dimensions,
            declaredValue: this.declaredValue,
            status: this.status,
            description: this.description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }

    static fromJson(json: ShipmentDto): Shipment {
        return new Shipment(
            json.trackingCode,
            json.sender,
            json.receiver,
            json.dimensions,
            json.declaredValue,
            json.status,
            {
                id: json.id,
                description: json.description,
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
