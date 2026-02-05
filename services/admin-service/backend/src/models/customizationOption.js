//done
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../src/config/db');

const CustomizationOption = sequelize.define('CustomizationOption', {
    option_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'customization_groups',
            key: 'group_id'
        }
    },
    option_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    additional_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    sort_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'customization_options',
    timestamps: false
});

const setupAssociations = (models) => {
    if (models.CustomizationGroup) {
        CustomizationOption.belongsTo(models.CustomizationGroup, {
            foreignKey: 'group_id',
            as: 'group'
        });
    }
};

CustomizationOption.setupAssociations = setupAssociations;

module.exports = CustomizationOption;
