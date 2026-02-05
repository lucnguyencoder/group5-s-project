//done
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    store_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'stores',
            key: 'store_id'
        }
    },
    order_type: {
        type: DataTypes.ENUM('pickup', 'delivery'),
        allowNull: false
    },
    payment_option: {
        type: DataTypes.ENUM('cash', 'qr'),
        allowNull: false
    },
    base_price_subtotal: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    sale_price_subtotal: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    promote_discount_price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true
    },
    delivery_fee: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true
    },
    final_price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    snapshot_delivery_address_line: {
        type: DataTypes.STRING,
        allowNull: true
    },
    snapshot_recipient_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    snapshot_recipient_phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    snapshot_recipient_latitude: {
        type: DataTypes.STRING,
        allowNull: true
    },
    snapshot_recipient_longitude: {
        type: DataTypes.STRING,
        allowNull: true
    },
    customer_special_instruction: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_paid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    payment_completed_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    assigned_courier_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    snapshot_assigned_courier_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    snapshot_assigned_courier_phone: {
        type: DataTypes.STRING,
        allowNull: true
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
    tableName: 'orders',
    timestamps: false
});

const setupAssociations = (models) => {
    Order.belongsTo(models.User, {
        foreignKey: 'customer_id',
        as: 'customer'
    });

    Order.belongsTo(models.Store, {
        foreignKey: 'store_id',
        as: 'store'
    });

    Order.belongsTo(models.User, {
        foreignKey: 'assigned_courier_id',
        as: 'courier'
    });

    Order.hasMany(models.OrderItem, {
        foreignKey: 'order_id',
        as: 'orderItems'
    });

    Order.hasMany(models.OrderEvent, {
        foreignKey: 'order_id',
        as: 'orderEvents'
    });


    Order.hasOne(models.UserDiscountUsage, {
        foreignKey: 'order_id',
        as: 'discountUsage'
    });
};

module.exports = Order;
module.exports.setupAssociations = setupAssociations;
