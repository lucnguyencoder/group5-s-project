//done
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../src/config/db');

const Category = sequelize.define('Category', {
    id: {
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
    category_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }
}, {
    tableName: 'category',
    timestamps: true
});

const setUpAssociation = (models) => {
    if (models.Store) {
        Category.belongsTo(models.Store, {
            foreignKey: 'store_id',
            as: 'store'
        });
    }

    if (models.Food) {
        Category.belongsToMany(models.Food, {
            through: models.categoryFood,
            foreignKey: 'category_id',
            otherKey: 'food_id',
            as: 'foods'
        });
    }

    if (models.storeFeatureItems) {
        Category.hasMany(models.storeFeatureItems, {
            foreignKey: 'category_id',
            as: 'featuredItems'
        });
    }
}

module.exports = Category;
module.exports.setUpAssociation = setUpAssociation;