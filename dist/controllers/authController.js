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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dbConfig_1 = require("../config/dbConfig");
const getTokens_1 = require("../utils/getTokens");
dotenv_1.default.config({ path: '../.env' });
class AuthController {
}
_a = AuthController;
AuthController.registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(200).send("Data missing!");
    }
    try {
        const duplicateUser = yield dbConfig_1.UserModel.checkDuplicateUser(email);
        if (duplicateUser[0].length > 0) {
            return res.status(400).send("User already registered against this email");
        }
        const hashedPwd = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield dbConfig_1.UserModel.registerNewUser(name, email, hashedPwd, role);
        res.status(200).send("User registered successfully!");
    }
    catch (error) {
        res.status(500).send(error);
    }
});
AuthController.loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("Credentials missing!");
    }
    try {
        const foundUser = yield dbConfig_1.UserModel.findUser_login(email);
        if (!foundUser) {
            return res.status(404).send("User not found");
        }
        const pwdMatch = yield bcrypt_1.default.compare(password, foundUser.password);
        if (pwdMatch) {
            try {
                const { accessToken, refreshToken } = (0, getTokens_1.getTokens)(foundUser);
                const userLoggedIn = yield dbConfig_1.UserModel.loginFunction(foundUser.user_id, refreshToken);
                if (userLoggedIn !== "Success") {
                    return res.status(500).send("Failed to log user in");
                }
                res.cookie('jwt', refreshToken, {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: false,
                    maxAge: 24 * 60 * 60 * 1000,
                });
                res.status(200).send(accessToken);
            }
            catch (error) {
                return res.status(500).send(error);
            }
        }
    }
    catch (error) {
        res.status(500).send(error);
    }
});
AuthController.logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)) {
        res.status(401).send("Not logged in");
        return;
    }
    const refreshToken = cookies.jwt;
    try {
        const foundUser = yield dbConfig_1.UserModel.checkUser_logout(refreshToken);
        if (!foundUser) {
            res.clearCookie('jwt', {
                httpOnly: true,
                sameSite: 'none',
                secure: true
            });
            res.status(204).send("Done");
        }
        const result = yield dbConfig_1.UserModel.logoutFunction(foundUser.user_id);
        if (result === "Success") {
            res.clearCookie('jwt', {
                httpOnly: true,
                sameSite: 'none',
                secure: true
            });
        }
        res.status(204).send("Done");
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.default = AuthController;
