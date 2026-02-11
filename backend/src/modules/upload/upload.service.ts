import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UploadService {
    private supabase: SupabaseClient;

    constructor() {
        const supabaseUrl = process.env.SUPABASE_URL;
        // Prioritize service role key for backend operations to bypass RLS
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

        if (supabaseUrl && supabaseKey) {
            this.supabase = createClient(supabaseUrl, supabaseKey, {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                },
            });
        }
    }

    async uploadImage(file: Express.Multer.File) {
        if (!this.supabase) {
            throw new Error('Supabase not configured');
        }

        const bucketName = process.env.SUPABASE_BUCKET || 'product-images';
        const fileName = `${Date.now()}-${file.originalname}`;

        const { data, error } = await this.supabase.storage
            .from(bucketName)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (error) {
            throw new Error(`Failed to upload image: ${error.message}`);
        }

        const {
            data: { publicUrl },
        } = this.supabase.storage.from(bucketName).getPublicUrl(fileName);

        return {
            url: publicUrl,
            fileName: data.path,
        };
    }

    async deleteImage(fileName: string) {
        if (!this.supabase) {
            throw new Error('Supabase not configured');
        }

        const bucketName = process.env.SUPABASE_BUCKET || 'product-images';

        const { error } = await this.supabase.storage.from(bucketName).remove([fileName]);

        if (error) {
            throw new Error(`Failed to delete image: ${error.message}`);
        }

        return { success: true };
    }
}
