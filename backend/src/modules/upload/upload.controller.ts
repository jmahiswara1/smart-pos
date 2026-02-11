import {
    Controller,
    Post,
    Delete,
    UseInterceptors,
    UploadedFile,
    Body,
    UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post('image')
    @ApiOperation({ summary: 'Upload product image' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        console.log('UploadController: Received file', file ? file.originalname : 'No file');
        return this.uploadService.uploadImage(file);
    }

    @Delete('image')
    @ApiOperation({ summary: 'Delete product image' })
    async deleteImage(@Body('fileName') fileName: string) {
        return this.uploadService.deleteImage(fileName);
    }
}
