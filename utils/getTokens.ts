import jwt from 'jsonwebtoken';

interface FoundUser {
    user_id : number;
    role : string;
}

interface Tokens {
    accessToken : string;
    refreshToken : string;
}

export const getTokens = (foundUser : FoundUser) : Tokens => {
    if(!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET){
        throw new Error("Token secrets not present in env file");
    }

    const accessToken = jwt.sign(
        {
            "UserInfo" : {
                user_id : foundUser.user_id,
                role : foundUser.role
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn : '10m'}
    );

    const refreshToken = jwt.sign(
        {
            "UserInfo" : {
                user_id : foundUser.user_id,
                role : foundUser.role
            }
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn : '30m'}
    );

    return { accessToken, refreshToken };
}