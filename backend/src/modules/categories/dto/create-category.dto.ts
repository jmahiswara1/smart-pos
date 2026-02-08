import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Electronics' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Electronic devices and gadgets', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'Laptop', required: false })
    @IsString()
    @IsOptional()
    icon?: string;

    @ApiProperty({ example: '#3B82F6', required: false })
    @IsString()
    @IsOptional()
    color?: string;

    @ApiProperty({ example: true, required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
