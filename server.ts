import dotenv from 'dotenv';
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/dbConfig';

import bookRoutes from './routes/bookRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config({ path : './.env' });

const app : Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended : false }));
app.use(cookieParser());

connectDB();

const port : number = parseInt(process.env.PORT || '3500', 10);

app.use('/books', bookRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server running on Port ${port}`);
});