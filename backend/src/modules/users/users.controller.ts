import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Roles('admin')
    @ApiOperation({ summary: 'Get all users (admin only)' })
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @Roles('admin')
    @ApiOperation({ summary: 'Get user by ID (admin only)' })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Delete(':id')
    @Roles('admin')
    @ApiOperation({ summary: 'Delete user (admin only)' })
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
