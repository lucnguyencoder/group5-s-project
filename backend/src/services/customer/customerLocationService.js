const { DeliveryAddress, User } = require('../../models');
const { sequelize } = require('../../config/db');

const customerLocationService = {
    getAllLocations: async (userId) => {
        try {
            const locations = await DeliveryAddress.findAll({
                where: { user_id: userId },
                order: [['is_default', 'DESC'], ['created_at', 'DESC']]
            });

            return {
                success: true,
                status: 200,
                data: locations
            };
        } catch (error) {
            return {
                success: false,
                status: 500,
                message: 'Server error while fetching locations'
            };
        }
    },

    getLocationById: async (addressId, userId) => {
        try {
            const location = await DeliveryAddress.findOne({
                where: {
                    address_id: addressId,
                    user_id: userId
                }
            });

            if (!location) {
                return {
                    success: false,
                    status: 404,
                    message: 'Location not found'
                };
            }

            return {
                success: true,
                status: 200,
                data: location
            };
        } catch (error) {
            return {
                success: false,
                status: 500,
                message: 'Server error while fetching location'
            };
        }
    },

    createLocation: async (locationData, userId) => {
        const transaction = await sequelize.transaction();

        try {

            const addressCount = await DeliveryAddress.count({
                where: { user_id: userId }
            });

            if (addressCount === 0 || locationData.is_default) {

                if (addressCount > 0) {
                    await DeliveryAddress.update(
                        { is_default: false },
                        {
                            where: {
                                user_id: userId,
                                is_default: true
                            },
                            transaction
                        }
                    );
                }

                locationData.is_default = true;
            }

            const newLocation = await DeliveryAddress.create({
                ...locationData,
                user_id: userId,
                created_at: new Date(),
                updated_at: new Date()
            }, { transaction });

            await transaction.commit();

            return {
                success: true,
                status: 201,
                message: 'Location created successfully',
                data: newLocation
            };
        } catch (error) {
            console.error('Error creating location:', error);
            await transaction.rollback();
            return {
                success: false,
                status: 500,
                message: 'Server error while creating location'
            };
        }
    },

    updateLocation: async (addressId, locationData, userId) => {
        const transaction = await sequelize.transaction();

        try {
            const location = await DeliveryAddress.findOne({
                where: {
                    address_id: addressId,
                    user_id: userId
                }
            });

            if (!location) {
                await transaction.rollback();
                return {
                    success: false,
                    status: 404,
                    message: 'Location not found'
                };
            }


            if (locationData.is_default) {
                await DeliveryAddress.update(
                    { is_default: false },
                    {
                        where: {
                            user_id: userId,
                            is_default: true,
                            address_id: { [sequelize.Sequelize.Op.ne]: addressId }
                        },
                        transaction
                    }
                );
            }

            const updatedLocation = await location.update({
                ...locationData,
                updated_at: new Date()
            }, { transaction });

            await transaction.commit();

            return {
                success: true,
                status: 200,
                message: 'Location updated successfully',
                data: updatedLocation
            };
        } catch (error) {
            await transaction.rollback();
            return {
                success: false,
                status: 500,
                message: 'Server error while updating location'
            };
        }
    },

    deleteLocation: async (addressId, userId) => {
        const transaction = await sequelize.transaction();

        try {
            const location = await DeliveryAddress.findOne({
                where: {
                    address_id: addressId,
                    user_id: userId
                }
            });

            if (!location) {
                await transaction.rollback();
                return {
                    success: false,
                    status: 404,
                    message: 'Location not found'
                };
            }

            const wasDefault = location.is_default;

            await location.destroy({ transaction });


            if (wasDefault) {
                const nextAddress = await DeliveryAddress.findOne({
                    where: { user_id: userId },
                    order: [['created_at', 'DESC']],
                    transaction
                });

                if (nextAddress) {
                    await nextAddress.update(
                        { is_default: true },
                        { transaction }
                    );
                }
            }

            await transaction.commit();

            return {
                success: true,
                status: 200,
                message: 'Location deleted successfully'
            };
        } catch (error) {
            await transaction.rollback();
            return {
                success: false,
                status: 500,
                message: 'Server error while deleting location'
            };
        }
    },

    setDefaultLocation: async (addressId, userId) => {
        const transaction = await sequelize.transaction();

        try {
            const location = await DeliveryAddress.findOne({
                where: {
                    address_id: addressId,
                    user_id: userId
                }
            });

            if (!location) {
                await transaction.rollback();
                return {
                    success: false,
                    status: 404,
                    message: 'Location not found'
                };
            }


            await DeliveryAddress.update(
                { is_default: false },
                {
                    where: {
                        user_id: userId,
                        is_default: true
                    },
                    transaction
                }
            );


            await location.update(
                { is_default: true },
                { transaction }
            );

            await transaction.commit();

            return {
                success: true,
                status: 200,
                message: 'Default location set successfully',
                data: location
            };
        } catch (error) {
            await transaction.rollback();
            return {
                success: false,
                status: 500,
                message: 'Server error while setting default location'
            };
        }
    }
};

module.exports = customerLocationService;