import { RouteRepository } from "@modules/shipment-routes/data/routes.repository";
import cities from "@utils/data/cities.json";
import { RouteDto } from "../dtos/route.dto";
import { Route } from "../models/route.model";
import { CustomError } from "@utils/helpers/customError";
import { RouteTrackingDto } from "../dtos/route-tracking.dto";
import { RouteTracking } from "../models/route-tracking.model";
import vehicles from "@utils/data/vehicles.json";
import { ShipmentStatus } from "@modules/shipments/domain/enums/status.enum";
import { ShipmentManager } from "@modules/shipments/domain/managers/shipment.manager";

export class RouteManager {
    static async createRoute(dto: RouteDto): Promise<RouteDto> {
        //Validar ciudades válidas
        for (const city of dto.cities) {
            if (
                !cities.some(
                    (c) =>
                        c.keyword === city.city &&
                        c.department === city.department
                )
            ) {
                throw new CustomError(
                    `La ciudad ${city.city} ${city.department} no es válida`,
                    400
                );
            }
        }

        //validar vehiculo 
        const vehicle = vehicles.find((v) => v.id === dto.vehicleId);
        if (!vehicle) {
            throw new CustomError("El vehículo no es válido", 400);
        }

        const route = Route.fromJson(dto);
        await RouteRepository.save(route);
        return route.toJson();
    }

    static async getRoute(id: string, driverId?: string): Promise<RouteDto> {
        const route = await RouteRepository.findById(id);
        if (!route) {
            throw new CustomError("La ruta no existe", 404);
        }

        if (driverId && route.driverId !== driverId) {
            throw new CustomError("No tienes permisos para ver esta ruta", 403);
        }
        return route.toJson();
    }

    static async updateDriver(id: string, driverId: string): Promise<void> {
        const route = await RouteRepository.findById(id);
        if (!route) {
            throw new CustomError("La ruta no existe", 404);
        }

        if (route.isActive) {
            throw new CustomError(
                "No puedes asignar un conductor a una ruta activa",
                400
            );
        }

        if (route.finishedAt) {
            throw new CustomError(
                "No puedes asignar un conductor a una ruta finalizada",
                400
            );
        }

        const driverRoutes = await RouteRepository.findByDriver(driverId);

        if (driverRoutes?.some((r) => r.isActive)) {
            throw new CustomError("El conductor ya tiene una ruta activa", 400);
        }

        if (driverRoutes?.some((r) => this.isOverlapping(route, r))) {
            throw new CustomError(
                "El conductor ya tiene una ruta asignada en ese horario",
                400
            );
        }

        route.driverId = driverId;
        await RouteRepository.save(route);
    }

    private static isOverlapping(route1: Route, route2: Route): boolean {
        const route1StartTime = route1.startTime;
        const route1EndTime =
            Number(route1StartTime) + route1.estimatedHours * 60 * 60 * 1000;

        const route2StartTime = route2.startTime;
        const route2EndTime =
            Number(route2StartTime) + route2.estimatedHours * 60 * 60 * 1000;

        return (
            route1StartTime < route2EndTime && route1EndTime > route2StartTime
        );
    }

    static async addTracking(
        id: string,
        tracking: RouteTrackingDto,
        driverId: string
    ): Promise<void> {
        const route = await RouteRepository.findById(id, {
            withShipments: true,
        });
        if (!route) {
            throw new CustomError("La ruta no existe", 404);
        }

        // No permitir añadir ciudades a una ruta que no le pertenece
        if (
            !route.cities.some(
                (city) =>
                    city.city === tracking.city &&
                    city.department === tracking.department
            )
        ) {
            throw new CustomError("La ciudad no pertenece a la ruta", 400);
        }

        if (route.driverId !== driverId) {
            throw new CustomError(
                "No tienes permisos para agregar tracking a esta ruta",
                403
            );
        }

        if (!route.isActive && route.tracking!.length > 0) {
            throw new CustomError("La ruta no está activa", 400);
        }

        if (route.finishedAt) {
            throw new CustomError("La ruta ya ha finalizado", 400);
        }

        if (!route.isActive) {
            route.isActive = true;
            route.shipments?.forEach((shipment) => {
                ShipmentManager.updateShipmentStatus(shipment.trackingCode, ShipmentStatus.IN_TRANSIT);
            });
        }

        tracking.timestamp = new Date();
        route.tracking!.push(RouteTracking.fromJson(tracking));
        await RouteRepository.save(route);
    }

    static async finishRoute(id: string, driverId: string): Promise<void> {
        const route = await RouteRepository.findById(id);
        if (!route) {
            throw new CustomError("La ruta no existe", 404);
        }

        if (route.driverId !== driverId) {
            throw new CustomError(
                "No tienes permisos para finalizar esta ruta",
                403
            );
        }

        if (!route.isActive) {
            throw new CustomError("La ruta no está activa", 400);
        }

        route.isActive = false;
        route.finishedAt = new Date();
        await RouteRepository.save(route);
    }
}
