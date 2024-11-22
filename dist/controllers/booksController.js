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
        console.log(error);
        res.status(500).send(error);
    }
});
exports.default = BookController;
