//done
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../src/config/db');

const Food = sequelize.define('Food', {
    food_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    store_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'stores',
            key: 'store_id'
        }
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    food_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    base_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    is_on_sale: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    sale_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    preparation_time: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'minutes'
    },
    max_allowed_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
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
    tableName: 'foods',
    timestamps: false
});

const setupAssociations = (models) => {
    if (models.Store) {
        Food.belongsTo(models.Store, {
            foreignKey: 'store_id',
            as: 'store'
        });
    }

    if (models.Category) {
        Food.belongsToMany(models.Category, {
            through: models.categoryFood,
            foreignKey: 'food_id',
            otherKey: 'category_id',
            as: 'category'
        });
    }

    if (models.CustomizationGroup) {
        Food.hasMany(models.CustomizationGroup, {
            foreignKey: 'food_id',
            as: 'foodGroups'
        });
    }

    if (models.User && models.UserSavedProduct) {
        Food.belongsToMany(models.User, {
            through: models.UserSavedProduct,
            foreignKey: 'food_id',
            otherKey: 'user_id',
            as: 'savedByUsers'
        });
    }

    if (models.Review) {
        Food.hasMany(models.Review, {
            foreignKey: 'food_id',
            as: 'reviews'
        });
    }

    if (models.FoodMetrics) {
        Food.hasOne(models.FoodMetrics, {
            foreignKey: 'food_id',
            as: 'metrics'
        });
    }

};

Food.setupAssociations = setupAssociations;
module.exports = Food;

