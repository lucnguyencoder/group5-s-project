//done
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Permission = sequelize.define('Permission', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    http_method: {
        type: DataTypes.ENUM('GET', 'POST', 'PUT', 'DELETE', 'PATCH'),
        allowNull: false
    },
    description: {
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
    tableName: 'permissions',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['url', 'http_method'],
            name: 'permissions_url_method_unique'
        }
    ]
});


const setupAssociations = (models) => {
    Permission.belongsToMany(models.UserGroup, {
        through: models.UserGroupPermission,
        foreignKey: 'permission_id',
        otherKey: 'group_id',
        as: 'groups'
    });
};

module.exports = Permission;
module.exports.setupAssociations = setupAssociations;
