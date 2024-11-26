"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booksController_1 = __importDefault(require("../controllers/booksController"));
const userAuth_1 = require("../middlewares/userAuth");
const router = (0, express_1.Router)();
router.use(userAuth_1.verifyJWT);
router.post('/create', userAuth_1.authAdmin, booksController_1.default.addNewBook);
router.get('/list', booksController_1.default.listOfBooks);
router.post('/searchByAuthor', booksController_1.default.searchByAuthor);
router.post('/searchByTitle', booksController_1.default.searchByTitle);
router.put('/update/:book_id', userAuth_1.authAdmin, booksController_1.default.updateBook);
router.delete('/delete', userAuth_1.authAdmin, booksController_1.default.deleteBook);
exports.default = router;
