"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const newBooksRequest_1 = __importDefault(require("../controllers/newBooksRequest"));
const userAuth_1 = require("../middlewares/userAuth");
const router = (0, express_1.Router)();
router.use(userAuth_1.verifyJWT);
router.post('/request', userAuth_1.authUser, newBooksRequest_1.default.makeRequest);
router.get('/getAllRequests', userAuth_1.authAdmin, newBooksRequest_1.default.getAllRequests);
router.get('/userList', userAuth_1.authUser, newBooksRequest_1.default.getOwnRequests);
router.put('/respond', userAuth_1.authAdmin, newBooksRequest_1.default.respondAdmin);
exports.default = router;
