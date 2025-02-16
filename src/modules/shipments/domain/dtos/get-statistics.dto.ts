import { IsString, IsOptional, IsNumber, IsEnum } from "class-validator";
import { ShipmentStatus } from "../enums/status.enum";

export class FilterDto {
    @IsString()
    @IsOptional()
    driverName?: string;

    @IsNumber()
    @IsOptional()
    startDate?: number;

    @IsNumber()
    @IsOptional()
    endDate?: number;

    @IsOptional()
    @IsEnum(ShipmentStatus)
    status?: ShipmentStatus;
}
