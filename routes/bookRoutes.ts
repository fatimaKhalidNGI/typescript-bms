import { Router } from 'express';
import BookController from '../controllers/booksController';

const router : Router = Router();

router.post('/create', BookController.addNewBook);
router.get('/list', BookController.listOfBooks);
router.post('/searchByAuthor', BookController.searchByAuthor);
router.post('/searchByTitle', BookController.searchByTitle);
router.put('/update/:book_id', BookController.updateBook);
router.delete('/delete', BookController.deleteBook);


export default router;