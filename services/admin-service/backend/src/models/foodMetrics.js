//done
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FoodMetrics = sequelize.define('FoodMetrics', {
    food_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    number_of_ratings: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    number_of_orders: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    number_of_people_ordered: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    number_of_favorites: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    average_rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0.00,
    },
}, {
    tableName: 'food_metrics',
    timestamps: true,
});

const setupAssociations = (models) => {
    if (models.Food) {
        FoodMetrics.belongsTo(models.Food, {
            foreignKey: 'food_id',
            as: 'food'
        });
    }
};

FoodMetrics.setupAssociations = setupAssociations;

module.exports = FoodMetrics;