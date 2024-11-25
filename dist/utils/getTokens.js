"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getTokens = (foundUser) => {
    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
        throw new Error("Token secrets not present in env file");
    }
    const accessToken = jsonwebtoken_1.default.sign({
        "UserInfo": {
            user_id: foundUser.user_id,
            role: foundUser.role
        }
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
    const refreshToken = jsonwebtoken_1.default.sign({
        "UserInfo": {
            user_id: foundUser.user_id,
            role: foundUser.role
        }
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30m' });
    return { accessToken, refreshToken };
};
exports.getTokens = getTokens;
