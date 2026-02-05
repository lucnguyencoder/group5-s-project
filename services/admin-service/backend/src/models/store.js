//done
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Store = sequelize.define('Store', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'store_id'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'store_name'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    avatar_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cover_image_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    opening_time: {
        type: DataTypes.TIME,
        allowNull: true
    },
    closing_time: {
        type: DataTypes.TIME,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'banned'),
        defaultValue: 'active'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active'
    },
    isTempClosed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_temp_closed'
    },
    rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0
    },
    total_reviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0
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
    tableName: 'stores',
    timestamps: false
});


const setupAssociations = (models) => {

    if (models.StoreProfile) {
        Store.hasMany(models.StoreProfile, {
            foreignKey: 'store_id',
            as: 'profiles'
        });
    }


    if (models.StoreSettings) {
        Store.hasOne(models.StoreSettings, {
            foreignKey: 'store_id',
            as: 'settings'
        });
    }


    if (models.User && models.UserFollowStore) {
        Store.belongsToMany(models.User, {
            through: models.UserFollowStore,
            foreignKey: 'store_id',
            otherKey: 'user_id',
            as: 'followers'
        });
    }

    if (models.Discount) {
        Store.hasMany(models.Discount, {
            foreignKey: 'store_id',
            as: 'discounts'
        });
    }

    if (models.storeFeatureItems) {
        Store.hasMany(models.storeFeatureItems, {
            foreignKey: 'store_id',
            as: 'featuredItems'
        });
    }

};

module.exports = Store;
module.exports.setupAssociations = setupAssociations;
