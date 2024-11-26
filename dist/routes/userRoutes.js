"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const router = (0, express_1.Router)();
router.get('/list', userController_1.default.listAllUsers);
router.get('/listUsers', userController_1.default.listUsers);
router.get('/listAdmins', userController_1.default.listAdmins);
router.put('/update/:user_id', userController_1.default.updateUser);
router.delete('/delete', userController_1.default.removeUser);
exports.default = router;
