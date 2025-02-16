import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDate, ValidateNested, IsEnum, IsEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { DimensionsDto } from './dimensions.dto';
import { ReceiverDto } from '@modules/shipments/domain/dtos/receiver.dto';
import { SenderDto } from '@modules/shipments/domain/dtos/sender.dto';
import { ShipmentStatus } from '../enums/status.enum';
import { LocationDto } from './location.dto';
import { RouteDto } from '@modules/shipment-routes/domain/dtos/route.dto';
import { ShipmentTrackingDto } from './shipment-tracking.dto';

export class ShipmentDto {
    @IsEmpty()
    id!: string;

    @IsEmpty()
    senderId?: string;

    @IsEmpty()
    sender!: SenderDto;

    @IsEmpty()
    trackingCode!: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => ReceiverDto)
    receiver!: ReceiverDto;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => DimensionsDto)
    dimensions!: DimensionsDto;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => LocationDto)
    origin!: LocationDto;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => LocationDto)
    destination!: LocationDto;

    @IsOptional()
    route?: RouteDto;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsNotEmpty()
    declaredValue!: number;

    @IsNotEmpty()
    @IsEnum(ShipmentStatus)
    status: ShipmentStatus = ShipmentStatus.PENDING;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ShipmentTrackingDto)
    tracking?: ShipmentTrackingDto[];

    @IsDate()
    @IsOptional()
    createdAt?: Date;

    @IsDate()
    @IsOptional()
    updatedAt?: Date;
}