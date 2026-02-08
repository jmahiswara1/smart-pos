import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new transaction (auto-decrement stock)' })
    create(
        @CurrentUser('id') userId: string,
        @Body() createTransactionDto: CreateTransactionDto,
    ) {
        return this.transactionsService.create(userId, createTransactionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all transactions with filters' })
    findAll(
        @Query('search') search?: string,
        @Query('paymentStatus') paymentStatus?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.transactionsService.findAll(
            search,
            paymentStatus,
            startDate,
            endDate,
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 10,
        );
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get transaction statistics' })
    getStats(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.transactionsService.getStats(startDate, endDate);
    }

    @Get('top-selling-today')
    @ApiOperation({ summary: 'Get top selling products for today' })
    getTopSellingToday(@Query('limit') limit?: string) {
        return this.transactionsService.getTopSellingToday(limit ? parseInt(limit) : 5);
    }

    @Get('daily-sales')
    @ApiOperation({ summary: 'Get daily sales for last N days' })
    getDailySales(@Query('days') days?: string) {
        return this.transactionsService.getDailySales(days ? parseInt(days) : 7);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get transaction detail by ID' })
    findOne(@Param('id') id: string) {
        return this.transactionsService.findOne(id);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Update transaction status (refund will restore stock)' })
    updateStatus(
        @Param('id') id: string,
        @Body('status') status: string,
    ) {
        return this.transactionsService.updateStatus(id, status);
    }
}
