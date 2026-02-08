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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FilterCategoryDto } from './dto/filter-category.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('categories')
@Controller('categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new category' })
    @ApiResponse({ status: 201, description: 'Category created successfully' })
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all categories with filters' })
    @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
    findAll(@Query() filterDto: FilterCategoryDto) {
        return this.categoriesService.findAll(filterDto);
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get category statistics' })
    @ApiResponse({ status: 200, description: 'Stats retrieved successfully' })
    getStats() {
        return this.categoriesService.getStats();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get category by ID' })
    @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update category' })
    @ApiResponse({ status: 200, description: 'Category updated successfully' })
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete category (soft delete)' })
    @ApiResponse({ status: 200, description: 'Category deleted successfully' })
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(id);
    }
}
