import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class UpdateRouteTrackingDto {
    @IsString()
    @IsNotEmpty()
    city!: string;

    @IsString()
    @IsNotEmpty()
    department!: string;
}

export class RouteTrackingDto extends UpdateRouteTrackingDto {
    @IsString()
    @IsNotEmpty()
    routeId!: string;

    @IsDate()
    @IsNotEmpty()
    timestamp!: Date;
}