import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'admin@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'admin' })
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({ example: 'admin', enum: ['admin', 'manager', 'staff'], required: false })
    @IsString()
    @IsOptional()
    role?: string;
}
