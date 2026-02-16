import httpStatus from "http-status-codes";
import { asyncHandler, responseFunction } from "../../utils/controller.util.js";
import
    {
        blockUserService,
        deleteUserService,
        getAllUsersService,
        getUserByIdService,
        updateUserService,
    } from "./admin.service.js";


export const getAllUsers = asyncHandler( async ( req, res ) =>
{
    const query = req.query;

    const users = await getAllUsersService( query );

    console.log( users )
    
    return responseFunction( res, {
        message: "Users fetched successfully",
        statusCode: httpStatus.OK,
        data: users,
    } );
} );


export const getUserById = asyncHandler( async ( req, res ) =>
{
    const { userId } = req.params;

    const user = await getUserByIdService( userId );

    return responseFunction( res, {
        message: "User fetched successfully",
        statusCode: httpStatus.OK,
        data: user,
    } );
} );


export const updateUser = asyncHandler( async ( req, res ) =>
{
    const { userId } = req.params;
    const payload = req.body;

    const updatedUser = await updateUserService( userId, payload );

    return responseFunction( res, {
        message: "User updated successfully",
        statusCode: httpStatus.OK,
        data: updatedUser,
    } );
} );


export const deleteUser = asyncHandler( async ( req, res ) =>
{
    const { userId } = req.params;

    const deletedUser = await deleteUserService( userId );

    return responseFunction( res, {
        message: "User deleted successfully",
        statusCode: httpStatus.OK,
        data: deletedUser,
    } );
} );


export const blockUser = asyncHandler( async ( req, res ) =>
{
    const { userId } = req.params;

    // true = block, false = unblock
    const { block } = req.body; 

    const updatedUser = await blockUserService( userId, block );

    return responseFunction( res, {
        message: block ? "User blocked successfully" : "User unblocked successfully",
        statusCode: httpStatus.OK,
        data: updatedUser,
    } );
} );