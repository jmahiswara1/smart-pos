import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
    private readonly uploadDir = 'uploads';

    constructor(private configService: ConfigService) {
        // Ensure upload directory exists
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    async uploadImage(file: Express.Multer.File) {
        console.log('UploadService: uploadImage called', { fileName: file?.originalname });

        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        const fileName = `${Date.now()}-${file.originalname.replace(/\\s+/g, '-')}`;
        const filePath = path.join(this.uploadDir, fileName);

        try {
            fs.writeFileSync(filePath, file.buffer);

            // Construct public URL
            // Assuming the uploads are served statically from /uploads
            const baseUrl = this.configService.get<string>('API_URL') || 'http://localhost:3000';
            const publicUrl = `${baseUrl}/uploads/${fileName}`;

            return {
                url: publicUrl,
                fileName: fileName,
            };
        } catch (error) {
            console.error('Local Upload Error:', error);
            throw new Error(`Failed to upload image locally: ${error.message}`);
        }
    }

    async deleteImage(fileName: string) {
        // For local storage, if fileName contains the full URL, extract the filename
        const actualFileName = path.basename(fileName);
        const filePath = path.join(this.uploadDir, actualFileName);

        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            return { success: true };
        } catch (error) {
            console.error('Local Delete Error:', error);
            // Don't throw error if file doesn't exist or can't be deleted, just log it
            return { success: false, error: error.message };
        }
    }
}
