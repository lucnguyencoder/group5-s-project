//done
const {
    Store,
    User,
    UserGroup,
    StoreProfile,
    sequelize
} = require('../../models');
const { Op } = require('sequelize');

class StoreManagementService {
    async getAllStores(filters = {}, itemPerPage = 20, page = 1) {
        const w = {};

        if (filters.name) {
            w.name = { [Op.like]: `%${filters.name}%` };
        }

        if (filters.address) {
            w.address = { [Op.like]: `%${filters.address}%` };
        }

        if (filters.status) {
            w.status = filters.status;
        }

        if (filters.isActive !== undefined) {
            w.isActive = filters.isActive;
        }

        if (filters.isTempClosed !== undefined) {
            w.isTempClosed = filters.isTempClosed;
        }

        const offset = (page - 1) * itemPerPage;

        const totalCount = await Store.count({
            where: w
        });

        const totalPages = Math.ceil(totalCount / itemPerPage);

        const stores = await Store.findAll({
            where: w,
            limit: itemPerPage,
            offset: offset,
            order: [['created_at', 'DESC']]
        });

        return {
            stores,
            currentPage: page,
            itemPerPage,
            totalPages,
            totalCount
        };
    }

    async getStoreById(id) {
        const store = await Store.findByPk(id,
            {
                raw: true,
            }
        );

        if (!store) {
            return null;
        }

        const storeProfiles = await StoreProfile.findAll({
            where: { store_id: id },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'email', 'is_active', 'created_at', 'updated_at'],
                    include: [{
                        model: UserGroup,
                        as: 'group',
                        attributes: ['id', 'name', 'type']
                    }],
                }
            ],
            raw: true
        });

        // console.log('Store Profiles:', storeProfiles);

        store.members = storeProfiles.map(profile => {
            return {
                id: profile['user.id'],
                email: profile['user.email'],
                role: profile['user.group.name'],
                full_name: profile['full_name'],
                phone: profile['phone'],
                is_active: profile['user.is_active'],
                is_available: profile['is_available'],
                is_courier_active: profile['is_courier_active'],
                vehicle_info: profile['vehicle_type'] ? {
                    vehicle_type: profile['vehicle_type'],
                    vehicle_plate: profile['vehicle_plate']
                } : null,
                created_at: profile['created_at']
            };
        });

        return store;
    }

    async createStore(storeData, members = []) {
        const transaction = await sequelize.transaction();

        try {
            const newStore = await Store.create({
                name: storeData.name,
                description: storeData.description,
                avatar_url: storeData.avatar_url,
                cover_image_url: storeData.cover_image_url,
                address: storeData.address,
                latitude: storeData.latitude,
                longitude: storeData.longitude,
                phone: storeData.phone,
                email: storeData.email,
                opening_time: storeData.opening_time,
                closing_time: storeData.closing_time,
                isActive: storeData.isActive !== undefined ? storeData.isActive : true,
                isTempClosed: storeData.isTempClosed !== undefined ? storeData.isTempClosed : false,
                created_at: new Date(),
                updated_at: new Date()
            }, { transaction });


            if (members && members.length > 0) {

                const userGroups = await UserGroup.findAll({
                    where: {
                        name: { [Op.in]: ['manager', 'sale_agent', 'courier'] },
                        type: 'store'
                    }
                });

                const groupMap = {};
                userGroups.forEach(group => {
                    groupMap[group.name] = group.id;
                });


                for (const member of members) {

                    if (!['manager', 'sale_agent', 'courier'].includes(member.role)) {
                        throw new Error(`Invalid role: ${member.role}.`);
                    }

                    const existingUser = await User.findOne({
                        where: { email: member.email },
                        transaction
                    });

                    if (existingUser) {
                        throw new Error(`User with email ${member.email} already exists`);
                    }

                    const nuser = await User.create({
                        email: member.email,
                        password_hash: member.password,
                        group_id: groupMap[member.role],
                        is_active: true,
                        created_at: new Date(),
                        updated_at: new Date()
                    }, { transaction });


                    await StoreProfile.create({
                        user_id: nuser.id,
                        store_id: newStore.id,
                        username: member.username || member.email.split('@')[0],
                        email: member.email,
                        full_name: member.full_name || 'Store Member',
                        phone: member.phone,
                        vehicle_type: member.vehicle_type,
                        vehicle_plate: member.vehicle_plate,
                        is_available: true,
                        is_courier_active: member.role === 'courier',
                        created_at: new Date(),
                        updated_at: new Date()
                    }, { transaction });
                }
            }

            await transaction.commit();
            return newStore;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async updateStore(id, updateData) {
        const transaction = await sequelize.transaction();

        try {
            const store = await Store.findByPk(id, { transaction });

            if (!store) {
                throw new Error('Store not found');
            }

            await store.update({
                ...updateData,
                updated_at: new Date()
            }, { transaction });

            await transaction.commit();
            return store;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async toggleStoreStatus(id) {
        const transaction = await sequelize.transaction();

        try {
            const store = await Store.findByPk(id, { transaction });

            if (!store) {
                throw new Error('Store not found');
            }


            store.isActive = !store.isActive;
            store.updated_at = new Date();
            await store.save({ transaction });

            await transaction.commit();
            return {
                id: store.id,
                isActive: store.isActive
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async toggleStoreTempClosed(id) {
        const transaction = await sequelize.transaction();

        try {
            const store = await Store.findByPk(id, { transaction });

            if (!store) {
                throw new Error('Store not found');
            }

            store.isTempClosed = !store.isTempClosed;
            store.updated_at = new Date();

            await store.save({ transaction });
            await transaction.commit();

            return {
                id: store.id,
                isTempClosed: store.isTempClosed
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = new StoreManagementService();
