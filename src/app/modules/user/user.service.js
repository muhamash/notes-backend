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