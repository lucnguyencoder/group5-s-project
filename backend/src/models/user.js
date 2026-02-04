//done
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    profile_picture: {
        type: DataTypes.STRING,
        allowNull: true
    },
    group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user_groups',
            key: 'id'
        }
    },
    is_enabled_2fa: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'users',
    timestamps: false,
    hooks: {
        beforeCreate: async (user) => {
            if (user.password_hash) {
                const salt = await bcrypt.genSalt(10);
                user.password_hash = await bcrypt.hash(user.password_hash, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password_hash')) {
                const salt = await bcrypt.genSalt(10);
                user.password_hash = await bcrypt.hash(user.password_hash, salt);
            }
            user.updated_at = new Date();
        }
    }
});


User.prototype.comparePassword = async function (testpass) {
    return await bcrypt.compare(testpass, this.password_hash);
};


const setupAssociations = (models) => {

    User.belongsTo(models.UserGroup, {
        foreignKey: 'group_id',
        as: 'group'
    });


    if (models.CustomerProfile) {
        User.hasOne(models.CustomerProfile, {
            foreignKey: 'user_id',
            as: 'customerProfile'
        });
    }


    if (models.SystemProfile) {
        User.hasOne(models.SystemProfile, {
            foreignKey: 'user_id',
            as: 'systemProfile'
        });
    }


    if (models.StoreProfile) {
        User.hasOne(models.StoreProfile, {
            foreignKey: 'user_id',
            as: 'storeProfile'
        });
    }


    if (models.VerificationCode) {
        User.hasMany(models.VerificationCode, {
            foreignKey: 'user_id',
            as: 'verificationCodes'
        });
    }


    if (models.Store && models.UserFollowStore) {
        User.belongsToMany(models.Store, {
            through: models.UserFollowStore,
            foreignKey: 'user_id',
            otherKey: 'store_id',
            as: 'followedStores'
        });
    }
    if (models.Food && models.UserSavedProduct) {
        User.belongsToMany(models.Food, {
            through: models.UserSavedProduct,
            foreignKey: 'user_id',
            otherKey: 'food_id',
            as: 'savedProducts'
        });
    }

    if (models.DeliveryAddress) {
        User.hasMany(models.DeliveryAddress, {
            foreignKey: 'user_id',
            as: 'deliveryAddresses'
        });
    }

    if (models.Review) {
        User.hasMany(models.Review, {
            foreignKey: 'customer_id',
            as: 'reviews'
        });
    }
};

module.exports = User;
module.exports.setupAssociations = setupAssociations;
