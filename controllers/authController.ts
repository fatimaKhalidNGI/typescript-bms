import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { UserModel } from '../config/dbConfig';
import {getTokens} from '../utils/getTokens';
import { User } from '../models/userModel';

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
                        secure: false, 
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

    static logoutUser = async(req : Request, res : Response) => {
        const cookies = req.cookies;

        console.log(cookies);

        if(!cookies?.jwt){
            res.status(401).send("Not logged in");
            return;
        }

        const refreshToken : string = cookies.jwt;
        console.log("Refresh token from request cookies: ", refreshToken);

        try{
            const foundUser : User = await UserModel.checkUser_logout(refreshToken);

            if(!foundUser){
                res.clearCookie('jwt', {
                    httpOnly : true,
                    sameSite : 'none',
                    secure : true
                });

                res.status(204).send("Done");
            }

            console.log("found user: ", foundUser);

            const result = await UserModel.logoutFunction(foundUser.user_id);

            if(result === "Success"){
                res.clearCookie('jwt', {
                    httpOnly : true,
                    sameSite : 'none',
                    secure : true
                });
            }

            res.status(204).send("Done");

        } catch(error){
            console.log(error);
            res.status(500).send(error);
        }

    }
}

export default AuthController;