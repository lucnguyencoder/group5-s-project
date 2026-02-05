//done
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Review = sequelize.define('Review', {
    review_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    food_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'foods',
            key: 'food_id'
        }
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
        type: DataTypes.TEXT,
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
    tableName: 'reviews',
    timestamps: false,
    hooks: {
        beforeUpdate: (review) => {
            review.updated_at = new Date();
        }
    }
});

const setupAssociations = (models) => {
    if (models.Food) {
        Review.belongsTo(models.Food, {
            foreignKey: 'food_id',
            as: 'food'
        });
    }

    if (models.User) {
        Review.belongsTo(models.User, {
            foreignKey: 'customer_id',
            as: 'customer'
        });
    }
};

Review.setupAssociations = setupAssociations;

module.exports = Review;