"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const sequelize_1 = require("sequelize");
class Request extends sequelize_1.Model {
}
exports.Request = Request;
Request.associate = (models) => {
    Request.belongsTo(models.UserModel, {
        foreignKey: 'user_id',
        as: 'requestedBy'
    });
};
exports.default = (sequelize) => {
    Request.init({
        request_id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        book_title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        book_author: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        admin_response: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Request',
        tableName: 'requests',
        timestamps: false
    });
    return Request;
};
