const { sequelize } = require('../config/db');
const User = require('./user');
const UserGroup = require('./userGroup');
const Permission = require('./permission');
const UserGroupPermission = require('./userGroupPermission');
const Store = require('./store');
const Food = require('./food');
const Category = require('./category');
const categoryFood = require('./categoryFood');
const Discount = require('./discount');
const Order = require('./order');
const OrderItem = require('./orderItem');
const OrderEvent = require('./orderEvent');
const UserDiscountUsage = require('./userDiscountUsage');

const CustomizationGroup = require('./customizationGroup');
const CustomizationOption = require('./customizationOption');
const Review = require('./review');
const FoodMetrics = require('./foodMetrics');

const CustomerProfile = require('./customerProfile')(sequelize);
const SystemProfile = require('./systemProfile')(sequelize);
const StoreProfile = require('./storeProfile')(sequelize);
const VerificationCode = require('./verificationCode')(sequelize);
const UserFollowStore = require('./userFollowStore')(sequelize);
const UserSavedProduct = require('./userSavedProduct')(sequelize);
const StoreSettings = require('./storeSettings')(sequelize);
const DeliveryAddress = require('./deliveryAddress')(sequelize);
const Ticket = require('./ticket')(sequelize);
const TicketMessage = require('./ticketMessage')(sequelize);

const adminPermissions = require('../store/adminPerm');
const supportAgentPermissions = require('../store/supportAgentPerm');
const merchantPermissions = require('../store/merchantPerm');
const courierPermissions = require('../store/courierPerm');
const customerPermissions = require('../store/customerPerm');
const guestPermissions = require('../store/guestPerm');
const salePermissions = require('../store/salePerm');
const storeFeatureItems = require('./storeFeaturedItems');



if (Category.setUpAssociation) {
    Category.setUpAssociation({ Food, Store, categoryFood });
}

if (categoryFood.setUpAssociation) {
    categoryFood.setUpAssociation({ Category, Food })
}

if (VerificationCode.associate) {
    VerificationCode.associate({ User });
}


if (StoreProfile.associate) {
    StoreProfile.associate({ User, Store });
}

if (User.setupAssociations) {
    User.setupAssociations({
        UserGroup,
        CustomerProfile,
        SystemProfile,
        StoreProfile,
        VerificationCode,
        UserFollowStore,
        UserSavedProduct,
        Store,
        Food,
        DeliveryAddress,
    });
}

if (FoodMetrics.setupAssociations) {
    FoodMetrics.setupAssociations({ Food });
}
    
if (UserGroup.setupAssociations) {
    UserGroup.setupAssociations({
        User,
        Permission,
        UserGroupPermission
    });
}

if (Permission.setupAssociations) {
    Permission.setupAssociations({
        UserGroup,
        UserGroupPermission
    });
}

if (UserGroupPermission.setupAssociations) {
    UserGroupPermission.setupAssociations({
        UserGroup,
        Permission
    });
}

if (Store.setupAssociations) {
    Store.setupAssociations({
        User,
        StoreProfile,
        StoreSettings,
        UserFollowStore,
        Discount
    });
}

if (Food.setupAssociations) {
    Food.setupAssociations({
        Store,
        User,
        UserSavedProduct,
        Category,
        categoryFood,
        CustomizationGroup,
        FoodMetrics
    });
}

if (UserSavedProduct.setUpAssociations) {
    UserSavedProduct.setUpAssociations({
        Food,
        User
    });
}

if (UserFollowStore.setUpAssociations) {
    UserFollowStore.setUpAssociations({
        User,
        Store
    });
}

if (CustomizationGroup.associate) {
    CustomizationGroup.associate({
        Food,
        CustomizationOption
    });
}

if (Discount.setupAssociations) {
    Discount.setupAssociations({
        Food,
        Store,
        User,
        Order,
        UserDiscountUsage
    });
}

if (Order.setupAssociations) {
    Order.setupAssociations({
        User,
        Store,
        OrderItem,
        OrderEvent,
        UserDiscountUsage
    });
}

