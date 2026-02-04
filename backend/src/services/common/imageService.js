const { uploadFile, deleteFile } = require('../../utils/fileUpload');
const { User, CustomerProfile, SystemProfile, StoreProfile, Store } = require('../../models');
const { consola } = require('consola');
const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

const imageService = {

    uploadMiddleware: upload.single('avatar'),

    uploadAvatar: async (userId, file) => {
        try {
            if (!file) {
                return {
                    success: false,
                    status: 400,
                    message: 'No file uploaded'
                };
            }

            const uploadResult = await uploadFile(file, 'avatars', 'users');

            if (!uploadResult.success) {
                return {
                    success: false,
                    status: 500,
                    message: 'Failed to upload file',
                    error: uploadResult.error
                };
            }

            const [updatedRows] = await User.update(
                { profile_picture: uploadResult.publicUrl },
                { where: { id: userId } }
            );

            if (updatedRows === 0) {
                return {
                    success: false,
                    status: 404,
                    message: 'User not found'
                };
            }

            return {
                success: true,
                status: 200,
                message: 'Avatar uploaded successfully',
                data: {
                    avatar_url: uploadResult.publicUrl,
                    file_path: uploadResult.filePath
                }
            };
        } catch (error) {
            consola.error('Avatar upload error:', error);
            return {
                success: false,
                status: 500,
                message: 'Internal server error',
                error: error.message
            };
        }
    },

    /**
     * Remove user avatar
     * @param {number} userId - User ID
     * @returns {Promise<Object>} - Remove result
     */
    removeAvatar: async (userId) => {
        try {
            const [updatedRows] = await User.update(
                { profile_picture: null },
                { where: { id: userId } }
            );

            if (updatedRows === 0) {
                return {
                    success: false,
                    status: 404,
                    message: 'User not found'
                };
            }

            return {
                success: true,
                status: 200,
                message: 'Avatar removed successfully'
            };
        } catch (error) {
            consola.error('Avatar removal error:', error);
            return {
                success: false,
                status: 500,
                message: 'Internal server error',
                error: error.message
            };
        }
    },

    /**
     * Get user avatar URL
     * @param {number} userId - User ID
     * @returns {Promise<Object>} - Avatar URL result
     */
    getAvatar: async (userId) => {
        try {
            const user = await User.findByPk(userId, {
                attributes: ['id', 'profile_picture']
            });

            if (!user) {
                return {
                    success: false,
                    status: 404,
                    message: 'User not found'
                };
            }

            return {
                success: true,
                status: 200,
                data: {
                    avatar_url: user.profile_picture
                }
            };
        } catch (error) {
            consola.error('Get avatar error:', error);
            return {
                success: false,
                status: 500,
                message: 'Internal server error',
                error: error.message
            };
        }
    },

    uploadStoreAvatar: async (storeId, file) => {
        try {
            console.log('files')
            if (!file) {
                return {
                    success: false,
                    status: 400,
                    message: 'No file uploaded'
                };
            }

            const uploadResult = await uploadFile(file, 'avatars', 'stores');

            if (!uploadResult.success) {
                return {
                    success: false,
                    status: 500,
                    message: 'Failed to upload file',
                    error: uploadResult.error
                };
            }

            const [updatedRows] = await Store.update(
                { avatar_url: uploadResult.publicUrl },
                { where: { store_id: storeId } }
            );

            if (updatedRows === 0) {
                return {
                    success: false,
                    status: 404,
                    message: 'Store not found'
                };
            }

            return {
                success: true,
                status: 200,
                message: 'Store avatar uploaded successfully',
                data: {
                    avatar_url: uploadResult.publicUrl,
                    file_path: uploadResult.filePath
                }
            };
        } catch (error) {
            consola.error('Store avatar upload error:', error);
            return {
                success: false,
                status: 500,
                message: 'Internal server error',
                error: error.message
            };
        }
    },

    uploadStoreCover: async (storeId, file) => {
        try {
            console.log(storeId);
            if (!file) {
                return {
                    success: false,
                    status: 400,
                    message: 'No file uploaded'
                };
            }

            const uploadResult = await uploadFile(file, 'avatars', 'stores');

            if (!uploadResult.success) {
                return {
                    success: false,
                    status: 500,
                    message: 'Failed to upload file',
                    error: uploadResult.error
                };
            }

            const [updatedRows] = await Store.update(
                { cover_image_url: uploadResult.publicUrl },
                { where: { store_id: storeId } }
            );

            if (updatedRows === 0) {
                return {
                    success: false,
                    status: 404,
                    message: 'Store not found'
                };
            }

            return {
                success: true,
                status: 200,
                message: 'Store cover uploaded successfully',
                data: {
                    cover_image_url: uploadResult.publicUrl,
                    file_path: uploadResult.filePath
                }
            };
        } catch (error) {
            consola.error('Store cover upload error:', error);
            return {
                success: false,
                status: 500,
                message: 'Internal server error',
                error: error.message
            };
        }
    }
};

module.exports = imageService;