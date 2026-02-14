import httpStatus from 'http-status-codes';
import mongoose from "mongoose";
import { envStrings } from '../env.config.js';
import { AppError } from '../errors/error.config.js';

export const dbConnect = async () =>
{

    try
    {
        await mongoose.connect( envStrings.DB_URL );
        
        console.log( `MongoDB database is connected!!` )
    }
    catch ( error )
    {
        let message = 'Unknown error';

        if ( error instanceof Error )
        {
            message = error.message;
        }

        throw new AppError( httpStatus.BAD_GATEWAY, message );
    }
};