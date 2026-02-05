//done
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const UserDiscountUsage = sequelize.define('UserDiscountUsage', {
    usage_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'   
        }
    },
    discount_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'discounts',
            key: 'discount_id'
        }
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'order_id'
        }
    },
    snapshot_discount_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    snapshot_discount_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    snapshot_discount_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    snapshot_discount_sale_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    snapshot_discount_value: {
        type: DataTypes.STRING,
        allowNull: false
    },
    snapshot_discount_amount: {
        type: DataTypes.STRING,
        allowNull: false
    },
    real_discount_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    used_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'user_discount_usages',
    timestamps: false
});

const setupAssociations = (models) => {
    UserDiscountUsage.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    UserDiscountUsage.belongsTo(models.Discount, {
        foreignKey: 'discount_id',
        as: 'discount'
    });

    UserDiscountUsage.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order'
    });
};

module.exports = UserDiscountUsage;
module.exports.setupAssociations = setupAssociations;
