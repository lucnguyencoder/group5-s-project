//done
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../src/config/db');

const storeFeatureItems = sequelize.define('storeFeatureItems', {
    store_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'stores',
            key: 'store_id'
        }
    },
    category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'category',
            key: 'id'
        }
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
    {
        tableName: 'store_feature_items',
        timestamps: true,
        id: false
    });

const setUpAssociation = (model) => {
    if (model.Store) {
        storeFeatureItems.belongsTo(model.Store,
            {
                foreignKey: 'store_id',
                as: 'store'
            }
        )
    }
    if (model.Category) {
        storeFeatureItems.belongsTo(model.Category,
            {
                foreignKey: 'category_id',
                as: 'category'
            })
    }
};

module.exports = storeFeatureItems;
module.exports.setUpAssociation = setUpAssociation;