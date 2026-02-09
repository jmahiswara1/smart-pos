import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { BulkUpdateDto } from './dto/bulk-update.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, description: 'Product created successfully' })
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all products with advanced filters' })
    @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
    findAll(@Query() filterDto: FilterProductDto) {
        return this.productsService.findAll(filterDto);
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get product statistics' })
    @ApiResponse({ status: 200, description: 'Stats retrieved successfully' })
    getStats() {
        return this.productsService.getStats();
    }

    @Get('low-stock')
    @ApiOperation({ summary: 'Get products with low stock' })
    @ApiResponse({ status: 200, description: 'Low stock products retrieved' })
    getLowStock() {
        return this.productsService.getLowStock();
    }

    @Get('by-category')
    @ApiOperation({ summary: 'Get products grouped by category' })
    @ApiResponse({ status: 200, description: 'Products by category retrieved' })
    getProductsByCategory() {
        return this.productsService.getProductsByCategory();
    }

    @Post('bulk-update')
    @ApiOperation({ summary: 'Bulk update products' })
    @ApiResponse({ status: 200, description: 'Products updated successfully' })
    bulkUpdate(@Body() bulkUpdateDto: BulkUpdateDto) {
        return this.productsService.bulkUpdate(bulkUpdateDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID' })
    @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update product' })
    @ApiResponse({ status: 200, description: 'Product updated successfully' })
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete product permanently' })
    @ApiResponse({ status: 200, description: 'Product deleted successfully' })
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
