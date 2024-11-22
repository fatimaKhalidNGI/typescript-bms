import { DataTypes, Model, Sequelize, Association } from "sequelize";
import { User } from "./userModel"; 

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

