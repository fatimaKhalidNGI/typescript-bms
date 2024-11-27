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
exports.Request = void 0;
const sequelize_1 = require("sequelize");
const dbConfig_1 = require("../config/dbConfig");
class Request extends sequelize_1.Model {
}
exports.Request = Request;
_a = Request;
Request.associate = (models) => {
    _a.belongsTo(models.UserModel, {
        foreignKey: 'user_id',
        as: 'requestedBy'
    });
};
Request.createRequest = (book_title, book_author, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `INSERT INTO requests (book_title, book_author, status, admin_response, user_id) VALUES (:book_title, :book_author, "Pending", NULL, :user_id)`;
    const values = { book_title, book_author, user_id };
    try {
        const newRequest = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.INSERT
        });
        return newRequest;
    }
    catch (error) {
        throw new Error(`Error in creating new request: ${error}`);
    }
});
Request.getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT book_title, book_author, status, admin_response FROM requests`;
    try {
        const requestList = yield dbConfig_1.sequelize.query(query, {
            type: sequelize_1.QueryTypes.SELECT
        });
        return requestList;
    }
    catch (error) {
        throw new Error(`Error in getting all filed requests: ${error}`);
    }
});
Request.getOwn = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT book_title, book_author, status, admin_response FROM requests WHERE user_id = :user_id`;
    const values = { user_id };
    try {
        const [ownRequests] = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.SELECT
        });
        return ownRequests;
    }
    catch (error) {
        throw new Error(`Error in getting user's requests: ${error}`);
    }
});
Request.respond = (request_id, status, admin_response) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `UPDATE requests SET status = :status, admin_response = :admin_response WHERE request_id = :request_id`;
    const values = { status, admin_response, request_id };
    try {
        const markResponse = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.UPDATE
        });
        return markResponse;
    }
    catch (error) {
        throw new Error(`Error in marking response: ${error}`);
    }
});
Request.requestDetails = (request_id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT book_title, book_author FROM requests WHERE request_id = :request_id`;
    const values = { request_id };
    try {
        const [bookDetails] = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.SELECT
        });
        return bookDetails;
    }
    catch (error) {
        throw new Error(`Error in getting request details: ${error}`);
    }
});
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
