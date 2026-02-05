//done
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const UserGroup = sequelize.define('UserGroup', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    type: {
        type: DataTypes.ENUM('system', 'store', 'customer'),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_default: {
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
    tableName: 'user_groups',
    timestamps: false
});


const setupAssociations = (models) => {

    UserGroup.hasMany(models.User, {
        foreignKey: 'group_id',
        as: 'users'
    });


    UserGroup.belongsToMany(models.Permission, {
        through: models.UserGroupPermission,
        foreignKey: 'group_id',
        otherKey: 'permission_id',
        as: 'permissions'
    });
};

module.exports = UserGroup;
module.exports.setupAssociations = setupAssociations;
