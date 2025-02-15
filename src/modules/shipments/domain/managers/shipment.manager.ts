import { UserRepository } from "@modules/users/data/user.repository";
import { CustomError } from "@utils/helpers/customError";
import { ShipmentDto } from "../dtos/shipment.dto";
import { Shipment } from "../models/shipment.model";
import { ShipmentStatus } from "../enums/status.enum";
import { ShipmentRepository } from "@modules/shipments/data/shipment.repository";
import { validateLocation } from "@utils/helpers/functions";
import { ShipmentTrackingRepository } from "@modules/shipments/data/shipment-tracking.repository";
import { ShipmentTracking } from "../models/shipment-tracking.model";

export class ShipmentManager {
    static async createShipment(dto: ShipmentDto): Promise<ShipmentDto> {
        const sender = await UserRepository.findById(dto.senderId!);
        if (!sender) {
            throw new CustomError("El remitente no existe", 400);
        }

        //Validar locations
        await validateLocation(dto.origin);
        await validateLocation(dto.destination);

        const senderDto = sender.toSenderJson();

        const shipment = Shipment.fromJson(dto, senderDto);

        await ShipmentRepository.save(shipment);
        const tracking = new ShipmentTracking(
            shipment.id,
            ShipmentStatus.PENDING
        );
        await ShipmentTrackingRepository.save(tracking);

        return shipment.toJson();
    }

    static async getShipment(
        trackingCode: string,
        senderId?: string
    ): Promise<ShipmentDto> {
        const shipment = await ShipmentRepository.findByTrackingCode(trackingCode);
        if (!shipment) {
            throw new CustomError("El envío no existe", 404);
        }

        if (senderId && shipment.sender.id !== senderId) {
            throw new CustomError(
                "No tienes permisos para ver este envío",
                403
            );
        }

        return shipment.toJson();
    }

    static async getShipments(senderId: string): Promise<ShipmentDto[]> {
        const shipments = await ShipmentRepository.findBySender(senderId);
        return shipments.map((shipment) => shipment.toJson());
    }
}
