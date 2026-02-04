//OOS
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class TicketMessage extends Model {
        static associate(models) {
            // Message belongs to a ticket
            TicketMessage.belongsTo(models.Ticket, {
                foreignKey: 'ticket_id',
                as: 'ticket'
            });

            TicketMessage.belongsTo(models.User, {
                foreignKey: 'sender_id',
                as: 'sender'
            });
        }
    }

    TicketMessage.init({
        message_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ticket_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tickets',
                key: 'ticket_id'
            }
        },
        sender_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        sender_type: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'customer'
        },
        message_content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'TicketMessage',
        tableName: 'ticket_messages',
        timestamps: false
    });

    return TicketMessage;
};
