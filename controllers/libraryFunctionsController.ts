import { Request, Response } from "express";
import { BookModel } from "../config/dbConfig";

import { CustomRequest } from "../middlewares/userAuth";

class LibraryFunctionsController {
    static borrowBook = async(req : CustomRequest, res : Response) => {
        const book_id = parseInt(req.body.book_id, 10);
        const numDays = req.body.numDays;

        if(!book_id || !numDays){
            res.status(400).send("Data missing");
            return;
        }

        const user_id = req.user_id;

        try{
            //check availability
            const bookStatus = await BookModel.checkAvailability(book_id);

            if(bookStatus === "Not available"){
                res.status(404).send("Book has already been borrowed");
            }

            //calculate date
            const bDate : Date = new Date();
            const rDate : Date = new Date(bDate);

            rDate.setDate(rDate.getDate() + numDays);

            //borrow book
            const borrowed = await BookModel.borrow(book_id, bDate, rDate, user_id);
            
            res.status(200).send("Book borrowed successfully");

        } catch(error){
            res.status(500).send(error);
        }
    }

    static returnBook = async(req : CustomRequest, res : Response) => {
        const user_id = req.user_id;

        const { book_id } = req.body;
        if(!book_id){
            res.status(400).send("Data missing!");
        }

        try{
            const checkBook : any = await BookModel.checkBorrow(book_id, user_id);
            
            if(checkBook === undefined){
                res.status(404).send("This book has already been returned/not borrowed by you");
                return;
            }

            const return_today : Date = new Date();
            const daysElapsed = Math.ceil(
                (return_today.getTime() - new Date(checkBook.returnDate).getTime()) / (1000 * 60 * 60 * 24)
            );
            const return_fine = Math.max(0, daysElapsed*10);

            const returnedBook = await BookModel.returnBook(book_id);

            if(return_fine < 0){
                res.status(200).send(`Book returned ${daysElapsed} late. Fine of PKR ${return_fine} imposed`);
            } else{
                res.status(200).send("book returned successfully");
            }

        } catch(error){
            res.status(500).send(error);
        }
    }

    static returnReminder = async(req : CustomRequest, res : Response) => {
        const user_id = req.user_id;

        try{
            const borrowedBooks : { returnDate : Date}[] = await BookModel.borrowedBooksList(user_id);

            const today_date = new Date();
            const reminders = borrowedBooks.filter((book : { returnDate : Date}) => {
                const daysRemaining = Math.floor(
                    (new Date(book.returnDate).getTime() - today_date.getTime()) / (1000 * 24 * 24 * 60)
                );

                return daysRemaining === 1;
            })

            if(reminders.length === 0){
                res.status(404).send("You have no books to return within 1 day");
                return;
            }

            res.status(200).send(reminders);

        } catch(error){
            res.status(500).send(error);
        }
    }
}

export default LibraryFunctionsController;