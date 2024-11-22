import { Sequelize } from 'sequelize';
import User from '../models/userModel';
import Book from '../models/bookModel';
import Request from '../models/requestModel';

const sequelize = new Sequelize(
    'typescript_bms',
    'root',
    'fatima123',
    {
        host : 'localhost',
        dialect : 'mysql'
    }
);

const connectDB = async() : Promise<void> => {
    try{
        await sequelize.authenticate();
        console.log("DB connected successfully");
    } catch(error){
        console.log(`Error in connecting to DB: ${error}`);
    }
}

const UserModel = User(sequelize);
const BookModel = Book(sequelize);
const RequestModel = Request(sequelize);

const models = { UserModel, BookModel, RequestModel };

Object.keys(models).forEach((modelName) => {
    const model = models[modelName as keyof typeof models];
    if('associate' in model && typeof model.associate === 'function'){
        model.associate(models);
    }
});

sequelize.sync()
    .then(() => {
        console.log("Models synced with DB");
    })
    .catch((error : Error) => {
        console.log(`Error in syncing with DB: ${error}`);
    });

export { sequelize, connectDB, UserModel, BookModel, RequestModel };