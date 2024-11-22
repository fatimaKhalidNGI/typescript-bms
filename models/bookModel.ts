import { DataTypes, Model, Sequelize, Association, QueryTypes } from "sequelize";
import { User } from './userModel';
import { sequelize } from "../config/dbConfig";

interface BookAttributes {
    book_id? : number;
    title : string;
    author : string;
    borrowDate : Date | null;
    returnDate : Date | null;
    user_id? : number | null;
}

export class Book extends Model<BookAttributes> implements BookAttributes{
    public book_id!: number | undefined;
    public title!: string;
    public author!: string;
    public borrowDate!: Date | null;
    public returnDate!: Date | null;
    public user_id! : number | null;

    public static associations : {
        borrowedBy: Association<Book, User>;
    }

    public static associate = (models : any) => {
        Book.belongsTo(models.UserModel, {
            foreignKey : 'user_id',
            as : 'borrowedBy'
        });
    }

    public static addBook = async(title : string, author : string) => {
        const query = `INSERT INTO books (title, author, borrowDate, returnDate) VALUES (:title, :author, NULL, NULL)`;
        const values = { title, author };

        try{
            const newBook = await sequelize.query(query, {
                replacements : values,
                type : QueryTypes.INSERT
            });

            return newBook;

        } catch(error){
            throw new Error(`Error in adding book to table: ${error}`);
        }
    }

    public static listBooks = async() => {
        const query = `SELECT title, author FROM books`;

        try{
            const booksList = await sequelize.query(query, {
                type : QueryTypes.SELECT
            });

            return booksList;

        } catch(error){
            throw new Error(`Error in getting books list: ${error}`);
        }
    }
}

export default (sequelize : Sequelize) : typeof Book => {
    Book.init(
        {
            book_id : {
                type : DataTypes.INTEGER,
                autoIncrement : true,
                primaryKey : true
            },
        
            title : {
                type : DataTypes.STRING,
                allowNull : false,
                unique : true
            },
        
            author : {
                type : DataTypes.STRING,
                allowNull : false
            },
    
            borrowDate : {
                type : DataTypes.DATE,
                allowNull : true,
            },
        
            returnDate : {
                type : DataTypes.DATE,
                allowNull : true
            }
        },
        {
            sequelize,
            modelName : "Book",
            tableName : 'books',
            timestamps : false
        }
    );

    return Book;
}