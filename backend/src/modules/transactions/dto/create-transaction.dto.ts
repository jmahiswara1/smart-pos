import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, ValidateNested, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';

class TransactionItemDto {
    @ApiProperty({ example: 'product-uuid-here' })
    @IsString()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ example: 2 })
    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CreateTransactionDto {
    @ApiProperty({ example: 'customer-uuid-here', required: false })
    @IsString()
    @IsOptional()
    customerId?: string;

    @ApiProperty({ type: [TransactionItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TransactionItemDto)
    items: TransactionItemDto[];

    @ApiProperty({ example: 0, required: false })
    @IsNumber()
    @IsOptional()
    @Min(0)
    tax?: number;

    @ApiProperty({ example: 0, required: false })
    @IsNumber()
    @IsOptional()
    @Min(0)
    discount?: number;

    @ApiProperty({ example: 'cash', enum: ['cash', 'debit_card', 'credit_card', 'digital_wallet', 'bank_transfer'] })
    @IsEnum(['cash', 'debit_card', 'credit_card', 'digital_wallet', 'bank_transfer'])
    paymentMethod: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    notes?: string;
}
