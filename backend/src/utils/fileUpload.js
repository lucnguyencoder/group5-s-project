//done
const supabase = require('./supabase');
const { supabaseAdmin } = require('./supabase');
const { consola } = require('consola');
const path = require('path');
const crypto = require('crypto');

const uploadFile = async (file, bucket = 'images', folder = '') => {
    try {
        const client = supabaseAdmin || supabase;

        if (!supabaseAdmin) {
            consola.warn('[SP] Service role key not found.');
        }

        const fileExt = path.extname(file.originalname);
        const fileName = `${crypto.randomBytes(16).toString('hex')}${fileExt}`;
        const filePath = folder ? `${folder}/${fileName}` : fileName;

        const { data, error } = await client.storage
            .from(bucket)
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            consola.error('[SP] File upload error:', error);
            throw new Error(error.message);
        }


        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return {
            success: true,
            filePath,
            publicUrl: urlData.publicUrl
        };
    } catch (error) {
        consola.error('[SP] File upload error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};


const deleteFile = async (filePath, bucket = 'avatars') => {
    try {
        const client = supabaseAdmin || supabase;
        const { data, error } = await client.storage
            .from(bucket)
            .remove([filePath]);

        if (error) {
            consola.error('[SP] File delete error:', error);
            throw new Error(error.message);
        }
        return {
            success: true,
            message: 'File deleted successfully'
        };
    } catch (error) {
        consola.error('[SP] File delete error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    uploadFile,
    deleteFile
};
