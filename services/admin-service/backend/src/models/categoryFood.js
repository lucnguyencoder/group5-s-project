//done
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const categoryFood = sequelize.define('categoryFood', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'category',
            key: 'id'
        }
    },

    food_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'food',
            key: 'id'
        }
    },

    sort_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    is_recommend: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
},
    {
        tableName: 'category_food',
        timestamps: true
    });

const setUpAssociation = (models) => {
    if (models.Category) {
        categoryFood.belongsTo(models.Category, {
            foreignKey: 'category_id',
            as: 'category'
        });
    }

    if (models.Food) {
        categoryFood.belongsTo(models.Food, {
            foreignKey: 'food_id',
            as: 'food'
        });
    }
}

module.exports = categoryFood;
module.exports.setUpAssociation = setUpAssociation;

