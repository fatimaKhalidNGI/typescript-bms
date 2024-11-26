import { Router } from "express";
import LibraryFunctionsController from "../controllers/libraryFunctionsController";

import { verifyJWT, authAdmin, authUser } from "../middlewares/userAuth";

const router : Router = Router();

router.use(verifyJWT);

router.put('/borrow', authUser, LibraryFunctionsController.borrowBook);
router.put('/return', LibraryFunctionsController.returnBook);
router.get('/reminders', LibraryFunctionsController.returnReminder);

export default router;