import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { UserEntity } from "../entities/user.entity";
import { ShipmentEntity } from "../entities/shipment.entity";
import { ShipmentTrackingEntity } from "../entities/shipment-tracking.entity";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [UserEntity, ShipmentEntity, ShipmentTrackingEntity],
    synchronize: true, // En producción, cambiar a false
});
