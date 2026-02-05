//OOS
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Ticket extends Model {
        static associate(models) {
            // Ticket belongs to a requester (User)
            Ticket.belongsTo(models.User, {
                foreignKey: 'requester_id',
                as: 'requester'
            });

            // Ticket can be assigned to a User
            Ticket.belongsTo(models.User, {
                foreignKey: 'assigned_to',
                as: 'assignedTo'
            });

            // Ticket has many messages
            Ticket.hasMany(models.TicketMessage, {
                foreignKey: 'ticket_id',
                as: 'messages'
            });
        }
    }

    Ticket.init({
        ticket_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ticket_code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        requester_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        assigned_to: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
            defaultValue: 'open'
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        resolved_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Ticket',
        tableName: 'tickets',
        timestamps: false
    });

    return Ticket;
};
