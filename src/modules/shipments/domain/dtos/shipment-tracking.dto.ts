import { IsString, IsNotEmpty, IsOptional, IsDate, IsEnum } from 'class-validator';
import { ShipmentStatus } from '../enums/status.enum';

export class UpdateShipmenTrackingDto {
    @IsNotEmpty()
    @IsEnum(ShipmentStatus)
    status!: ShipmentStatus;

    @IsString()
    @IsOptional()
    description?: string;
}

export class ShipmentTrackingDto extends UpdateShipmenTrackingDto {
    @IsDate()
    @IsNotEmpty()
    timestamp!: Date;
}