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
Book.listBooks = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const offset = (page - 1) * limit;
    const query = `SELECT title, author FROM books ORDER BY title LIMIT :limit OFFSET :offset `;
    const values = { limit, offset };
    const countQuery = `SELECT COUNT(*) AS total FROM books`;
    try {
        const booksList = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.SELECT
        });
        console.log(booksList);
        const totalCountResult = yield dbConfig_1.sequelize.query(countQuery, {
            type: sequelize_1.QueryTypes.SELECT
        });
        const total = totalCountResult[0].total;
        console.log(total);
        return { booksList, total };
    }
    catch (error) {
        throw new Error(`Error in getting books list: ${error}`);
    }
});
Book.findByAuthor = (st, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const offset = (page - 1) * limit;
    const query = `SELECT title, author FROM books WHERE author LIKE :searchTerm AND borrowDate IS NULL ORDER BY title LIMIT :limit OFFSET :offset`;
    const countQuery = `SELECT COUNT(*) AS total FROM books WHERE author LIKE :searchTerm AND borrowDate IS NULL`;
    const values1 = { searchTerm: `%${st}%`, limit, offset };
    const values2 = { searchTerm: `%${st}%` };
    try {
        const results = yield dbConfig_1.sequelize.query(query, {
            replacements: values1,
            type: sequelize_1.QueryTypes.SELECT
        });
        const totalCountResult = yield dbConfig_1.sequelize.query(countQuery, {
            replacements: values2,
            type: sequelize_1.QueryTypes.SELECT
        });
        const total = totalCountResult[0].total;
        console.log(totalCountResult);
        console.log(total);
        return { results, total };
    }
    catch (error) {
        throw new Error(`Error in searching by author: ${error}`);
    }
});
Book.findByTitle = (st, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const offset = (page - 1) * limit;
    const query = `SELECT title, author FROM books WHERE title LIKE :searchTerm AND borrowDate IS NULL ORDER BY title LIMIT :limit OFFSET :offset`;
    const countQuery = `SELECT COUNT(*) AS total FROM books WHERE title LIKE :searchTerm AND borrowDate IS NULL`;
    const values = { searchTerm: `%${st}%`, limit, offset };
    try {
        const results = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.SELECT
        });
        const totalCountResult = yield dbConfig_1.sequelize.query(countQuery, {
            replacements: values,
            type: sequelize_1.QueryTypes.SELECT
        });
        const total = totalCountResult[0].total;
        return { results, total };
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
Book.checkBook = (book_id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM books WHERE book_id = :book_id`;
    const values = { book_id };
    try {
        const [foundBook] = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.SELECT
        });
        return foundBook;
    }
    catch (error) {
        throw new Error(`Error in checking book for deletion: ${error}`);
    }
});
Book.checkAvailability = (book_id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM books WHERE book_id = :book_id AND borrowDate IS NULL`;
    const values = { book_id };
    try {
        const [foundBook] = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.SELECT
        });
        if (!foundBook) {
            return "Not available";
        }
        return "Available";
    }
    catch (error) {
        throw new Error(`Error in checking book availability: ${error}`);
    }
});
Book.borrow = (book_id, borrowDate, returnDate, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `UPDATE books SET borrowDate = :borrowDate, returnDate = :returnDate, user_id = :user_id WHERE book_id = :book_id`;
    const values = { borrowDate, returnDate, user_id, book_id };
    try {
        const [bookBorrowed] = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.UPDATE
        });
        return bookBorrowed;
    }
    catch (error) {
        throw new Error(`Error in borrowing book: ${error}`);
    }
});
Book.remove = (book_id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `DELETE FROM books WHERE book_id = :book_id`;
    try {
        const result = yield dbConfig_1.sequelize.query(query, {
            replacements: { book_id },
            type: sequelize_1.QueryTypes.DELETE
        });
        return "Removed";
    }
    catch (error) {
        throw new Error(`Error in deleting book: ${error}`);
    }
});
Book.checkBorrow = (book_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM books WHERE book_id = :book_id AND user_id = :user_id`;
    const values = { book_id, user_id };
    try {
        const [checked] = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.SELECT
        });
        return checked;
    }
    catch (error) {
        throw new Error(`Error in checnking borrowed book: ${error}`);
    }
});
Book.returnBook = (book_id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `UPDATE books SET borrowDate = NULL, returnDate = NULL, user_id = NULL WHERE book_id = :book_id`;
    const values = { book_id };
    try {
        const returnedBook = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.UPDATE
        });
        return returnedBook;
    }
    catch (error) {
        throw new Error(`Error in returning book: ${error}`);
    }
});
Book.borrowedBooksList = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT title, author, borrowDate, returnDate FROM books WHERE user_id = :user_id`;
    const values = { user_id };
    try {
        const borrowedList = yield dbConfig_1.sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.SELECT
        });
        return borrowedList;
    }
    catch (error) {
        throw new Error(`Error in getting list of borrowed books: ${error}`);
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
