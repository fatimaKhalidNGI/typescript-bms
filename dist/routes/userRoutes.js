"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const userAuth_1 = require("../middlewares/userAuth");
const router = (0, express_1.Router)();
router.use(userAuth_1.verifyJWT);
router.get('/list', userAuth_1.authAdmin, userController_1.default.listAllUsers);
router.get('/listUsers', userAuth_1.authAdmin, userController_1.default.listUsers);
router.get('/listAdmins', userAuth_1.authAdmin, userController_1.default.listAdmins);
router.put('/update/:user_id', userAuth_1.authAdmin, userController_1.default.updateUser);
router.delete('/delete', userAuth_1.authAdmin, userController_1.default.removeUser);
exports.default = router;
