"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const libraryFunctionsController_1 = __importDefault(require("../controllers/libraryFunctionsController"));
const userAuth_1 = require("../middlewares/userAuth");
const router = (0, express_1.Router)();
router.use(userAuth_1.verifyJWT);
router.put('/borrow', userAuth_1.authUser, libraryFunctionsController_1.default.borrowBook);
router.put('/return', libraryFunctionsController_1.default.returnBook);
router.get('/reminders', libraryFunctionsController_1.default.returnReminder);
exports.default = router;
