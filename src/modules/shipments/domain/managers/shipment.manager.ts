import { UserRepository } from "@modules/users/data/user.repository";
import { CustomError } from "@utils/helpers/customError";
import { ShipmentDto } from "../dtos/shipment.dto";
import { Shipment } from "../models/shipment.model";
import { ShipmentStatus } from "../enums/status.enum";
import { ShipmentRepository } from "@modules/shipments/data/shipment.repository";
import { validateLocation } from "@utils/helpers/functions";
import { ShipmentTrackingRepository } from "@modules/shipments/data/shipment-tracking.repository";
import { ShipmentTracking } from "../models/shipment-tracking.model";
import { Route } from "@modules/shipment-routes/domain/models/route.model";
import { RouteRepository } from "@modules/shipment-routes/data/routes.repository";
import vehicles from "@utils/data/vehicles.json";


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

    static async assignRoute(trackingCode: string, routeId: string): Promise<void> {
        const shipment = await ShipmentRepository.findByTrackingCode(trackingCode);
        if (!shipment) {
            throw new CustomError("El envío no existe", 404);
        }

        const route = await RouteRepository.findById(routeId);
        if (!route) {
            throw new CustomError("La ruta no existe", 404);
        }

        this.validateRoute(route, shipment);
        this.validateVehicleCapacity(route, shipment);

        shipment.route = Route.fromJson(route);
        shipment.status = ShipmentStatus.IN_TRANSIT;
        await ShipmentRepository.save(shipment);
    }

    private static validateRoute(route: Route, shipment: Shipment): void {
        if (route.finishedAt) {
            throw new CustomError("La ruta ya ha sido finalizada", 400);
        }

        const originCity = shipment.origin.city;
        const originDepartment = shipment.origin.department;
        const destinationCity = shipment.destination.city;
        const destinationDepartment = shipment.destination.department;

        //Si la ciudad de salida y llegada no están en la ruta entonces error
        if (
            !route.hasCity(originCity, originDepartment) ||
            !route.hasCity(destinationCity, destinationDepartment)
        ) {
            throw new CustomError("La ruta no incluye las ciudades de origen y destino del envío", 400);
        }

        //Si las ciudades son diferentes entonces validar que la ciudad de salida no esté después de la de llegada
        if (originCity !== destinationCity || originDepartment !== destinationDepartment) {
            if (route.isCityAfter(originCity, originDepartment, destinationCity, destinationDepartment)) {
                throw new CustomError("La ciudad de origen está después de la ciudad de destino en la ruta", 400);
            }
        }

        if (route.isActive) {
            //Si la ciudad de salida está en el tracking y no es la ultima entonces error
            if (
                route.hasVisitedCity(originCity, originDepartment) &&
                !route.isLastCity(originCity, originDepartment)
            ) {
                throw new CustomError("La ciudad de origen ya ha sido visitada", 400);
            }
        }
    }

    private static validateVehicleCapacity(route: Route, shipment: Shipment): void {
        const vehicle = vehicles.find((v) => v.id === route.vehicleId);

        // total de shipments en la ruta sin entregar
        const currentRouteShipments = route.shipments?.filter(
            (s) => s.status === ShipmentStatus.IN_TRANSIT
        ) || [];

        // Si el peso del envío supera el límite del vehículo entonces error
        const currentRouteWeight = currentRouteShipments.reduce(
            (acc, s) => acc + s.dimensions.weight,
            0
        );
        const totalWeight = currentRouteWeight + shipment.dimensions.weight;
        // console.log('el peso total es', totalWeight, 'el peso maximo es', vehicle!.maxWeight)
        if (totalWeight > vehicle!.maxWeight) {
            throw new CustomError("El peso del envío supera el límite del vehículo", 400);
        }

        //Si el vehículo no tiene espacio para el nuevo envío entonces error
        const currentVolume = currentRouteShipments.reduce(
            (acc, s) => acc + (s.dimensions.length * s.dimensions.width * s.dimensions.height),
            0
        );
        const newVolume = shipment.dimensions.length * shipment.dimensions.width * shipment.dimensions.height;
        // console.log('el volumen total es', currentVolume, "el nuevo volumen es", newVolume, 'el volumen maximo es', vehicle!.maxVolume)
        if (currentVolume + newVolume > vehicle!.maxVolume) {
            throw new CustomError("El volumen del envío supera el límite del vehículo", 400);
        }
    }
}
