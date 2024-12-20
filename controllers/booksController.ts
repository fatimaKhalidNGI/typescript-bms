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
            res.status(500).send(error);
        }
    }

    static listOfBooks = async(req : Request, res : Response) : Promise<any> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string ) || 10;

        try{
            const { booksList, total } = await BookModel.listBooks(page, limit);

            const response = {
                booksList,
                page,
                limit,
                total,
                totalPages : Math.ceil(total / limit)
            };

            res.status(200).send(response);
        } catch(error){
            res.status(500).send(error);
        }
    }

    static searchByAuthor = async(req : Request, res : Response) : Promise<any> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string ) || 10;
        
        const { searchTerm } = req.body;
        if(!searchTerm){
            return res.status(400).send("Data missing!");
        }

        try{
            const { results, total } = await BookModel.findByAuthor(searchTerm, page, limit);
            
            const response = {
                results,
                page,
                limit,
                total,
                totalPages : Math.ceil(total / limit)
            };
            
            res.status(200).send(response);

        } catch(error){
            res.status(500).send(error);
        }
    }

    static searchByTitle = async(req : Request, res : Response) : Promise<any> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string ) || 10;

        const { searchTerm } = req.body;
        if(!searchTerm){
            return res.status(400).send("Data missing!");
        }

        try{
            const { results, total } = await BookModel.findByTitle(searchTerm, page, limit);

            const response = {
                results,
                page,
                limit,
                total,
                totalPages : Math.ceil(total / limit)
            };

            res.status(200).send(response);

        } catch(error){
            res.status(500).send(error);
        }
    }

    static updateBook = async(req : Request, res : Response) : Promise<any> => {
        const book_id = parseInt(req.params.book_id, 10);
        const updates = req.body;

        if(!book_id || !updates){
            return res.status(400).send("Data missing!");
        }

        try{
            const updated = await BookModel.updateDetails(book_id, updates);

            if(!updated){
                return res.status(404).send("Book not found!");
            }

            res.status(200).send("Book updated successfully!");

        } catch(error){
            res.status(500).send(error);
        }
    }

    static deleteBook = async(req : Request, res : Response) : Promise<any> => {
        const book_id = parseInt(req.body.book_id, 10);
        if(!book_id){
            return res.status(400).send("Data missing!");
        }

        try{
            const foundBook = await BookModel.checkBook(book_id);

            if(!foundBook){
                return res.status(404).send("Book not found");
            }

            const result = await BookModel.remove(book_id);

            res.status(200).send("Book deleted successfully!");

        } catch(error){
            res.status(500).send(error);
        }
    }
}

export default BookController;