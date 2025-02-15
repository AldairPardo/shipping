import { IsString, IsEmail, IsNotEmpty, IsPhoneNumber, IsEnum, IsOptional } from 'class-validator';
import { Role } from '@modules/auth/domain/enums/role.enum';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstname!: string;

    @IsString()
    @IsNotEmpty()
    lastname!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsPhoneNumber()
    @IsNotEmpty()
    phone!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;

    @IsNotEmpty()
    @IsEnum(Role)
    role!: Role;

    @IsString()
    @IsOptional()
    docType?: string;

    @IsString()
    @IsOptional()
    docNumber?: string;
}

export class UserDto extends CreateUserDto {
    @IsString()
    @IsNotEmpty()
    id!: string;
}