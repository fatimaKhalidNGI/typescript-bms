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
class UserController {
}
_a = UserController;
UserController.listAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const { list, total } = yield dbConfig_1.UserModel.listAll(page, limit);
        if (list.length === 0) {
            res.status(404).send("No records found");
            return;
        }
        const response = {
            list,
            page,
            total,
            totalPages: Math.ceil(total / limit)
        };
        res.status(200).send(response);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
UserController.listUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const { foundUsers, total } = yield dbConfig_1.UserModel.usersList(page, limit);
        if (foundUsers.length === 0) {
            res.status(404).send("No users found");
            return;
        }
        const response = {
            foundUsers,
            page,
            total,
            totalPages: Math.ceil(total / limit)
        };
        res.status(200).send(response);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
UserController.listAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const { foundAdmins, total } = yield dbConfig_1.UserModel.adminsList(page, limit);
        if (foundAdmins.length === 0) {
            res.status(404).send("No admins found");
            return;
        }
        const response = {
            foundAdmins,
            page,
            total,
            totalPages: Math.ceil(total / limit)
        };
        res.status(200).send(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});
UserController.updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = parseInt(req.params.user_id, 10);
    const updates = req.body;
    if (!user_id || !updates) {
        res.status(400).send("Data missing!");
        return;
    }
    try {
        const updated = yield dbConfig_1.UserModel.updateDetails(user_id, updates);
        if (!updated) {
            res.status(404).send("User not found!");
            return;
        }
        res.status(200).send("User updated successfully!");
    }
    catch (error) {
        res.status(500).send(error);
    }
});
UserController.removeUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.body;
    if (!user_id) {
        res.status(400).send("User ID missing!");
        return;
    }
    try {
        const checkUser = yield dbConfig_1.UserModel.checkUserExists(user_id);
        if (!checkUser) {
            res.status(404).send("User not found");
            return;
        }
        const result = yield dbConfig_1.UserModel.deleteUser(user_id);
        res.status(200).send("User deleted successfully");
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});
exports.default = UserController;
