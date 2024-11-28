import { DataTypes, Model, Sequelize, Association, QueryTypes } from "sequelize";
import { User } from "./userModel"; 
import { sequelize } from "../config/dbConfig";

interface RequestAttributes {
    request_id? : number;
    book_title : string;
    book_author : string;
    status : string;
    admin_response : string | null;
    user_id? : number | null;
}


export class Request extends Model<RequestAttributes> implements RequestAttributes{
    public request_id!: number;
    public book_title!: string;
    public book_author!: string;
    public status!: string;
    public admin_response!: string | null;
    public user_id!: number | null;

    public static associations : {
        requestedBy: Association<Request, User>
    }

    public static associate = (models : any) => {
        Request.belongsTo(models.UserModel, {
            foreignKey : 'user_id',
            as : 'requestedBy'
        });
    }

    public static createRequest = async(book_title : string, book_author : string, user_id : number|undefined) => {
        const query = `INSERT INTO requests (book_title, book_author, status, admin_response, user_id) VALUES (:book_title, :book_author, "Pending", NULL, :user_id)`;
        const values = { book_title, book_author, user_id};

        try{
            const newRequest = await sequelize.query(query, {
                replacements : values,
                type : QueryTypes.INSERT
            });

           
            return newRequest;

        } catch(error){
            throw new Error(`Error in creating new request: ${error}`);
        }
    }

    public static getAll = async(page : number, limit : number) => {
        const offset = (page - 1) * limit;
        const query = `SELECT book_title, book_author, status, admin_response FROM requests ORDER BY book_title LIMIT :limit OFFSET :offset`;
        const countQuery = `SELECT COUNT(*) AS total FROM requests`;

        const values = { limit, offset };

        try{
            const requestList = await sequelize.query(query, {
                replacements : values,
                type : QueryTypes.SELECT
            });

            const totalCountResult : any[] = await sequelize.query(countQuery, {
                type : QueryTypes.SELECT
            });
            const total = totalCountResult[0].total;

            return { requestList, total };

        } catch(error){
            throw new Error(`Error in getting all filed requests: ${error}`);
        }
    }

    public static getOwn = async(user_id : number | undefined, page : number, limit : number) => {
        const offset = (page - 1) * limit;
        
        const query = `SELECT book_title, book_author, status, admin_response FROM requests WHERE user_id = :user_id ORDER BY book_title LIMIT :limit OFFSET :offset`;
        const countQuery = `SELECT COUNT(*) as total FROM requests WHERE user_id = :user_id`;
        
        const values = { user_id, limit, offset };

        try{
            const [ownRequests] = await sequelize.query(query, {
                replacements : values,
                type : QueryTypes.SELECT
            });

            const totalCountResult : any[] = await sequelize.query(countQuery, {
                replacements : values,
                type : QueryTypes.SELECT
            }); 
            const total = totalCountResult[0].total;

            return { ownRequests, total };

        } catch(error){
            throw new Error(`Error in getting user's requests: ${error}`);
        }
    }

    public static respond = async(request_id : number, status : string, admin_response : string) => {
        const query = `UPDATE requests SET status = :status, admin_response = :admin_response WHERE request_id = :request_id`;
        const values = { status, admin_response, request_id };

        try{
            const markResponse = await sequelize.query(query, {
                replacements : values,
                type : QueryTypes.UPDATE
            });

            return markResponse;

        } catch(error){
            throw new Error(`Error in marking response: ${error}`);
        }
    }

    public static requestDetails = async(request_id : number) => {
        const query = `SELECT book_title, book_author FROM requests WHERE request_id = :request_id`;
        const values = { request_id };

        try{
            const [bookDetails] = await sequelize.query(query, {
                replacements : values,
                type : QueryTypes.SELECT
            });

            return bookDetails;

        } catch(error){
            throw new Error(`Error in getting request details: ${error}`);
        }
    }
}

export default (sequelize : Sequelize) : typeof Request => {
    Request.init(
        {
            request_id : {
                type : DataTypes.INTEGER,
                autoIncrement : true,
                primaryKey : true
            },

            book_title : {
                type : DataTypes.STRING,
                allowNull : false
            },

            book_author : {
                type : DataTypes.STRING,
                allowNull : false
            },

            status : {
                type : DataTypes.STRING,
                allowNull : false
            },

            admin_response : {
                type : DataTypes.STRING,
                allowNull : true
            }
        },
        {
            sequelize,
            modelName : 'Request',
            tableName : 'requests',
            timestamps : false
        }
    );
    
    return Request;
}

