//done
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const UserGroupPermission = sequelize.define('UserGroupPermission', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user_groups',
            key: 'id'
        }
    },
    permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'permissions',
            key: 'id'
        }
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'user_group_permissions',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['group_id', 'permission_id']
        }
    ]
});

const setupAssociations = (models) => {
    UserGroupPermission.belongsTo(models.UserGroup, {
        foreignKey: 'group_id',
        as: 'group'
    });

    UserGroupPermission.belongsTo(models.Permission, {
        foreignKey: 'permission_id',
        as: 'permission'
    });
};

UserGroupPermission.setupAssociations = setupAssociations;
module.exports = UserGroupPermission;
