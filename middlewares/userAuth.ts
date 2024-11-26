import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
    user_id? : number;
    role? : string;
}

const verifyJWT = (req : CustomRequest, res : Response, next : NextFunction) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader?.startsWith('Bearer ')){
        res.status(401).send("Unauthorized");
        return;
    }

    const token = authHeader.split(' ')[1];
    console.log("JWT: ", token);
    console.log("Access secret: ", process.env.ACCESS_TOKEN_SECRET);

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
        (err, decoded) => {
            if(err){
                return res.status(403).send("Invalid token");
            }

            console.log("Inside JWT");

            const decodedPayload = decoded as JwtPayload & {
                UserInfo: {
                    user_id : number;
                    role : string;
                }
            };

            req.user_id = decodedPayload.UserInfo.user_id;
            req.role = decodedPayload.UserInfo.role;

            next();
        }
    );
}

const authAdmin = async(req : CustomRequest, res : Response, next : NextFunction) => {
    if(req.role !== "Admin"){
        res.status(401).send("Unauthorized");
    }

    next();
}

const authUser = async(req : CustomRequest, res : Response, next : NextFunction) => {
    if(req.role !== "User"){
        res.status(401).send("Unauthorized");
    }

    next();
}

export { verifyJWT, authAdmin, authUser }; 