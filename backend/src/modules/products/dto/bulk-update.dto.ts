import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsNumber } from 'class-validator';

export class BulkUpdateDto {
    @ApiProperty({ example: ['id1', 'id2', 'id3'] })
    @IsArray()
    ids: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    price?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    stock?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    isActive?: boolean;
}
