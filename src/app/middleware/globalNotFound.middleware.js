import httpStatus from 'http-status-codes';
import { asyncHandler, responseFunction } from '../utils/controller.util.js';

export const globalNotFoundResponse = asyncHandler( async ( req, res, next ) =>
{
    responseFunction( res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Route not found!",
        data: null
    } );
} );