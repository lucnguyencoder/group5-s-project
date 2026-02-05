//done
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class UserFollowStore extends Model {
        static associate(models) {
        }
    }

    UserFollowStore.init({
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        store_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'stores',
                key: 'id'
            }
        },
        followed_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'UserFollowStore',
        tableName: 'user_follow_stores',
        timestamps: false
    });
    const setUpAssociations = (models) => {
        UserFollowStore.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        UserFollowStore.belongsTo(models.Store, { foreignKey: 'store_id', as: 'store' });
    };

    UserFollowStore.setUpAssociations = setUpAssociations;

    return UserFollowStore;
};
