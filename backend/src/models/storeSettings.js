//done
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class StoreSettings extends Model {
        static associate(models) {
            StoreSettings.belongsTo(models.Store, {
                foreignKey: 'store_id',
                as: 'store'
            });
        }
    }

    StoreSettings.init({
        store_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'stores',
                key: 'store_id' 
            }
        },
        // SHIPPING: 
        /**
         *  for example: <3 km -> 10k, 3km = 10k, 4km = 10k + 5k, 5km = 10k + 10k
         *  => attribute: 'shipping_per_km_fee', 'minimum_shipping_fee', 'shipping_distance_limit',  'shipping_distance_to_calculate_fee'
         * // default value: 10k/km, minimum 20k, distance limit 10km, distance to calculate fee 3km
         * 
         * PRICE:
         * => attribute: "minimum_order_price" default value: 10000000
         */
        allow_pick_up: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        shipping_per_km_fee: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 10000 
        },
        minimum_shipping_fee: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 20000 
        },
        shipping_distance_limit: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 10 
        },
        shipping_distance_to_calculate_fee: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 3 
        },
        minimum_order_price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0 
        },
        bank: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: ""
        },
        bank_number: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: ""
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
        modelName: 'StoreSettings',
        tableName: 'store_settings',
        timestamps: false
    });

    return StoreSettings;
};
