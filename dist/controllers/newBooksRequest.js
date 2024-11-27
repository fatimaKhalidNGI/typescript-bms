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
const dbConfig_2 = require("../config/dbConfig");
class NewBooksRequests {
}
_a = NewBooksRequests;
NewBooksRequests.makeRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.user_id;
    const { book_title, book_author } = req.body;
    if (!book_title || !book_author) {
        res.status(400).send("Data missing!");
    }
    try {
        const newRequest = yield dbConfig_2.RequestModel.createRequest(book_title, book_author, user_id);
        res.status(200).send("Request created successfully!");
    }
    catch (error) {
        res.status(500).send(error);
    }
});
NewBooksRequests.getAllRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestList = yield dbConfig_2.RequestModel.getAll();
        res.status(200).send(requestList);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
NewBooksRequests.getOwnRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.user_id;
    try {
        const ownRequests = yield dbConfig_2.RequestModel.getOwn(user_id);
        res.status(200).send(ownRequests);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
NewBooksRequests.respondAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { request_id, status, admin_response } = req.body;
    if (!request_id || !status || !admin_response) {
        res.status(400).send("Data missing!");
        return;
    }
    try {
        //respond
        const markedResponse = yield dbConfig_2.RequestModel.respond(request_id, status, admin_response);
        //add to book table
        if (status === "Accepted") {
            const bookDetails = yield dbConfig_2.RequestModel.requestDetails(request_id);
            const book_title = bookDetails.book_title;
            const book_author = bookDetails.book_author;
            const newBook = yield dbConfig_1.BookModel.addBook(book_title, book_author);
        }
        res.status(200).send(`Request is ${status}. ${admin_response}`);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.default = NewBooksRequests;
