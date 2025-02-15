import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDate, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { DimensionsDto } from './dimensions.dto';
import { ReceiverDto } from '@modules/users/domain/dtos/receiver.dto';
import { SenderDto } from '@modules/users/domain/dtos/sender.dto';
import { ShipmentStatus } from '../enums/status.enum';

export class BaseShipmentDto {
    @ValidateNested()
    @Type(() => ReceiverDto)
    receiver!: ReceiverDto;

    @ValidateNested()
    @Type(() => DimensionsDto)
    dimensions!: DimensionsDto;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsNotEmpty()
    declaredValue!: number;

    @IsNotEmpty()
    @IsEnum(ShipmentStatus)
    status!: ShipmentStatus;

    @IsDate()
    @IsNotEmpty()
    createdAt!: Date;

    @IsDate()
    @IsNotEmpty()
    updatedAt!: Date;
}

export class CreateShipmentDto extends BaseShipmentDto {
    @IsString()
    @IsNotEmpty()
    senderId!: string;
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