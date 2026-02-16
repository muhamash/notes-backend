import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { AppError } from "../../../config/errors/error.config.js";
import { parsedDataFn } from "../../utils/controller.util.js";
import { User } from "./user.model.js";

export const loginService = async ( email, password ) =>
{
    const user = await User.findOne( { email } ).select( "+password" );
    
    if ( !user )
    {
        throw new AppError( 401, "Invalid email or password" );
    }
    
    const isPasswordMatched = await bcrypt.compare( password, user.password );
    
    console.log(isPasswordMatched, user, password)

    if ( !isPasswordMatched )
    {
        throw new AppError( 401, "Invalid email or password" );
    }
    
      
    user.password = undefined;
    
    return parsedDataFn( user );
};


export const createUserService = async (payload) =>
{
    const { email, ...rest } = payload;
    

    const existingUser = await User.findOne( { email } )

    if ( existingUser )
    {
        throw new AppError( httpStatus.CONFLICT, "User already exists with this email" );
    }

    const user = await User.create( { email, ...rest } );

    const userObj = user.toObject();
    delete userObj.password;
    

    return parsedDataFn(userObj)
}

export const getGroupedByUsersAndInterestsService = async () =>
{
    const result = await User.aggregate( [
        {
            $match: {
                userAction: { $ne: "BLOCKED" }
            }
        },
        
        {
            $unwind: "$interests"
        },
        {
            $group: {
                _id: "$interests",
                users: {
                    $push: {
                        _id: "$_id",
                        name: "$name",
                        email: "$email",
                        role: "$role",
                        userAction: "$userAction",
                        createdAt: "$createdAt"
                    }
                },
                totalUsers: { $sum: 1 }
            }
        },

        
        {
            $sort: { _id: 1 }
        },

        
        {
            $project: {
                _id: 0,
                interest: "$_id",
                totalUsers: 1,
                users: 1
            }
        }
    ] );

    if ( !result || result.length === 0 )
    {
        throw new AppError( httpStatus.NOT_FOUND, "No interests found" );
    }

    return parsedDataFn(result);
};