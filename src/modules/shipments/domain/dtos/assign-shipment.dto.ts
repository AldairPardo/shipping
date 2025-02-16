import { IsString, IsNotEmpty } from 'class-validator';

export class AssignShipmentDto {
    @IsString()
    @IsNotEmpty()
    routeId!: string;
}