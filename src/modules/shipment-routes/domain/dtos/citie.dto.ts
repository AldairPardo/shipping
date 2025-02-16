import { IsString, IsNotEmpty } from 'class-validator';

export class CitieDto {
    @IsString()
    @IsNotEmpty()
    city!: string;

    @IsString()
    @IsNotEmpty()
    department!: string;
}