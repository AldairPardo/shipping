import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

class Coords {
    @IsString()
    @IsNotEmpty()
    lat!: string;

    @IsString()
    @IsNotEmpty()
    lng!: string;
}

export class LocationDto {
    @IsString()
    @IsNotEmpty()
    address!: string;

    @IsString()
    @IsNotEmpty()
    city!: string;

    @IsString()
    @IsNotEmpty()
    department!: string;

    @IsOptional()
    coords?: Coords;
}