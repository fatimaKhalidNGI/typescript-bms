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
const dbConfig_1 = require("../config/dbConfig");
class BookController {
}
_a = BookController;
BookController.addNewBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, author } = req.body;
    if (!title || !author) {
        return res.status(400).send("Data missing!");
    }
    try {
        const newBook = yield dbConfig_1.BookModel.addBook(title, author);
        res.status(200).send("Book added successfully!");
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});
BookController.listOfBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booksList = yield dbConfig_1.BookModel.listBooks();
        res.status(200).send(booksList);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
BookController.searchByAuthor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = req.body;
    if (!searchTerm) {
        return res.status(400).send("Data missing!");
    }
    try {
        const results = yield dbConfig_1.BookModel.findByAuthor(searchTerm);
        res.status(200).send(results);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
BookController.searchByTitle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = req.body;
    if (!searchTerm) {
        return res.status(400).send("Data missing!");
    }
    try {
        const results = yield dbConfig_1.BookModel.findByTitle(searchTerm);
        res.status(200).send(results);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
BookController.updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const book_id = parseInt(req.params.book_id, 10);
    const updates = req.body;
    if (!book_id || !updates) {
        return res.status(400).send("Data missing!");
    }
    try {
        const updated = yield dbConfig_1.BookModel.updateDetails(book_id, updates);
        if (!updated) {
            return res.status(404).send("Book not found!");
        }
        res.status(200).send("Book updated successfully!");
    }
    catch (error) {
        res.status(500).send(error);
    }
});
BookController.deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const book_id = parseInt(req.body.book_id, 10);
    if (!book_id) {
        return res.status(400).send("Data missing!");
    }
    try {
        const foundBook = yield dbConfig_1.BookModel.checkBook(book_id);
        if (!foundBook) {
            return res.status(404).send("Book not found");
        }
        const result = yield dbConfig_1.BookModel.remove(book_id);
        res.status(200).send("Book deleted successfully!");
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.default = BookController;
