//done
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const OrderEvent = sequelize.define('OrderEvent', {
    event_id: {
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
    event_type: {
        type: DataTypes.ENUM('new', 'courier_assigned', 'preparing', 'delivering', 'ready_to_pickup', 'completed', 'cancelled', 'payment_completed', 'courier_unassigned','refunded'),
        allowNull: false
    },
    triggered_by_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    snapshot_triggered_by_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    event_reason: {
        type: DataTypes.STRING,
        allowNull: true
    },
    event_notes: {
        type: DataTypes.STRING,
        allowNull: true
    },
    event_metadata: {
        type: DataTypes.JSON,
        allowNull: true
    },
    event_timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'order_events',
    timestamps: false
});

const setupAssociations = (models) => {
    OrderEvent.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order'
    });

    OrderEvent.belongsTo(models.User, {
        foreignKey: 'triggered_by_user_id',
        as: 'triggeredBy'
    });
};

module.exports = OrderEvent;
module.exports.setupAssociations = setupAssociations;
