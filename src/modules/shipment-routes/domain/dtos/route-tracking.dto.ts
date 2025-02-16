import { IsString, IsNotEmpty, IsDate, IsEmpty } from 'class-validator';

export class RouteTrackingDto {
    @IsEmpty()
    timestamp!: Date;

    @IsString()
    @IsNotEmpty()
    city!: string;

    @IsString()
    @IsNotEmpty()
    department!: string;
}