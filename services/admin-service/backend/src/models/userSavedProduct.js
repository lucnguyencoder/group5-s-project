//done
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class UserSavedProduct extends Model {
        static associate(models) {

        }
    }

    UserSavedProduct.init({
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        food_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'foods',
                key: 'id'
            }
        },
        saved_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'UserSavedProduct',
        tableName: 'user_saved_products',
        timestamps: false
    });

    const setUpAssociations = (models) => {
        UserSavedProduct.belongsTo(models.Food, { foreignKey: 'food_id', as: 'food' });
        UserSavedProduct.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    };
    UserSavedProduct.setUpAssociations = setUpAssociations;
    return UserSavedProduct;
};
