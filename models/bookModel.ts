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

    public static listBooks = async(page : number, limit : number) => {
        const offset = (page - 1) * limit;
        const query = `SELECT title, author FROM books ORDER BY title LIMIT :limit OFFSET :offset `;
        const values = { limit, offset };

        const countQuery = `SELECT COUNT(*) AS total FROM books`;


        try{
            const booksList = await sequelize.query(query, {
                replacements : values,
                type : QueryTypes.SELECT
            });

            console.log(booksList);

            const totalCountResult : any[] = await sequelize.query(countQuery, {
                type : QueryTypes.SELECT
            });
            const total = totalCountResult[0].total;

            console.log(total);

            return {booksList , total};

        } catch(error){
            throw new Error(`Error in getting books list: ${error}`);
        }
    }

    public static findByAuthor = async(st : string, page : number, limit : number) => {
        const offset = (page - 1) * limit;
        const query = `SELECT title, author FROM books WHERE author LIKE :searchTerm AND borrowDate IS NULL ORDER BY title LIMIT :limit OFFSET :offset`;
        
        const countQuery = `SELECT COUNT(*) AS total FROM books WHERE author LIKE :searchTerm AND borrowDate IS NULL`;
        
        const values1 = { searchTerm : `%${st}%`, limit, offset };
        const values2 = { searchTerm : `%${st}%` };

        try{
            const results = await sequelize.query(query, { 
                replacements : values1,
                type : QueryTypes.SELECT
            });

            const totalCountResult : any[] = await sequelize.query(countQuery, {
                replacements : values2,
                type : QueryTypes.SELECT
            });
            const total = totalCountResult[0].total;

            console.log(totalCountResult);
            console.log(total);

            return { results, total };

        } catch(error){
            throw new Error(`Error in searching by author: ${error}`);
        }
    }

    public static findByTitle = async(st : string, page : number, limit : number) => {
        const offset = (page - 1) * limit;
        const query = `SELECT title, author FROM books WHERE title LIKE :searchTerm AND borrowDate IS NULL ORDER BY title LIMIT :limit OFFSET :offset`;
        const countQuery = `SELECT COUNT(*) AS total FROM books WHERE title LIKE :searchTerm AND borrowDate IS NULL`
        
        const values = { searchTerm : `%${st}%`, limit, offset };

        try{
            const results = await sequelize.query(query, { 
                replacements : values,
                type : QueryTypes.SELECT
            });

            const totalCountResult : any[] = await sequelize.query(countQuery, { 
                replacements : values,
                type : QueryTypes.SELECT
            });
            const total = totalCountResult[0].total;

            return { results, total };

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

    public static checkBook = async(book_id : number) => {
        const query = `SELECT * FROM books WHERE book_id = :book_id`;
        const values = { book_id };

        try{
            const [foundBook] = await sequelize.query(query, {
                replacements : values,
                type : QueryTypes.SELECT
            });
            
            return foundBook;
             
        } catch(error){
            throw new Error(`Error in checking book for deletion: ${error}`);
        }
    }

    public static checkAvailability = async(book_id : number) : Promise<string> => {
        const query = `SELECT * FROM books WHERE book_id = :book_id AND borrowDate IS NULL`;
        const values = { book_id };

        try{
            const [foundBook] = await sequelize.query(query, {
                replacements : values,
                type : QueryTypes.SELECT
            });

            if(!foundBook){
                return "Not available";
            }

            return "Available";

        } catch(error){
            throw new Error(`Error in checking book availability: ${error}`);
        }
    }

    public static borrow = async(book_id : number, borrowDate : Date, returnDate : Date, user_id : number|undefined) => {
        const query = `UPDATE books SET borrowDate = :borrowDate, returnDate = :returnDate, user_id = :user_id WHERE book_id = :book_id`;
        const values = { borrowDate, returnDate, user_id, book_id };

        try{
            const [bookBorrowed] = await sequelize.query(query, {
                replacements : values,
                type : QueryTypes.UPDATE
            });

            return bookBorrowed;
            
        } catch(error){
            throw new Error(`Error in borrowing book: ${error}`);
        }
    }

    public static remove = async(book_id : number) : Promise<string> => {
        const query = `DELETE FROM books WHERE book_id = :book_id`;

        try{
            const result : any = await sequelize.query(query, {
                replacements: { book_id },
                type : QueryTypes.DELETE
            });

            return "Removed";

        } catch(error){
            throw new Error(`Error in deleting book: ${error}`);
        }
    }

    public static checkBorrow = async(book_id : number, user_id : number|undefined) => {
        const query = `SELECT * FROM books WHERE book_id = :book_id AND user_id = :user_id`;
        const values = { book_id, user_id };

        try{
            const [checked] = await sequelize.query(query, {
                replacements : values,
                type : QueryTypes.SELECT
            });

            return checked;

        } catch(error){
            throw new Error(`Error in checnking borrowed book: ${error}`);
        }
    }

    public static returnBook = async(book_id : number) => {
        const query = `UPDATE books SET borrowDate = NULL, returnDate = NULL, user_id = NULL WHERE book_id = :book_id`;
        const values = { book_id };

        try{
            const returnedBook = await sequelize.query(query, {
                replacements : values,
                type : QueryTypes.UPDATE
            });

            return returnedBook;

        } catch(error){
            throw new Error(`Error in returning book: ${error}`);
        }
    }

    public static borrowedBooksList = async(user_id : number|undefined) => {
        const query = `SELECT title, author, borrowDate, returnDate FROM books WHERE user_id = :user_id`;
        const values = { user_id };

        try{
            const borrowedList = await sequelize.query(query, {
                replacements : values,
                type : QueryTypes.SELECT
            });

            return borrowedList as { returnDate : Date}[];

        } catch(error){
            throw new Error(`Error in getting list of borrowed books: ${error}`);
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