import e, { Request, Response } from "express";
import { CustomRequest } from "../middlewares/userAuth";
import { BookModel } from "../config/dbConfig";
import { RequestModel } from "../config/dbConfig";

class NewBooksRequests {
    static makeRequest = async(req : CustomRequest, res : Response) => {
        const user_id = req.user_id;
        const { book_title, book_author } = req.body;

        if(!book_title || !book_author){
            res.status(400).send("Data missing!");
        }

        try{
            const newRequest = await RequestModel.createRequest(book_title, book_author, user_id);
            res.status(200).send("Request created successfully!");

        } catch(error){
            res.status(500).send(error);
        }
    }

    static getAllRequests = async(req : Request, res : Response) => {
        try{
            const requestList = await RequestModel.getAll();

            res.status(200).send(requestList);
        } catch(error){
            res.status(500).send(error);
        }
    }

    static getOwnRequests = async(req : CustomRequest, res : Response) => {
        const user_id = req.user_id;

        try{
            const ownRequests = await RequestModel.getOwn(user_id);
            res.status(200).send(ownRequests);

        } catch(error){
            res.status(500).send(error);
        }
    }

    static respondAdmin = async(req : Request, res : Response) => {
        const { request_id, status, admin_response } = req.body;
        if(!request_id || !status || !admin_response){
            res.status(400).send("Data missing!");
            return;
        }

        try{
            //respond
            const markedResponse = await RequestModel.respond(request_id, status, admin_response);

            //add to book table
            if(status === "Accepted"){
                const bookDetails : any = await RequestModel.requestDetails(request_id);

                const book_title = bookDetails.book_title;
                const book_author = bookDetails.book_author;

                const newBook = await BookModel.addBook(book_title, book_author);
            }
            res.status(200).send(`Request is ${status}. ${admin_response}`);

        } catch(error){
            res.status(500).send(error);
        }
    }
}

export default NewBooksRequests;