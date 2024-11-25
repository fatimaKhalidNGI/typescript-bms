import { DataTypes, Model, Sequelize, Association, QueryTypes } from "sequelize";
import { Book } from './bookModel';
import { Request } from "./requestModel";
import { sequelize } from "../config/dbConfig";

interface UserAttributes {
    user_id? : number;
    name : string;
    email : string;
    password : string;
    role : string;
    refresh_token? : string | null;
}

export class User extends Model<UserAttributes> implements UserAttributes {
    public user_id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public role!: string;
    public refresh_token!: string | null;

    public static associations : {
        books: Association<User, Book>;
        bookRequest : Association<User, Request>;
    }

    public static associate = (models: any) => {
        User.hasMany(models.BookModel, {
            foreignKey: 'user_id',
            as: 'books',
        });

        User.hasMany(models.RequestModel, {
            foreignKey: 'user_id',
            as: 'bookRequest',
        });
    }

    public static checkDuplicateUser = async(email : string) : Promise<any[]> => {
        const query = `SELECT * FROM users WHERE email = :email`;
        const replacements = { email };

        try{
            const duplicateUser = await sequelize.query(query, {
                replacements,
                type : QueryTypes.SELECT
            });

            return [duplicateUser];

        } catch(error){
            throw new Error(`Error in checking duplicates: ${error}`);
        }
    }

    public static registerNewUser = async(name : string, email : string, password : string, role : string) : Promise<any> => {
        const query = `INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)`;
        const replacements = { name, email, password, role };

        try{
            const [newUser] = await sequelize.query(query, {
                replacements,
                type : QueryTypes.INSERT
            });

            return newUser;

        } catch(error){
            throw new Error(`Error in registering user: ${error}`);
        }
    }

    public static findUser_login = async(email : string) : Promise<any> => {
        const query = `SELECT * FROM users WHERE email = :email`;
        const values = { email };

        try{
            const [foundUser] = await sequelize.query(query, {
                replacements : values,
                type : QueryTypes.SELECT
            });

            return foundUser;

        } catch(error){
            throw new Error(`Error in finding user: ${error}`);
        }
    }

    public static loginFunction = async(user_id : number, refreshToken : string) : Promise<string> => {
        const query = `UPDATE users SET refresh_token = :refresh_token WHERE user_id = :user_id`;
        const values = { refresh_token : refreshToken, user_id };

        try{
            const result = await sequelize.query(query, {
                replacements : values,
                type: QueryTypes.UPDATE, // Explicitly declare query type
            });
            
            return "Success";

        } catch(error){
            throw new Error(`Error in logging user in: ${error}`);
        }
    }
}

export default (sequelize : Sequelize) : typeof User => {
    User.init(
        {
            user_id : {
                type : DataTypes.INTEGER,
                autoIncrement : true,
                primaryKey : true
            },
            name : {
                type : DataTypes.STRING,
                allowNull : false
            },
        
            email : {
                type : DataTypes.STRING,
                allowNull : false,
                //unique : true
            },
        
            password : {
                type : DataTypes.STRING,
                allowNull : false
            },
        
            role : {
                type : DataTypes.STRING,
                allowNull : false
            },
    
            refresh_token : {
                type : DataTypes.STRING,
                allowNull : true
            }
        },
        {
            sequelize,
            modelName : 'User',
            tableName : 'users',
            timestamps : false
        }
    );

    return User;
}