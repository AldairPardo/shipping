import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDate, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { DimensionsDto } from './dimensions.dto';
import { ReceiverDto } from '@modules/shipments/domain/dtos/receiver.dto';
import { SenderDto } from '@modules/shipments/domain/dtos/sender.dto';
import { ShipmentStatus } from '../enums/status.enum';
import { LocationDto } from './location.dto';

export class BaseShipmentDto {
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

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsNotEmpty()
    declaredValue!: number;

    @IsNotEmpty()
    @IsEnum(ShipmentStatus)
    status: ShipmentStatus = ShipmentStatus.PENDING;

    @IsDate()
    @IsOptional()
    createdAt?: Date;

    @IsDate()
    @IsOptional()
    updatedAt?: Date;
}

export class CreateShipmentDto extends BaseShipmentDto {
    @IsString()
    @IsOptional()
    senderId?: string;
}

export class ShipmentDto extends BaseShipmentDto {
    @IsString()
    @IsNotEmpty()
    id!: string;

    @ValidateNested()
    @Type(() => SenderDto)
    sender!: SenderDto;

    @IsString()
    @IsNotEmpty()
    trackingCode!: string;
}