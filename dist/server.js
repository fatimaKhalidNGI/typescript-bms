"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dbConfig_1 = require("./config/dbConfig");
const bookRoutes_1 = __importDefault(require("./routes/bookRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const libraryFuncsRoutes_1 = __importDefault(require("./routes/libraryFuncsRoutes"));
const newBooksRequestsRoutes_1 = __importDefault(require("./routes/newBooksRequestsRoutes"));
dotenv_1.default.config({ path: './.env' });
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
(0, dbConfig_1.connectDB)();
const port = parseInt(process.env.PORT || '3500', 10);
app.use('/books', bookRoutes_1.default);
app.use('/auth', authRoutes_1.default);
app.use('/users', userRoutes_1.default);
app.use('/library', libraryFuncsRoutes_1.default);
app.use('/newBook', newBooksRequestsRoutes_1.default);
app.listen(port, () => {
    console.log(`Server running on Port ${port}`);
});
