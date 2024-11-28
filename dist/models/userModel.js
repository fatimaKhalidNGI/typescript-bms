"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const dbConfig_1 = require("../config/dbConfig");
class User extends sequelize_1.Model {
}
exports.User = User;
_a = User;
User.associate = (models) => {
    _a.hasMany(models.BookModel, {
        foreignKey: 'user_id',
        as: 'books',
    });
    _a.hasMany(models.RequestModel, {
        foreignKey: 'user_id',
        as: 'bookRequest',
    });
};
User.checkDuplicateUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM users WHERE email = :email`;
    const replacements = { email };
    try {
        const duplicateUser = yield dbConfig_1.sequelize.query(query, {
            replacements,
            type: sequelize_1.QueryTypes.SELECT
        });
        return [duplicateUser];
    }
    catch (error) {
        throw new Error(`Error in checking duplicates: ${error}`);
    }
});
User.registerNewUser = (name, email, password, role) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)`;
    const replacements = { name, email, password, role };
    try {
        const [newUser] = yield dbConfig_1.sequelize.query(query, {
            replacements,
            type: sequelize_1.QueryTypes.INSERT
        });
        return newUser;
    }
    catch (error) {
        throw new Error(`Error in registering user: ${error}`);
    }
});
User.findUser_login = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM users WHERE email = :email`;
    const values = { email };
    try {
        const [foundUser] = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.SELECT
        });
        return foundUser;
    }
    catch (error) {
        throw new Error(`Error in finding user: ${error}`);
    }
});
User.loginFunction = (user_id, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `UPDATE users SET refresh_token = :refresh_token WHERE user_id = :user_id`;
    const values = { refresh_token: refreshToken, user_id };
    try {
        const result = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.UPDATE, // Explicitly declare query type
        });
        return "Success";
    }
    catch (error) {
        throw new Error(`Error in logging user in: ${error}`);
    }
});
User.checkUser_logout = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM users WHERE refresh_token = :refreshToken`;
    const values = { refreshToken };
    try {
        const [foundUser] = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.SELECT
        });
        return foundUser;
    }
    catch (error) {
        throw new Error(`Error in checking user for logout: ${error}`);
    }
});
User.logoutFunction = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `UPDATE users SET refresh_token = NULL WHERE user_id = :user_id`;
    const values = { user_id };
    try {
        const result = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.UPDATE
        });
        return "Success";
    }
    catch (error) {
        throw new Error(`Error in logging user out: ${error}`);
    }
});
User.listAll = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const offset = (page - 1) * limit;
    const query = `SELECT name, email, role FROM users ORDER BY name LIMIT :limit OFFSET :offset`;
    const countQuery = `SELECT COUNT(*) AS total FROM users`;
    const values = { limit, offset };
    try {
        const list = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.SELECT
        });
        const totalCountResult = yield dbConfig_1.sequelize.query(countQuery, {
            type: sequelize_1.QueryTypes.SELECT
        });
        const total = totalCountResult[0].total;
        return { list, total };
    }
    catch (error) {
        throw new Error(`Error in getting users list: ${error}`);
    }
});
User.usersList = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const offset = (page - 1) * limit;
    const query = `SELECT name, email FROM users WHERE role = "User" ORDER BY name LIMIT :limit OFFSET :offset`;
    const countQuery = `SELECT COUNT(*) AS total FROM users WHERE role = "User"`;
    const values = { limit, offset };
    try {
        const foundUsers = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.SELECT
        });
        const totalCountResult = yield dbConfig_1.sequelize.query(countQuery, {
            type: sequelize_1.QueryTypes.SELECT
        });
        const total = totalCountResult[0].total;
        return { foundUsers, total };
    }
    catch (error) {
        throw new Error(`Error in listing "users": ${error}`);
    }
});
User.adminsList = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const offset = (page - 1) * limit;
    const query = `SELECT name, email FROM users WHERE role = "Admin" ORDER BY name LIMIT :limit OFFSET :offset`;
    const countQuery = `SELECT COUNT(*) AS total FROM users WHERE role = "Admin"`;
    const values = { limit, offset };
    try {
        const foundAdmins = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.SELECT
        });
        const totalCountResult = yield dbConfig_1.sequelize.query(countQuery, {
            type: sequelize_1.QueryTypes.SELECT
        });
        const total = totalCountResult[0].total;
        return { foundAdmins, total };
    }
    catch (error) {
        throw new Error(`Error in listing "admins": ${error}`);
    }
});
User.checkUserExists = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM users WHERE user_id = :user_id`;
    const values = { user_id };
    try {
        const [foundUser] = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.SELECT
        });
        return foundUser;
    }
    catch (error) {
        throw new Error(`Error in checking user: ${error}`);
    }
});
User.deleteUser = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `DELETE FROM users WHERE user_id = :user_id`;
    const values = { user_id };
    try {
        const result = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.DELETE
        });
        return result;
    }
    catch (error) {
        throw new Error(`Error in deleting user: ${error}`);
    }
});
User.updateDetails = (user_id, updates) => __awaiter(void 0, void 0, void 0, function* () {
    const setClause = Object.keys(updates)
        .map((key) => `${key} = :${key}`)
        .join(", ");
    const values = Object.assign(Object.assign({}, updates), { user_id });
    const query = `UPDATE users SET ${setClause} WHERE user_id = :book_id`;
    try {
        const result = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.UPDATE
        });
        const updatedRows = result[1];
        return updatedRows !== null && updatedRows !== void 0 ? updatedRows : 0;
    }
    catch (error) {
        throw new Error(`Error in updating book: ${error}`);
    }
});
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
