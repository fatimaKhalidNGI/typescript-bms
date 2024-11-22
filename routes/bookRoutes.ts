import { Router } from 'express';
import BookController from '../controllers/booksController';

const router : Router = Router();

router.post('/create', BookController.addNewBook);
router.get('/list', BookController.listOfBooks);

export default router;