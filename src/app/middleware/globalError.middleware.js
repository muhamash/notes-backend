import httpStatus from "http-status-codes";
import { AppError } from "../../config/errors/error.config";
import { isZodError, parseZodError } from "../utils/service.util";

export const globalErrorResponse = ( error, req, res, next ) =>
{
    let statusCode = httpStatus.BAD_REQUEST;
    let message = "Something went wrong";
    let stack;

    // Zod validation errors
    if ( isZodError && isZodError( error ) )
    {
        const zodError = error;
        const fieldIssues = parseZodError( zodError ) || [];
        let fieldName = fieldIssues[ 0 ]?.field || "unknown_field";
        let errorMessage = fieldIssues[ 0 ]?.message || "Validation error";

        message = `Validation error on field '${fieldName}': ${errorMessage}`;

        return res.status( httpStatus.BAD_REQUEST ).json( {
            name: zodError.name || "ZodError",
            message,
            status: httpStatus.BAD_REQUEST,
            success: false,
            errors: fieldIssues,
            ...( process.env.NODE_ENV === "development" && { stack: zodError.stack } ),
        } );
    }

    //  Mongoose duplicate key error for unique constraints
    else if ( error.name === "MongoServerError" && error.code === 11000 )
    {
        const duplicateField = Object.keys( error.keyValue ).join( ", " );
        statusCode = httpStatus.CONFLICT;
        message = `Duplicate value for field(s): ${duplicateField}`;
    }

    //  custom AppError
    else if ( error instanceof AppError )
    {
        statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        message = error.message;
        stack = error.stack;
    }

    //  generic Error
    else if ( error instanceof Error )
    {
        message = error.message;
        stack = error.stack;
        statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    }

    // Fallback to unknown error
    else
    {
        message = "An unexpected error occurred.";
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }

    console.error( error );

    const responsePayload = {
        name: error.name || "Error",
        message,
        status: statusCode,
        success: false,
    };

    if ( process.env.NODE_ENV === "development" && stack )
    {
        responsePayload.stack = stack;
    }

    return res.status( statusCode ).json( responsePayload );
};