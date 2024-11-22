"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booksController_1 = __importDefault(require("../controllers/booksController"));
const router = (0, express_1.Router)();
router.post('/create', booksController_1.default.addNewBook);
router.get('/list', booksController_1.default.listOfBooks);
exports.default = router;
