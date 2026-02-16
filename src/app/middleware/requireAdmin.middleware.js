import httpStatus from "http-status-codes";
import { AppError } from "../../config/errors/error.config.js";
import { User } from "../modules/user/user.model.js";
import { USER_ACTION, USER_ROLES } from "../utils/enums/users.enum.js";

export const requireAdmin = async ( req, res, next ) =>
{
    try
    {
        if ( !req.user )
        {
            throw new AppError( httpStatus.UNAUTHORIZED, "Unauthorized access" );
        }

        // fresh user from DB
        const user = await User.findOne( {email: req.user.email} ).select( "-password" );

        if ( !user )
        {
            throw new AppError( httpStatus.NOT_FOUND, "User not found" );
        }

        
        if ( user.userAction === USER_ACTION.BLOCKED )
        {
            throw new AppError(
                httpStatus.FORBIDDEN,
                "Your account is blocked"
            );
        }

        // Check role
        if ( user.role !== USER_ROLES.ADMIN )
        {
            throw new AppError(
                httpStatus.FORBIDDEN,
                "Access denied. Admins only."
            );
        }

        req.currentUser = user;

        next();
    }
    catch ( error )
    {
        next( error );
    }
};