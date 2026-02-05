//done
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Discount = sequelize.define('Discount', {
    discount_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    store_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'stores',
            key: 'store_id'
        }
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    discount_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    discount_type: {
        type: DataTypes.ENUM('percentage', 'fixed_amount'),
        allowNull: false
    },
    discount_sale_type: {
        type: DataTypes.ENUM('items', 'delivery'),
        allowNull: false
    },
    discount_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    max_discount_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    is_limit_usage_per_user: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    allow_usage_per_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    valid_from: {
        type: DataTypes.DATE,
        allowNull: true
    },
    valid_to: {
        type: DataTypes.DATE,
        allowNull: true
    },
    usage_limit: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    is_price_condition: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    min_price_condition: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    is_hidden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
    tableName: 'discounts',
    timestamps: false
});

const setupAssociations = (models) => {
    Discount.belongsTo(models.Store, {
        foreignKey: 'store_id',
        targetKey: 'id',
        as: 'store'
    });

    Discount.hasMany(models.UserDiscountUsage, {
        foreignKey: 'discount_id',
        as: 'usages'
    });

    Discount.belongsToMany(models.Order, {
        through: models.UserDiscountUsage,
        foreignKey: 'discount_id',
        otherKey: 'order_id',
        as: 'orders'
    });
};

module.exports = Discount;
module.exports.setupAssociations = setupAssociations;