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
exports.Book = void 0;
const sequelize_1 = require("sequelize");
const dbConfig_1 = require("../config/dbConfig");
class Book extends sequelize_1.Model {
}
exports.Book = Book;
_a = Book;
Book.associate = (models) => {
    _a.belongsTo(models.UserModel, {
        foreignKey: 'user_id',
        as: 'borrowedBy'
    });
};
Book.addBook = (title, author) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `INSERT INTO books (title, author, borrowDate, returnDate) VALUES (:title, :author, NULL, NULL)`;
    const values = { title, author };
    try {
        const newBook = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.INSERT
        });
        return newBook;
    }
    catch (error) {
        throw new Error(`Error in adding book to table: ${error}`);
    }
});
Book.listBooks = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT title, author FROM books`;
    try {
        const booksList = yield dbConfig_1.sequelize.query(query, {
            type: sequelize_1.QueryTypes.SELECT
        });
        return booksList;
    }
    catch (error) {
        throw new Error(`Error in getting books list: ${error}`);
    }
});
Book.findByAuthor = (st) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT title, author FROM books WHERE author LIKE :searchTerm AND borrowDate IS NULL`;
    const values = { searchTerm: `%${st}%` };
    try {
        const results = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.SELECT
        });
        return results;
    }
    catch (error) {
        throw new Error(`Error in searching by author: ${error}`);
    }
});
Book.findByTitle = (st) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT title, author FROM books WHERE title LIKE :searchTerm AND borrowDate IS NULL`;
    const values = { searchTerm: `%${st}%` };
    try {
        const results = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.SELECT
        });
        return results;
    }
    catch (error) {
        throw new Error(`Error in searching by title: ${error}`);
    }
});
Book.updateDetails = (book_id, updates) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(updates);
    const setClause = Object.keys(updates)
        .map((key) => `${key} = :${key}`)
        .join(", ");
    const values = Object.assign(Object.assign({}, updates), { book_id });
    console.log(setClause, values);
    const query = `UPDATE books SET ${setClause} WHERE book_id = :book_id`;
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
Book.remove = (book_id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `DELETE FROM books WHERE book_id = :book_id`;
    //const values = { book_id };
    try {
        const [result] = yield dbConfig_1.sequelize.query(query, {
            replacements: { book_id },
        });
        const affectedRows = result[0];
        if (affectedRows === 0) {
            return "Not found";
        }
        return "Removed";
    }
    catch (error) {
        throw new Error(`Error in deleting book: ${error}`);
    }
});
exports.default = (sequelize) => {
    Book.init({
        book_id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        author: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        borrowDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        returnDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: "Book",
        tableName: 'books',
        timestamps: false
    });
    return Book;
};
