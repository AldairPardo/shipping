import { ShipmentStatus } from "../enums/status.enum";
import { createHash } from "crypto";
import { v1 as uuid } from "uuid";
import { ShipmentTrackingDto } from "../dtos/shipment-tracking.dto";

export class ShipmentTracking {
    readonly id: string;
    readonly description?: string;
    readonly timestamp: Date;

    constructor(
        public status: ShipmentStatus,
        options?: {
            id?: string;
            description?: string;
            timestamp?: Date;
        }
    ) {
        this.id = options?.id ?? ShipmentTracking.newId;
        this.description = options?.description;
        this.timestamp = options?.timestamp ?? new Date();
    }

    toJson(): ShipmentTrackingDto {
        return {
            status: this.status,
            description: this.description,
            timestamp: this.timestamp,
        };
    }

    static fromJson(json: ShipmentTrackingDto): ShipmentTracking {
        return new ShipmentTracking(
            json.status,
            {
                description: json.description,
                timestamp: json.timestamp,
            }
        );
    }

    private static get newId(): string {
        const baseId = uuid();
        const hash = createHash("md5").update(baseId);
        return hash.digest("hex").slice(0, 8).toUpperCase();
    }
}
