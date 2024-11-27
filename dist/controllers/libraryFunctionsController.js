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
class LibraryFunctionsController {
}
_a = LibraryFunctionsController;
LibraryFunctionsController.borrowBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const book_id = parseInt(req.body.book_id, 10);
    const numDays = req.body.numDays;
    if (!book_id || !numDays) {
        res.status(400).send("Data missing");
        return;
    }
    const user_id = req.user_id;
    try {
        //check availability
        const bookStatus = yield dbConfig_1.BookModel.checkAvailability(book_id);
        if (bookStatus === "Not available") {
            res.status(404).send("Book has already been borrowed");
        }
        //calculate date
        const bDate = new Date();
        const rDate = new Date(bDate);
        rDate.setDate(rDate.getDate() + numDays);
        //borrow book
        const borrowed = yield dbConfig_1.BookModel.borrow(book_id, bDate, rDate, user_id);
        res.status(200).send("Book borrowed successfully");
    }
    catch (error) {
        res.status(500).send(error);
    }
});
LibraryFunctionsController.returnBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.user_id;
    const { book_id } = req.body;
    if (!book_id) {
        res.status(400).send("Data missing!");
    }
    try {
        const checkBook = yield dbConfig_1.BookModel.checkBorrow(book_id, user_id);
        if (checkBook === undefined) {
            res.status(404).send("This book has already been returned/not borrowed by you");
            return;
        }
        const return_today = new Date();
        const daysElapsed = Math.ceil((return_today.getTime() - new Date(checkBook.returnDate).getTime()) / (1000 * 60 * 60 * 24));
        const return_fine = Math.max(0, daysElapsed * 10);
        const returnedBook = yield dbConfig_1.BookModel.returnBook(book_id);
        if (return_fine < 0) {
            res.status(200).send(`Book returned ${daysElapsed} late. Fine of PKR ${return_fine} imposed`);
        }
        else {
            res.status(200).send("book returned successfully");
        }
    }
    catch (error) {
        res.status(500).send(error);
    }
});
LibraryFunctionsController.returnReminder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.user_id;
    try {
        const borrowedBooks = yield dbConfig_1.BookModel.borrowedBooksList(user_id);
        const today_date = new Date();
        const reminders = borrowedBooks.filter((book) => {
            const daysRemaining = Math.floor((new Date(book.returnDate).getTime() - today_date.getTime()) / (1000 * 24 * 24 * 60));
            return daysRemaining === 1;
        });
        if (reminders.length === 0) {
            res.status(404).send("You have no books to return within 1 day");
            return;
        }
        res.status(200).send(reminders);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.default = LibraryFunctionsController;
