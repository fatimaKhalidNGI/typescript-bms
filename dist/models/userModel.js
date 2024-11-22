"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
}
exports.User = User;
User.associate = (models) => {
    User.hasMany(models.BookModel, {
        foreignKey: 'user_id',
        as: 'books',
    });
    User.hasMany(models.RequestModel, {
        foreignKey: 'user_id',
        as: 'bookRequest',
    });
};
exports.default = (sequelize) => {
    User.init({
        user_id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            //unique : true
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        refresh_token: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: false
    });
    return User;
};
