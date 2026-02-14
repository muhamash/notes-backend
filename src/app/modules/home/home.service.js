import { StatusCodes } from "http-status-codes";
import { asyncHandler, responseFunction } from "../../utils/controller.util.js";


export const homeRoute = asyncHandler( async ( req, res, next ) => 
{
    
    responseFunction( res, {
        message: `This is the home route! Service is running!`,
        statusCode: StatusCodes.OK,
        data: null
    } )
} );