import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { AppError } from "../../../config/errors/error.config.js";
import { USER_ACTION, USER_ROLES } from "../../utils/enums/users.enum.js";
import { isValidObjectId } from "../../utils/service.util.js";
import { Note } from "../note/note.model.js";
import { Post } from "../post/post.model.js";
import { User } from "../user/user.model.js";


export const deleteUserService = async ( userId ) =>
{
    if ( !isValidObjectId( userId ) )
    {
        throw new AppError( httpStatus.BAD_REQUEST, "Invalid user ID" );
    }

    const findUser = await User.findById( userId );
    if ( !findUser )
    {
        throw new AppError( httpStatus.NOT_FOUND, "User not found" );
    }


    if ( findUser.role === USER_ROLES.ADMIN )
    {
        throw new AppError( httpStatus.FORBIDDEN, "Admin modification not allowed" );
    }

  
    await Promise.all( [
        Post.deleteMany( { user: userId } ), 
        Note.deleteMany( { user: userId } ), 
    ] );

    const deletedUser = await User.findByIdAndDelete( userId ).select( "-password" ).lean();

    if ( !deletedUser )
    {
        throw new AppError( httpStatus.NOT_FOUND, "User already deleted" );
    }

    return deletedUser;
};

export const blockUserService = async ( userId, block = true ) =>
{
    if ( !isValidObjectId( userId ) )
    {
        throw new AppError( httpStatus.BAD_REQUEST, "Invalid user ID" );
    }

    const user = await User.findById( userId ).select( "-password" ).lean();
    if ( !user )
    {
        throw new AppError( httpStatus.NOT_FOUND, "User not found" );
    }

    if ( user?.role === USER_ROLES.ADMIN )
    {
        throw new AppError( httpStatus.FORBIDDEN, "Admin modification not allowed" );
    }

    const newStatus = block ? USER_ACTION.BLOCKED : USER_ACTION.ACTIVE;

    if ( user.userAction === newStatus )
    {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `User is already ${block ? "blocked" : "active"}`
        );
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { userAction: newStatus },
        { new: true, runValidators: true }
    ).select( "-password" ).lean();

    return updatedUser;
};


export const getAllUsersService = async ( query ) =>
{
    let page = Number( query.page ) || 1;
    let limit = Number( query.limit ) || 10;

    if ( page < 1 ) page = 1;
    if ( limit < 1 ) limit = 10;
    if ( limit > 100 ) limit = 100;

    const skip = ( page - 1 ) * limit;
    const total = await User.countDocuments( {} );

    const users = await User.find( {} )
        .select( "-password" )
        .sort( { createdAt: -1 } )
        .skip( skip )
        .limit( limit )
        .lean();

    return {
        data: users,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil( total / limit ),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
        },
    };
};

 
export const getUserByIdService = async ( userId ) =>
{
    if ( !isValidObjectId( userId ) )
    {
        throw new AppError( httpStatus.BAD_REQUEST, "Invalid user ID" );
    }

    const user = await User.findById( userId ).select( "-password" ).lean();

    if ( !user )
    {
        throw new AppError( httpStatus.NOT_FOUND, "User not found" );
    }

    return user;
};


export const updateUserService = async ( userId, payload ) =>
{
    if ( !isValidObjectId( userId ) )
    {
        throw new AppError( httpStatus.BAD_REQUEST, "Invalid user ID" );
    }

    if ( !payload || Object.keys( payload ).length === 0 )
    {
        throw new AppError( httpStatus.BAD_REQUEST, "Update payload cannot be empty" );
    }

    const findUser = await User.findById( userId );
    
    if ( findUser?.role === USER_ROLES.ADMIN )
    {
        throw new AppError( httpStatus.FORBIDDEN, "Admin modification not allowed" );
    }

    if ( payload.password )
    {
        const salt = await bcrypt.genSalt( 10 );
        payload.password = await bcrypt.hash( payload.password, salt );
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: payload },
        { new: true, runValidators: true }
    ).select( "-password" ).lean();

    if ( !updatedUser )
    {
        throw new AppError( httpStatus.NOT_FOUND, "User not found or update failed" );
    }

    return updatedUser;
};
