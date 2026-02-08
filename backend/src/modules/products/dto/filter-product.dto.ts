import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FilterProductDto {
    @ApiProperty({ required: false, description: 'Search in name, SKU, barcode' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    minPrice?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    maxPrice?: number;

    @ApiProperty({ required: false, enum: ['low', 'normal', 'high', 'out'] })
    @IsOptional()
    @IsString()
    stockLevel?: 'low' | 'normal' | 'high' | 'out';

    @ApiProperty({ required: false })
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty({ required: false, enum: ['name', 'price', 'stock', 'createdAt'] })
    @IsOptional()
    @IsString()
    sortBy?: string;

    @ApiProperty({ required: false, enum: ['asc', 'desc'] })
    @IsOptional()
    @IsString()
    sortOrder?: 'asc' | 'desc';

    @ApiProperty({ required: false, default: 1 })
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    page?: number = 1;

    @ApiProperty({ required: false, default: 10 })
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    limit?: number = 10;
}
