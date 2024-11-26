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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUser = exports.authAdmin = exports.verifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
        res.status(401).send("Unauthorized");
        return;
    }
    const token = authHeader.split(' ')[1];
    console.log("JWT: ", token);
    console.log("Access secret: ", process.env.ACCESS_TOKEN_SECRET);
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send("Invalid token");
        }
        console.log("Inside JWT");
        const decodedPayload = decoded;
        req.user_id = decodedPayload.UserInfo.user_id;
        req.role = decodedPayload.UserInfo.role;
        next();
    });
};
exports.verifyJWT = verifyJWT;
const authAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.role !== "Admin") {
        res.status(401).send("Unauthorized");
    }
    next();
});
exports.authAdmin = authAdmin;
const authUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.role !== "User") {
        res.status(401).send("Unauthorized");
    }
    next();
});
exports.authUser = authUser;
