//done
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const OrderItem = sequelize.define('OrderItem', {
    item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'order_id'
        }
    },
    food_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'foods',
            key: 'food_id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    base_price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    sale_price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    customization: {
        type: DataTypes.STRING,
        allowNull: true
    },
    snapshot_food_image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    snapshot_food_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'order_items',
    timestamps: false
});

const setupAssociations = (models) => {
    OrderItem.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order'
    });

    OrderItem.belongsTo(models.Food, {
        foreignKey: 'food_id',
        as: 'food'
    });
};

module.exports = OrderItem;
module.exports.setupAssociations = setupAssociations;
