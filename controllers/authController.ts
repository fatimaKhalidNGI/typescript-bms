import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { UserModel } from '../config/dbConfig';
import {getTokens} from '../utils/getTokens';

dotenv.config({ path : '../.env'});

class AuthController {
    static registerUser = async(req : Request, res : Response) : Promise<any> => {
        const { name, email, password, role } : {
            name : string,
            email : string,
            password : string,
            role : string
        } = req.body;

        if(!name || !email || !password || !role){
            return res.status(200).send("Data missing!");
        }

        try{
            const duplicateUser = await UserModel.checkDuplicateUser(email);
            
            if(duplicateUser[0].length > 0){
                return res.status(400).send("User already registered against this email");
            }

            const hashedPwd = await bcrypt.hash(password, 10);

            const newUser = await UserModel.registerNewUser(name, email, hashedPwd, role);

            res.status(200).send("User registered successfully!");

        } catch(error){
            console.log(error);
            res.status(500).send(error);
        }
    }

    static loginUser = async(req : Request, res : Response) : Promise<any> => {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).send("Credentials missing!");
        }

        try{
            const foundUser = await UserModel.findUser_login(email);
            if(!foundUser){
                return res.status(404).send("User not found");
            }

            console.log(foundUser);

            const pwdMatch = await bcrypt.compare(password, foundUser.password);
            console.log("password match: ", pwdMatch);

            if(pwdMatch){
                try{
                    const { accessToken, refreshToken } = getTokens(foundUser);
                    
                    const userLoggedIn = await UserModel.loginFunction(foundUser.user_id, refreshToken);
                    if (userLoggedIn !== "Success") {
                        return res.status(500).send("Failed to log user in");
                    }

                    res.cookie('jwt', refreshToken, {
                        httpOnly: true,
                        sameSite: 'none',
                        secure: true, 
                        maxAge: 24 * 60 * 60 * 1000,
                    });

                    res.status(200).send(accessToken);

                } catch(error){
                    console.log(error);
                    return res.status(500).send(error);
                }
            }
        } catch(error){
            console.log(error);
            res.status(500).send(error);
        }
    }
}

export default AuthController;