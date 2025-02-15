import { RouteRepository } from "@modules/shipment-routes/data/routes.repository";
import cities from "@utils/data/cities.json";
import { RouteDto } from "../dtos/route.dto";
import { Route } from "../models/route.model";
import { CustomError } from "@utils/helpers/customError";

export class RouteManager {
    static async createRoute(dto: RouteDto): Promise<RouteDto> {
        //Validar ciudades válidas
        for (const city of dto.cities) {
            if (!cities.some(c => c.keyword === city.city && c.department === city.department)) {
                throw new CustomError(`La ciudad ${city.city} ${city.department} no es válida`, 400);
            }
        }

        const route = Route.fromJson(dto);
        await RouteRepository.save(route);
        return route.toJson();
    }
}
