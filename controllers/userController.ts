import { Request, Response } from "express";
import { UserModel } from "../config/dbConfig";

class UserController {
    static listAllUsers = async(req : Request, res : Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        try{
            const { list, total} = await UserModel.listAll(page, limit);

            if(list.length === 0){
                res.status(404).send("No records found");
                return;
            }

            const response = {
                list,
                page,
                total,
                totalPages : Math.ceil(total / limit)
            };

            res.status(200).send(response);

        } catch(error){
            res.status(500).send(error);
        }
    }

    static listUsers = async(req : Request, res : Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        try{
            const { foundUsers, total } = await UserModel.usersList(page, limit);

            if(foundUsers.length === 0){
                res.status(404).send("No users found");
                return;
            }

            const response = {
                foundUsers,
                page,
                total,
                totalPages : Math.ceil(total / limit)
            };

            res.status(200).send(response);

        } catch(error){
            res.status(500).send(error);
        }
    }

    static listAdmins = async(req : Request, res : Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        try{
            const { foundAdmins, total } = await UserModel.adminsList(page, limit);

            if(foundAdmins.length === 0){
                res.status(404).send("No admins found");
                return;
            }

            const response = {
                foundAdmins,
                page,
                total,
                totalPages : Math.ceil(total / limit)
            };

            res.status(200).send(response);

        } catch(error){
            console.log(error);
            res.status(500).send(error);
        }
    }

    static updateUser = async(req : Request, res : Response) => {
        const user_id = parseInt(req.params.user_id, 10);
        const updates = req.body;

        if(!user_id || !updates){
            res.status(400).send("Data missing!");
            return;
        }

        try{
            const updated = await UserModel.updateDetails(user_id, updates);

            if(!updated){
                res.status(404).send("User not found!");
                return;
            }

            res.status(200).send("User updated successfully!");

        } catch(error){
            res.status(500).send(error);
        }
    }

    static removeUser = async(req : Request, res : Response) => {
        const { user_id } = req.body;
        if(!user_id){
            res.status(400).send("User ID missing!");
            return;
        }

        try{
            const checkUser = await UserModel.checkUserExists(user_id);
            if(!checkUser){
                res.status(404).send("User not found");
                return;
            }

            const result : any = await UserModel.deleteUser(user_id);
            res.status(200).send("User deleted successfully");

        } catch(error){
            res.status(500).send(error);
        }
    }
}

export default UserController;