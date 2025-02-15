import { IsString, IsEmail, IsNotEmpty, IsPhoneNumber, IsOptional } from 'class-validator';

export class ReceiverDto {
    @IsString()
    @IsNotEmpty()
    firstname!: string;

    @IsString()
    @IsNotEmpty()
    lastname!: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsPhoneNumber()
    @IsNotEmpty()
    phone!: string;
}