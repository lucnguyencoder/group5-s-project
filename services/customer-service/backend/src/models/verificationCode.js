//done
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class VerificationCode extends Model {
        static associate(models) {

            VerificationCode.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });
        }
    }

    VerificationCode.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code_type: {
            type: DataTypes.ENUM('password_recovery', 'two_factor_auth', 'email_verification'),
            allowNull: false
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        is_used: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        attempt_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        used_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'VerificationCode',
        tableName: 'verification_codes',
        timestamps: false,
        hooks: {
            beforeUpdate: (verificationCode) => {
                if (verificationCode.changed('is_used') && verificationCode.is_used) {
                    verificationCode.used_at = new Date();
                }
            }
        }
    });

    return VerificationCode;
};
