import { DataTypes, Model, Sequelize, Association } from "sequelize";
import { Book } from './bookModel';
import { Request } from "./requestModel";

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
    };
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