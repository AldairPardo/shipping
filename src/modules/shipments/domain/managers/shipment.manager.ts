import { UserRepository } from "@modules/users/data/user.repository";
import { CustomError } from "@utils/helpers/customError";
import { ShipmentDto } from "../dtos/shipment.dto";
import { Shipment } from "../models/shipment.model";
import { ShipmentStatus } from "../enums/status.enum";
import { ShipmentRepository } from "@modules/shipments/data/shipment.repository";
import { milisecondsToMinutesOrHours, validateLocation } from "@utils/helpers/functions";
import { ShipmentTracking } from "../models/shipment-tracking.model";
import { Route } from "@modules/shipment-routes/domain/models/route.model";
import { RouteRepository } from "@modules/shipment-routes/data/routes.repository";
import vehicles from "@utils/data/vehicles.json";
import redisClient from "@utils/database/config/redisClient";
import { FilterDto } from "../dtos/get-statistics.dto";
import { Between, In } from "typeorm";
import { ShipmentTrackingDto } from "../dtos/shipment-tracking.dto";
import { MetricsType } from "../enums/metrics.enum";
import { createHash } from "crypto";


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

        const tracking: ShipmentTrackingDto = {
            status: ShipmentStatus.PENDING,
            timestamp: new Date(),
        };
        shipment.tracking!.push(ShipmentTracking.fromJson(tracking));
        
        await ShipmentRepository.save(shipment);
        await this.setShipmentCache(
            shipment.trackingCode,
            ShipmentStatus.PENDING
        );

        return shipment.toJson();
    }

    static async getShipment(
        trackingCode: string,
        senderId?: string,
        driverId?: string
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

        if (driverId && shipment.route?.driverId !== driverId) {
            throw new CustomError(
                "No tienes permisos para ver este envío",
                403
            );
        }

        delete shipment.route;
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
        if (route.isActive) {
            shipment.status = ShipmentStatus.IN_TRANSIT;
            shipment.tracking!.push(ShipmentTracking.fromJson({
                status: ShipmentStatus.IN_TRANSIT,
                timestamp: new Date(),
            }));
        }
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

    static async updateShipmentStatus(
        trackingCode: string,
        status: ShipmentStatus,
        driverId?: string
    ): Promise<void> {
        const shipment = await ShipmentRepository.findByTrackingCode(trackingCode);
        if (!shipment) {
            throw new CustomError("El envío no existe", 404);
        }

        if (driverId && shipment.route?.driverId !== driverId) {
            throw new CustomError(
                "No tienes permisos para actualizar el estado de este envío",
                403
            );
        }

        shipment.status = status;
        await this.setShipmentCache(trackingCode, status);

        const tracking: ShipmentTrackingDto = {
            status,
            timestamp: new Date()
        }
        shipment.tracking!.push(ShipmentTracking.fromJson(tracking));
        await ShipmentRepository.save(shipment);
    }

    static async getShipmentStatus(trackingCode: string): Promise<ShipmentStatus> {
        const cacheKey = `shipment_status_${trackingCode}`;
        const status = await redisClient.get(cacheKey);
        if (status) {
            console.info('Caché encontrado');
            return status as ShipmentStatus;
        }

        const shipment = await ShipmentRepository.findByTrackingCode(trackingCode);
        if (!shipment) {
            throw new CustomError("El envío no existe", 404);
        }

        return shipment.status;
    }

    private static async setShipmentCache(trackingCode: string, status: ShipmentStatus): Promise<void> {
        const cacheKey = `shipment_status_${trackingCode}`;
        // Guardar en caché
        await redisClient.set(cacheKey, status);
        await redisClient.expire(cacheKey, 60);
        console.info("Caché actualizado");
    }

    static async getDashboard(filter: FilterDto, type: MetricsType) {
        const queryKey = `shipments:${createHash("md5")
            .update(JSON.stringify(filter))
            .digest("hex")}`;

        const cachedData = await redisClient.get(queryKey);
        if (cachedData) {
            console.info("Caché encontrado");
            return JSON.parse(cachedData);
        }

        const query = await this.buildQuery(filter);
        const shipments = await ShipmentRepository.findByQuery(query);

        let response: any; 
        switch (type) {
            case MetricsType.SHIPMENTS:
                response = shipments.map((s) => s.toJson());
                break;
            case MetricsType.DRIVERS:
                response = await this.getDriversStatistics(shipments);
                break;
            default:
                throw new CustomError("Tipo de dashboard no soportado", 400);
        }

        await redisClient.set(queryKey, JSON.stringify(response));
        await redisClient.expire(queryKey, 60);
        console.info("Caché actualizado");
        return response;
    }

    private static async buildQuery(filter: FilterDto): Promise<any> {
        const query: any = {};
        if (filter.status) {
            query['status'] = filter.status;
        }
        if (filter.driverName) {
            const drivers = await UserRepository.findByName(filter.driverName);
            query['route'] = { driver_id: In(drivers.map(d => d.id)) };
        }
        if (filter.startDate && filter.endDate) {
            query['created_at'] = Between(new Date(+filter.startDate), new Date(+filter.endDate));
        }
        return query;
    }

    private static async getDriversStatistics(shipments: Shipment[]): Promise<any[]> {
        const drivers = [...new Set(shipments.map(s => s.route?.driverId).filter(d => d))];

        const driversStatistics = await Promise.all(drivers.map(async d => {
            const driverShipments = shipments.filter(s => s.route?.driverId === d);
            const totalShipments = driverShipments.length;
            const deliveredShipments = driverShipments.filter(s => s.status === ShipmentStatus.DELIVERED);

            const averageTime = this.calculateAverageTime(deliveredShipments);

            const driver = await UserRepository.findById(d!);
            return {
                driverId: d,
                driverName: driver!.firstname + " " + driver!.lastname,
                totalShipments,
                totalDelivered: deliveredShipments.length,
                averageTime: milisecondsToMinutesOrHours(averageTime),
            }
        }));

        return driversStatistics;
    }

    private static calculateAverageTime(deliveredShipments: Shipment[]): number {
        const timesDelivered = deliveredShipments.map(s => +s.getTimeDelivered);
        return timesDelivered.reduce((acc, t) => acc + t, 0) / timesDelivered.length;
    }
}
