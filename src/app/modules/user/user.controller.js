import httpStatus from "http-status-codes";
import { AppError } from "../../../config/errors/error.config.js";
import { asyncHandler, responseFunction } from "../../utils/controller.util.js";
import { createUserService, loginService } from "./user.service.js";

export const login = asyncHandler( async ( req, res ) =>
{
    const { email, password } = req.body;

    if ( !email || !password )
    {
        throw new AppError( 400, "Email and password are required" );
    }

    const user = await loginService(email, password)
    
    responseFunction( res, {
        message: "Welcome back to the website",
        statusCode: httpStatus.OK,
        data: user
    })
} );

export const registerUser = asyncHandler( async ( req, res ) =>
{
    // console.log("hit")

    const newUser = await createUserService( req?.body )
    
    if ( !newUser )
    {
        responseFunction( res, {
            message: `Something went wrong when creating the user`,
            statusCode: httpStatus.EXPECTATION_FAILED,
            data: null,
        } );

        return;
    }

    console.log(newUser)

    responseFunction( res, {
        message: `User created!!`,
        statusCode: httpStatus.CREATED,
        data: newUser,
    } );
})