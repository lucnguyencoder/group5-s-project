//done
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class StoreProfile extends Model {
        static associate(models) {

            StoreProfile.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });

            StoreProfile.belongsTo(models.Store, {
                foreignKey: 'store_id',
                as: 'store'
            });
        }
    }

    StoreProfile.init({
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
            allowNull: false,
            references: {
                model: 'stores',
                key: 'store_id'
            }
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        vehicle_plate: {
            type: DataTypes.STRING,
            allowNull: true
        },
        vehicle_type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        is_courier_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'StoreProfile',
        tableName: 'store_profiles',
        timestamps: false
    });

    return StoreProfile;
};

