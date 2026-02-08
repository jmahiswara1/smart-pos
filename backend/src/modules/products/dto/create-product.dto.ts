import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsNumber,
    IsInt,
    IsBoolean,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @ApiProperty({ example: 'Samsung Galaxy S24' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'category-uuid-here' })
    @IsString()
    @IsNotEmpty()
    categoryId: string;

    @ApiProperty({ example: 'Latest flagship smartphone', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'SKU-12345' })
    @IsString()
    @IsNotEmpty()
    sku: string;

    @ApiProperty({ example: 1299.99 })
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ example: 899.99, required: false })
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @Min(0)
    cost?: number;

    @ApiProperty({ example: 50 })
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    @Min(0)
    stock?: number;

    @ApiProperty({ example: 5 })
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    @Min(0)
    minStock?: number;

    @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
    @IsString()
    @IsOptional()
    imageUrl?: string;

    @ApiProperty({ example: '1234567890123', required: false })
    @IsString()
    @IsOptional()
    barcode?: string;

    @ApiProperty({ example: true, required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
