import { IsString, IsNotEmpty } from 'class-validator';

export class DimensionsDto {
    @IsString()
    @IsNotEmpty()
    length!: string;

    @IsString()
    @IsNotEmpty()
    width!: string;

    @IsString()
    @IsNotEmpty()
    height!: string;

    @IsString()
    @IsNotEmpty()
    weight!: string;
}