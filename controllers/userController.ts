import { Request, Response } from "express";
import { UserModel } from "../config/dbConfig";

class UserController {
    static listAllUsers = async(req : Request, res : Response) => {
        try{
            const completeList = await UserModel.listAll();

            if(completeList.length === 0){
                res.status(404).send("No records found");
                return;
            }

            res.status(200).send(completeList);

        } catch(error){
            console.log(error);
            res.status(500).send(error);
        }
    }

    static listUsers = async(req : Request, res : Response) => {
        try{
            const usersList = await UserModel.usersList();

            if(usersList.length === 0){
                res.status(404).send("No users found");
                return;
            }

            res.status(200).send(usersList);

        } catch(error){
            console.log(error);
            res.status(500).send(error);
        }
    }

    static listAdmins = async(req : Request, res : Response) => {
        try{
            const adminsList = await UserModel.adminsList();

            if(adminsList.length === 0){
                res.status(404).send("No admins found");
                return;
            }

            res.status(200).send(adminsList);

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
            console.log(error);
            res.status(500).send(error);
        }
    }
}

export default UserController;