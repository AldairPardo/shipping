import { IsNotEmpty, IsNumber } from 'class-validator';

export class DimensionsDto {
    @IsNumber()
    @IsNotEmpty()
    length!: number;

    @IsNumber()
    @IsNotEmpty()
    width!: number;

    @IsNumber()
    @IsNotEmpty()
    height!: number;

    @IsNumber()
    @IsNotEmpty()
    weight!: number;
}