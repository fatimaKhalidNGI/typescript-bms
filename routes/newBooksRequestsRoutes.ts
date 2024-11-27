import { Router } from "express";
import NewBooksRequests from "../controllers/newBooksRequest";

import { verifyJWT, authAdmin, authUser } from "../middlewares/userAuth";

const router : Router = Router();

router.use(verifyJWT);

router.post('/request', authUser, NewBooksRequests.makeRequest);
router.get('/getAllRequests', authAdmin, NewBooksRequests.getAllRequests);
router.get('/userList', authUser, NewBooksRequests.getOwnRequests);
router.put('/respond', authAdmin, NewBooksRequests.respondAdmin);

export default router;