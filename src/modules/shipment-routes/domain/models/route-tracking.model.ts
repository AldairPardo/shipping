import { RouteTrackingDto } from "../dtos/route-tracking.dto";
import { createHash } from "crypto";
import { v1 as uuid } from "uuid";

export class RouteTracking {
    readonly id: string;
    readonly timestamp: Date;

    constructor(
        readonly routeId: string,
        readonly city: string,
        readonly department: string,
        options?: {
            id?: string;
            timestamp?: Date;
        }
    ) {
        this.id = options?.id ?? RouteTracking.newId;
        this.timestamp = options?.timestamp ?? new Date();
    }

    toJson(): RouteTrackingDto {
        return {
            routeId: this.routeId,
            city: this.city,
            department: this.department,
            timestamp: this.timestamp,
        };
    }

    static fromJson(json: RouteTrackingDto): RouteTracking {
        return new RouteTracking(
            json.routeId,
            json.city,
            json.department,
            {
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
