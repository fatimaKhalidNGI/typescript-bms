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
exports.RequestModel = exports.BookModel = exports.UserModel = exports.connectDB = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const userModel_1 = __importDefault(require("../models/userModel"));
const bookModel_1 = __importDefault(require("../models/bookModel"));
const requestModel_1 = __importDefault(require("../models/requestModel"));
const sequelize = new sequelize_1.Sequelize('typescript_bms', 'root', 'fatima123', {
    host: 'localhost',
    dialect: 'mysql'
});
exports.sequelize = sequelize;
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log("DB connected successfully");
    }
    catch (error) {
        console.log(`Error in connecting to DB: ${error}`);
    }
});
exports.connectDB = connectDB;
const UserModel = (0, userModel_1.default)(sequelize);
exports.UserModel = UserModel;
const BookModel = (0, bookModel_1.default)(sequelize);
exports.BookModel = BookModel;
const RequestModel = (0, requestModel_1.default)(sequelize);
exports.RequestModel = RequestModel;
const models = { UserModel, BookModel, RequestModel };
Object.keys(models).forEach((modelName) => {
    const model = models[modelName];
    if ('associate' in model && typeof model.associate === 'function') {
        model.associate(models);
    }
});
sequelize.sync()
    .then(() => {
    console.log("Models synced with DB");
})
    .catch((error) => {
    console.log(`Error in syncing with DB: ${error}`);
});
