//done
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../src/config/db');

const CustomizationGroup = sequelize.define('CustomizationGroup', {
    group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    food_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'foods',
            key: 'food_id'
        }
    },
    group_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_required: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    min_selections: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    max_selections: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'null means unlimited'
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
    tableName: 'customization_groups',
    timestamps: false
});

const setupAssociations = (models) => {
    if (models.Food) {
        CustomizationGroup.belongsTo(models.Food, {
            foreignKey: 'food_id',
            as: 'food'
        });
    }

    if (models.CustomizationOption) {
        CustomizationGroup.hasMany(models.CustomizationOption, {
            foreignKey: 'group_id',
            as: 'groupOptions'
        });
    }
};

CustomizationGroup.setupAssociations = setupAssociations;

module.exports = CustomizationGroup;
