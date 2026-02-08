import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateCustomerDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'john@example.com', required: false })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ example: '+62812345678', required: false })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({ example: 'Jl. Sudirman No. 123, Jakarta', required: false })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    isActive?: boolean;
}
