import { Router } from "express";
import UserController from '../controllers/userController';

import { verifyJWT, authAdmin } from '../middlewares/userAuth';

const router : Router = Router();

router.use(verifyJWT);

router.get('/list', authAdmin, UserController.listAllUsers);
router.get('/listUsers', authAdmin, UserController.listUsers);
router.get('/listAdmins', authAdmin, UserController.listAdmins);
router.put('/update/:user_id', authAdmin, UserController.updateUser);
router.delete('/delete', authAdmin, UserController.removeUser);


export default router;