if (OrderItem.setupAssociations) {
    OrderItem.setupAssociations({
        Order,
        Food
    });
}

if (OrderEvent.setupAssociations) {
    OrderEvent.setupAssociations({
        Order,
        User
    });
}

if (Ticket.associate) {
    Ticket.associate({
        User,
        TicketMessage
    });
}


if (TicketMessage.associate) {
    TicketMessage.associate({
        User,
        Ticket
    });
}

if (UserDiscountUsage.setupAssociations) {
    UserDiscountUsage.setupAssociations({
        User,
        Discount,
        Order
    });
}

if (Review.setupAssociations) {
    Review.setupAssociations({
        Food,
        User
    });
}

if (storeFeatureItems.setUpAssociation) {
    storeFeatureItems.setUpAssociation({
        Store,
        Category
    })
}

const initializeDefaultData = async () => {
    try {

        const defaultGroups = [
            { name: 'system_admin', type: 'system', description: 'System administrators with full access', is_default: false },
            { name: 'support_agent', type: 'system', description: 'Customer support staff', is_default: false },
            { name: 'manager', type: 'store', description: 'Store managers', is_default: false },
            { name: 'sale_agent', type: 'store', description: 'Sales representatives', is_default: false },
            { name: 'courier', type: 'store', description: 'Delivery personnel', is_default: false },
            { name: 'customer', type: 'customer', description: 'Regular customers', is_default: true }
        ];

        for (const group of defaultGroups) {
            const existingGroup = await UserGroup.findOne({ where: { name: group.name } });
            if (!existingGroup) {
                await UserGroup.create({
                    ...group,
                    created_at: new Date(),
                    updated_at: new Date()
                });
            }
        }


        const allPermissions = [
            ...adminPermissions,
            ...supportAgentPermissions,
            ...merchantPermissions,
            ...courierPermissions,
            ...customerPermissions,
            ...guestPermissions,
            ...salePermissions
        ];


        await Promise.all(allPermissions.map(async (perm) => {
            await Permission.upsert({
                ...perm,
                created_at: new Date(),
                updated_at: new Date()
            }, {
                conflictFields: ['url', 'http_method']
            });
        }));


        const groupPermissions = {
            'system_admin': adminPermissions,
            'support_agent': supportAgentPermissions,
            'manager': merchantPermissions,
            'sale_agent': salePermissions,
            'courier': courierPermissions,
            'customer': customerPermissions
        };


        for (const [groupName, permissions] of Object.entries(groupPermissions)) {
            const group = await UserGroup.findOne({ where: { name: groupName } });

            if (group) {

                if (groupName === 'system_admin') {
                    const allPerms = await Permission.findAll();
                    for (const perm of allPerms) {
                        await UserGroupPermission.findOrCreate({
                            where: {
                                group_id: group.id,
                                permission_id: perm.id
                            },
                            defaults: {
                                created_at: new Date()
                            }
                        });
                    }
                } else {

                    for (const permData of permissions) {
                        const perms = await Permission.findAll({
                            where: {
                                url: permData.url,
                                http_method: permData.http_method
                            }
                        });

                        for (const perm of perms) {
                            await UserGroupPermission.findOrCreate({
                                where: {
                                    group_id: group.id,
                                    permission_id: perm.id
                                },
                                defaults: {
                                    created_at: new Date()
                                }
                            });
                        }
                    }
                }
            }
        }


        
    } catch (error) {
        console.error('Error initializing default data:', error);
        throw error;
    }
};

module.exports = {
    sequelize,
    User,
    UserGroup,
    Permission,
    UserGroupPermission,
    CustomerProfile,
    SystemProfile,
    StoreProfile,
    VerificationCode,
    UserFollowStore,
    UserSavedProduct,
    StoreSettings,
    Store,
    Food,
    DeliveryAddress,
    Ticket,
    TicketMessage,
    initializeDefaultData,
    categoryFood,
    Category,
    Discount,
    Order,
    OrderItem,
    OrderEvent,
    UserDiscountUsage,
    Review,
    storeFeatureItems
};