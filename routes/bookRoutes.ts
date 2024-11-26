import { Router } from 'express';
import BookController from '../controllers/booksController';
import { verifyJWT, authAdmin, authUser } from '../middlewares/userAuth';

const router : Router = Router();

router.use(verifyJWT);

router.post('/create', authAdmin, BookController.addNewBook);
router.get('/list', BookController.listOfBooks);
router.post('/searchByAuthor', BookController.searchByAuthor);
router.post('/searchByTitle', BookController.searchByTitle);
router.put('/update/:book_id', authAdmin, BookController.updateBook);
router.delete('/delete', authAdmin, BookController.deleteBook);


export default router;