import { Request, Response } from 'express';
import { BookModel } from '../config/dbConfig';

class BookController {
    static addNewBook = async(req : Request, res : Response) : Promise<any> => {
        const { title, author } = req.body;
        if(!title || !author){
            return res.status(400).send("Data missing!");
        }

        try{
            const newBook = await BookModel.addBook(title, author);
            res.status(200).send("Book added successfully!");

        } catch(error){
            console.log(error);
            res.status(500).send(error);
        }
    }

    static listOfBooks = async(req : Request, res : Response) : Promise<any> => {
        try{
            const booksList = await BookModel.listBooks();
            res.status(200).send(booksList);
        } catch(error){
            console.log(error);
            res.status(500).send(error);
        }
    }
}

export default BookController;