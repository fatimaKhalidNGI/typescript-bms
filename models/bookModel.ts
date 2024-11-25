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

    public static findByAuthor = async(st : string) => {
        const query = `SELECT title, author FROM books WHERE author LIKE :searchTerm AND borrowDate IS NULL`;
        const values = { searchTerm : `%${st}%` };

        try{
            const results = await sequelize.query(query, { 
                replacements : values,
                type : QueryTypes.SELECT
            });

            return results;

        } catch(error){
            throw new Error(`Error in searching by author: ${error}`);
        }
    }

    public static findByTitle = async(st : string) => {
        const query = `SELECT title, author FROM books WHERE title LIKE :searchTerm AND borrowDate IS NULL`;
        const values = { searchTerm : `%${st}%` };

        try{
            const results = await sequelize.query(query, { 
                replacements : values,
                type : QueryTypes.SELECT
            });

            return results;

        } catch(error){
            throw new Error(`Error in searching by title: ${error}`);
        }
    }

    public static updateDetails = async(book_id : number, updates : Record<string, any>) : Promise<number> => {
        console.log(updates);
        
        const setClause = Object.keys(updates)
            .map((key) => `${key} = :${key}`)
            .join(", ");


        const values = { ...updates, book_id };

        console.log(setClause, values);

        const query = `UPDATE books SET ${setClause} WHERE book_id = :book_id`;

        try{
            const result = await sequelize.query(query,{
                replacements : values,
                type : QueryTypes.UPDATE
            });
            
            const updatedRows = result[1] as number | undefined;
            return updatedRows ?? 0;

        } catch(error){
            throw new Error(`Error in updating book: ${error}`);
        }
    }

    public static remove = async(book_id : number) : Promise<string> => {
        const query = `DELETE FROM books WHERE book_id = :book_id`;
        //const values = { book_id };

        try{
            const [result] = await sequelize.query(query, {
                replacements: { book_id },
            });

            const affectedRows = result[0] as number | undefined;
            
            if (affectedRows === 0) {
                return "Not found";
            }
            return "Removed";

        } catch(error){
            throw new Error(`Error in deleting book: ${error}`);
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