import { IsNotEmpty, IsOptional, IsNumber, ValidateNested, IsEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CitieDto } from './citie.dto';
import { ShipmentDto } from '@modules/shipments/domain/dtos/shipment.dto';
import { RouteTrackingDto } from './route-tracking.dto';

export class RouteDto {
    @IsEmpty()
    id?: string;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ShipmentDto)
    shipments?: ShipmentDto[];

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CitieDto)
    cities!: CitieDto[];

    @IsNumber()
    @IsNotEmpty()
    vehicleId!: number;

    @IsNumber()
    @IsNotEmpty()
    estimatedHours!: number;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => RouteTrackingDto)
    tracking?: RouteTrackingDto[];

    @IsString()
    @IsOptional()
    driverId?: string;

    @IsEmpty()
    isActive?: boolean;

    @IsNumber()
    @IsNotEmpty()
    startTime!: number;

    @IsEmpty()
    finishedAt?: Date;

    @IsEmpty()
    createdAt!: Date;

    @IsEmpty()
    updatedAt!: Date;
}